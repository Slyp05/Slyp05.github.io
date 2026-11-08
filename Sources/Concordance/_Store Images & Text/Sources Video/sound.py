"""Builds the store video's soundtrack: the gravity scale as notes, overwriting each other without Concordance and stacking
into a chord with it.

Usage: python sound.py [out.wav]   (default: soundtrack.wav beside this file)

Everything is synthesized with numpy from a fixed seed, so the output is identical on every run. The score runs at 120 BPM
(a beat is 0.5 s, a bar 2 s) from 0 s, in D major.

Notes play only while the character runs, one per zone edge, on the beat it crosses it: the note of the value that edge
sets (1 is D, home; -1 is the A below; 2 is F#).

- Without Concordance each note is short and cuts the last, over a soft D minor and one slow kick a bar. The run ends on
  the A of the wrong value, left hanging.
- With Concordance each zone's note holds while its Modifier applies, so Flip and Heavy stack into a chord and leave it
  note by note, and leaving the last zone lands home on D with the chord, over the groove.

"With Concordance" starts the groove and keeps it under the window and the code cards: four on the floor, claps, open hats
on the offbeats, an octave bass in eighths and offbeat chord stabs. The "Without Concordance" card holds a soft low D minor;
the end card rings a bell per ring, then the chord.
"""
import sys
import wave
import numpy as np

SR = 48000
LENGTH = 36.6
VIDEO_END = 36.0
BEAT = 0.5
BAR = 4 * BEAT

# Phrase starts, matching animatic.html: each run starts with its phrase and reaches its zone edges 1, 2, 3.5 and 4.5 s in.
PLAIN, CONCORD = 2.0, 22.0
EDGES = [2, 4, 7, 9]                  # in beats: enter flip, enter heavy, leave heavy, leave flip
WITHOUT, WITH = 0.0, 10.0                    # the two title cards
CONFLICT, ONE_LINE, FINAL = 12.0, 16.0, 30.0  # the window catching the conflict, the code cards, the end card

rng = np.random.default_rng(11)
N = int(LENGTH * SR)
music = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def hz(note):
    """MIDI note number to frequency."""
    return 440.0 * 2 ** ((note - 69) / 12)


def t_axis(duration):
    return np.arange(int(duration * SR)) / SR


def place(bus, start, sig, gain=1.0, pan=0.0):
    """Adds a mono or stereo signal to a bus at a time in seconds; pan from -1 (left) to 1 (right)."""
    i = int(start * SR)
    if i >= N or i < 0:
        return
    if sig.ndim == 1:
        left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * left, sig * right], axis=1) * np.sqrt(2)
    end = min(N, i + len(sig))
    bus[i:end] += sig[:end - i] * gain


def fft_filter(sig, low=None, high=None):
    """Zero-phase band limit by FFT with soft shoulders."""
    n = len(sig)
    spec = np.fft.rfft(sig, axis=0)
    f = np.fft.rfftfreq(n, 1 / SR)
    gain = np.ones_like(f)
    if high is not None:
        gain *= 1 / (1 + (f / high) ** 4)
    if low is not None:
        gain *= 1 / (1 + (low / np.maximum(f, 1e-3)) ** 4)
    if sig.ndim == 2:
        gain = gain[:, None]
    return np.fft.irfft(spec * gain, n, axis=0)


def saw(f, t, limit=6000):
    sig = np.zeros_like(t)
    for k in range(1, int(min(limit / f, 40)) + 1):
        sig += np.sin(2 * np.pi * f * k * t) / k
    return sig


def hold(t, duration, attack, release):
    return np.minimum(t / max(attack, 1e-4), 1.0) * np.clip((duration + release - t) / release, 0, 1)


# Instruments.

def epiano(note, length, release=0.25, detune=0.0):
    """The value's notes: an electric piano, held for `length` seconds then released; a short release cuts it."""
    t = t_axis(length + release)
    f = hz(note + detune)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t / 1.6) + 0.18 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.5)
    return sig * hold(t, length, 0.012, release)


def flute(note, length):
    """The flip zone's voice: soft, breathy, a slow swell."""
    t = t_axis(length + 0.3)
    f = hz(note) * (1 + 0.003 * np.sin(2 * np.pi * 5 * t))
    phase = 2 * np.pi * np.cumsum(f) / SR
    breath = fft_filter(rng.standard_normal(len(t)), low=hz(note) * 2, high=hz(note) * 6) * 0.05
    return (np.sin(phase) + 0.15 * np.sin(3 * phase) + breath) * hold(t, length, 0.08, 0.3) * 0.7


def low_voice(note, length):
    """The heavy zone's voice: a round low octave."""
    t = t_axis(length + 0.2)
    sig = np.sin(2 * np.pi * hz(note) * t) + 0.3 * fft_filter(saw(hz(note), t, 1500), high=700)
    return sig * hold(t, length, 0.02, 0.2)


def pad(notes, length, attack=0.5, release=0.6, bright=1300):
    t = t_axis(length + release)
    sig = np.zeros_like(t)
    for note in notes:
        for d in (-0.07, 0.07):
            sig += saw(hz(note + d), t + rng.random())
    return fft_filter(sig, high=bright) * hold(t, length, attack, release) / (len(notes) * 4)


def bass(note, length):
    t = t_axis(length + 0.1)
    sig = np.sin(2 * np.pi * hz(note) * t) + 0.2 * fft_filter(saw(hz(note), t, 1000), high=500)
    return sig * hold(t, length, 0.01, 0.1) * np.exp(-t / 1.5)


def bell(note, length=2.0):
    t = t_axis(length)
    f = hz(note)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.3)) * np.exp(-t / 0.8) * np.minimum(t / 0.002, 1)


def kick():
    t = t_axis(0.35)
    return np.sin(2 * np.pi * np.cumsum(48 + 70 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.14)


def snare():
    t = t_axis(0.25)
    return 0.4 * np.sin(2 * np.pi * 200 * t) * np.exp(-t / 0.04) + fft_filter(rng.standard_normal(len(t)), low=1500, high=8000) * np.exp(-t / 0.07)


def shaker():
    t = t_axis(0.09)
    return fft_filter(rng.standard_normal(len(t)), low=6000, high=12000) * np.minimum(t / 0.01, 1) * np.exp(-t / 0.025)


def noise_sweep(duration, f0, f1):
    n = int(duration * SR)
    noise = rng.standard_normal(n)
    t = np.arange(n) / SR
    out = np.zeros(n)
    bands = np.geomspace(f0, f1, 6)
    for i, fc in enumerate(bands):
        w = np.clip(1 - np.abs(t / duration - i / (len(bands) - 1)) * (len(bands) - 1), 0, 1)
        out += fft_filter(noise, low=fc / 1.6, high=fc * 1.6) * w
    return out * np.sin(np.pi * t / duration)


def clap():
    t = t_axis(0.3)
    sig = np.zeros_like(t)
    for d in (0.0, 0.011, 0.022):
        i = int(d * SR)
        sig[i:] += fft_filter(rng.standard_normal(len(t) - i), low=900, high=7000) * np.exp(-t[:len(t) - i] / (0.012 if d < 0.02 else 0.12))
    return sig


def open_hat():
    t = t_axis(0.25)
    return fft_filter(rng.standard_normal(len(t)), low=7000) * np.exp(-t / 0.07)


def stab(tones):
    """A short bright chord on the offbeat, the groove's lift."""
    t = t_axis(0.22)
    sig = np.zeros_like(t)
    for note in tones:
        for d in (-0.06, 0.06):
            sig += saw(hz(note + 12 + d), t, 7000)
    return fft_filter(sig, high=4200) * np.exp(-t / 0.08) * np.minimum(t / 0.003, 1) / (len(tones) * 4)


def fill(start):
    """A snare run over one beat, into the next bar."""
    for i in range(4):
        place(music, start + i * BEAT / 4, snare(), 0.06 + 0.03 * i, pan=0.05)


# Arrangement helpers.

def groove(start, length, chord, gain=1.0):
    """`length` beats of four on the floor, claps, offbeat open hats, an octave bass in eighths and offbeat stabs; `chord(beat)`
    gives the root and tones under each beat."""
    for b in range(length):
        t = start + b * BEAT
        root, tones = chord(b)
        place(music, t, kick(), 0.36 * gain)
        if b % 2 == 1:
            place(music, t, clap(), 0.11 * gain, pan=0.08)
        place(music, t + BEAT / 2, open_hat(), 0.05 * gain, pan=0.3)
        for e in range(4):
            place(music, t + e * BEAT / 4, shaker(), (0.035 if e % 2 else 0.02) * gain, pan=-0.3)
        place(music, t, bass(root, BEAT / 2 - 0.03), 0.24 * gain)
        place(music, t + BEAT / 2, bass(root + 12, BEAT / 2 - 0.03), 0.18 * gain)
        place(music, t + BEAT / 2, stab(tones), 0.22 * gain, pan=(-0.25 if b % 2 else 0.25))


# The value's notes: gravity scale 1 is D4, home; -1 is A3; 2 is F#4. Each zone edge plays the note of the value it sets.
NOTE = {1: 62, -1: 57, 2: 66}


def plain_phrase(start, gain):
    """Without Concordance: one short note per zone edge, each cutting the last, ending on the A of the wrong value."""
    values = [-1, 2, 1, -1]
    for i, (edge, value) in enumerate(zip(EDGES, values)):
        t = start + edge * BEAT
        nxt = (EDGES[i + 1] - edge) * BEAT if i + 1 < len(EDGES) else 1.6
        place(music, t, epiano(NOTE[value], nxt - 0.05, release=0.08), gain, pan=(-0.25 if value < 0 else 0.25))
    # A soft D minor under the whole run, and one slow kick a bar.
    place(music, start, pad([38, 50, 62, 65, 69], 4 * BAR - 0.1, attack=0.5, release=0.6, bright=800), 0.2)
    for b in range(0, 16, 4):
        place(music, start + b * BEAT, kick(), 0.18)


def concord_phrase(start, gain):
    """With Concordance: each zone's note holds while its Modifier applies, so they stack into a chord and leave it note by
    note; leaving the last zone lands home on D, with the chord."""
    flip_on, heavy_on, heavy_off, flip_off = (start + e * BEAT for e in EDGES)
    place(music, flip_on, epiano(NOTE[-1], flip_off - flip_on, release=0.4), gain, pan=-0.25)
    place(music, flip_on, flute(NOTE[-1] + 12, flip_off - flip_on), gain * 0.25, pan=-0.35)
    place(music, heavy_on, epiano(NOTE[2], heavy_off - heavy_on, release=0.4), gain, pan=0.25)
    place(music, heavy_on, low_voice(NOTE[2] - 24, heavy_off - heavy_on), gain * 0.45, pan=0.3)
    # Leaving Heavy plays the value it gives back, -1: Flip's A, struck again an octave up over its held note.
    place(music, heavy_off, epiano(NOTE[-1] + 12, flip_off - heavy_off, release=0.4), gain * 0.8, pan=-0.15)
    place(music, flip_off, epiano(NOTE[1], 2.4, release=0.8), gain * 1.1)
    place(music, flip_off, epiano(NOTE[1] + 4, 2.4, release=0.8), gain * 0.5, pan=-0.2)
    place(music, flip_off, epiano(NOTE[1] + 7, 2.4, release=0.8), gain * 0.5, pan=0.2)
    place(music, flip_off, epiano(NOTE[1] + 12, 2.0, release=0.8), gain * 0.35, pan=0.1)
    # The groove under the run, a chord a bar like the rest of the groove (changing on a zone edge falls mid-bar and makes it
    # stumble): D, B minor, G, then home on D as the character lands.
    chords = [(38, [62, 66, 69]), (35, [59, 62, 66]), (31, [59, 62, 67]), (38, [62, 66, 69])]
    groove(start, 16, lambda b: chords[b // 4], 1.0)
    for i, (root, tones) in enumerate(chords):
        place(music, start + i * BAR, pad([root + 12] + tones, BAR - 0.05, attack=0.2, release=0.3), 0.16)


# "Without Concordance": a soft, low D minor under the card, then the run's notes.
place(music, WITHOUT, pad([38, 50, 62, 65, 69], 1.8, attack=0.2, release=0.4, bright=700), 0.26)
place(music, WITHOUT, bass(38, 1.8), 0.16)
plain_phrase(PLAIN, 0.36)

# "With Concordance": a snare fill, then the groove hits as the rings come together, and keeps going under the window.
fill(WITH - BEAT)
place(music, WITH, stab([62, 66, 69, 74]) * 2.5, 0.35)
place(music, WITH, open_hat() * 3, 0.06)
place(music, WITH, pad([50, 62, 66, 69], 1.8, attack=0.05, release=0.4), 0.25)
groove(WITH, 4, lambda b: (38, [62, 66, 69]), 0.8)
WINDOW_CHORDS = [(35, [59, 62, 66]), (31, [59, 62, 67])]
groove(CONFLICT, 8, lambda b: WINDOW_CHORDS[b // 4], 0.7)
for b in range(0, 8, 4):
    root, tones = WINDOW_CHORDS[b // 4]
    place(music, CONFLICT + b * BEAT, pad([root + 12] + tones, BAR - 0.05), 0.16)

# One line: the groove under the code, then a build into the Concordance run.
LINE_CHORDS = [(38, [62, 66, 69]), (35, [59, 62, 66])]
groove(ONE_LINE, 8, lambda b: LINE_CHORDS[b // 4], 0.75)
for b in range(0, 8, 4):
    root, tones = LINE_CHORDS[b // 4]
    place(music, ONE_LINE + b * BEAT, pad([root + 12] + tones, BAR - 0.05), 0.16)
BUILD = ONE_LINE + 2 * BAR
place(music, BUILD, pad([43, 59, 62, 67], 1.9, attack=0.4, release=0.3), 0.2)
place(music, BUILD, bass(31, 1.9), 0.22)
place(sfx, BUILD, noise_sweep(2.0, 500, 6000) * np.linspace(0, 1, int(2.0 * SR)) ** 2, 0.05)
for b in range(4):
    place(music, BUILD + b * BEAT, kick(), 0.3)
fill(CONCORD - BEAT)

# The Concordance run: the zones' notes stacking over the groove, resolving into the end card.
concord_phrase(CONCORD, 0.38)

# End card: a bell per ring, then the D chord.
for i, note in enumerate((74, 78, 81)):
    place(music, FINAL + i * 0.25, bell(note, 2.5), 0.1, pan=(-0.4, 0.0, 0.4)[i])
place(music, FINAL, stab([62, 66, 69, 74]) * 2.5, 0.3)
place(music, FINAL + 1.0, pad([38, 50, 57, 62, 66, 69], 3.8, attack=0.2, release=1.2), 0.4)
place(music, FINAL + 1.0, bass(26, 3.5), 0.28)
place(music, FINAL + 1.0, kick(), 0.36)
place(music, FINAL + 1.0, open_hat() * 3, 0.05)
place(music, FINAL + 1.0, bell(86, 3.0), 0.07)

# Mix.


def reverb(sig, seconds=2.2, mix=0.2):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t / (seconds / 6.9))[:, None]
    ir = fft_filter(ir, high=5000)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    size = 1 << int(np.ceil(np.log2(len(sig) + n)))
    wet = np.fft.irfft(np.fft.rfft(sig, size, axis=0) * np.fft.rfft(ir, size, axis=0), size, axis=0)[:len(sig)]
    return sig * (1 - mix) + wet * mix * 2.2


mix = reverb(music, 2.0, 0.18) * 0.85 + reverb(sfx, 1.0, 0.1)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.1) / np.tanh(1.1)
fade = np.clip((VIDEO_END - np.arange(N) / SR) / 2.5, 0, 1)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) / 0.89

out = sys.argv[1] if len(sys.argv) > 1 else __file__.rsplit('\\', 1)[0].rsplit('/', 1)[0] + '/soundtrack.wav'
pcm = (mix * 32767).astype(np.int16)
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out, f'{LENGTH:.1f} s')
