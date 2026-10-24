"""Builds the store video's soundtrack: a bespoke score plus sound effects, synced to animatic.html's timeline.

Usage: python sound.py [out.wav]   (default: soundtrack.wav beside this file)

Everything is synthesized with numpy from a fixed seed, so the output is identical on every run. The score runs at 100 BPM
(a beat is 0.6 s) with its grid starting at 0 s, so the lift lands exactly on the "With Selvage" card at 23.4 s (beat 39).
Key: B minor while the other ways are shown, D major from the Selvage card on. The three thread plucks spell a D chord.
"""
import sys
import wave
import numpy as np

SR = 48000
LENGTH = 54.6
VIDEO_END = 53.8
BEAT = 0.6
BAR = 4 * BEAT
LIFT = 23.4
GROOVE_END = 48.0
FINAL = 48.6

rng = np.random.default_rng(7)
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
    if i >= N:
        return
    if sig.ndim == 1:
        left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * left, sig * right], axis=1) * np.sqrt(2)
    end = min(N, i + len(sig))
    bus[i:end] += sig[:end - i] * gain


def fft_filter(sig, low=None, high=None):
    """Zero-phase band limit by FFT with soft 1-octave shoulders."""
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


def env(duration, attack, decay_tau):
    t = t_axis(duration)
    return np.minimum(t / max(attack, 1e-4), 1.0) * np.exp(-t / decay_tau)


# Instruments.

def marimba(note, duration=1.2, bright=1.0):
    """Struck bar: a fundamental and two inharmonic overtones that die fast."""
    t = t_axis(duration)
    f = hz(note)
    sig = np.zeros_like(t)
    for ratio, amp, tau in ((1.0, 1.0, 0.45), (3.93, 0.22 * bright, 0.09), (9.24, 0.06 * bright, 0.03)):
        if f * ratio < 18000:
            sig += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / tau)
    return sig * np.minimum(t / 0.003, 1.0)


def pad(notes, duration, cutoff, attack=1.2, release=1.5):
    """Detuned, band-limited saws, softened by a lowpass."""
    t = t_axis(duration + release)
    sig = np.zeros_like(t)
    for note in notes:
        for detune in (-0.07, 0.0, 0.07):
            f = hz(note + detune)
            for k in range(1, int(min(6000 / f, 30)) + 1):
                sig += np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6.28)) / k
    sig = fft_filter(sig, low=90, high=cutoff)
    shape = np.minimum(t / attack, 1.0) * np.clip((duration + release - t) / release, 0, 1)
    return sig * shape / (len(notes) * 6)


def bass(note, duration):
    t = t_axis(duration)
    f = hz(note)
    sig = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return sig * np.minimum(t / 0.01, 1.0) * np.exp(-t / 0.9) * np.clip((duration - t) / 0.05, 0, 1)


def kick():
    t = t_axis(0.35)
    phase = 2 * np.pi * np.cumsum(45 + 80 * np.exp(-t / 0.035)) / SR
    return np.sin(phase) * np.exp(-t / 0.12)


def hat(open_=False):
    noise = rng.standard_normal(int(0.12 * SR))
    return fft_filter(noise, low=7000) * env(0.12, 0.001, 0.05 if open_ else 0.018)


def snap():
    """Soft finger snap: three quick filtered taps."""
    out = np.zeros(int(0.25 * SR))
    for k, d in enumerate((0.0, 0.009, 0.019)):
        burst = fft_filter(rng.standard_normal(int(0.2 * SR)), low=1200, high=4500) * env(0.2, 0.0005, 0.045)
        i = int(d * SR)
        out[i:i + len(burst)] += burst[:len(out) - i] * (1.0 - 0.25 * k)
    return out


def noise_sweep(duration, f0, f1, tau_in, tau_out):
    """Filtered noise whose band slides from f0 to f1: swishes, risers, whooshes."""
    n = int(duration * SR)
    noise = rng.standard_normal(n)
    t = np.arange(n) / SR
    out = np.zeros(n)
    # Time-varying band: crossfade between a few fixed bands along the sweep.
    bands = np.geomspace(f0, f1, 6)
    for i, fc in enumerate(bands):
        band = fft_filter(noise, low=fc / 1.6, high=fc * 1.6)
        centre = i / (len(bands) - 1)
        w = np.clip(1 - np.abs(t / duration - centre) * (len(bands) - 1), 0, 1)
        out += band * w
    shape = (1 - np.exp(-t / tau_in)) * np.exp(-np.maximum(t - (duration - tau_out * 3), 0) / tau_out)
    peak = np.argmax(shape)
    shape[peak:] = shape[peak] * np.exp(-(t[peak:] - t[peak]) / tau_out)
    return out * shape


def bell(note, duration=2.0, ring=1.0):
    """Struck bell; ring lengthens every partial's decay."""
    t = t_axis(duration)
    f = hz(note)
    sig = np.zeros_like(t)
    for ratio, amp, tau in ((1.0, 1.0, 0.9), (2.76, 0.35, 0.35), (5.4, 0.12, 0.15), (8.93, 0.05, 0.07)):
        sig += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / (tau * ring))
    return sig * np.minimum(t / 0.002, 1.0)


# Score.

# Intro: B minor colours, unresolved, no beat. Each chord lasts two bars.
INTRO_CHORDS = [
    [47, 54, 61, 62, 66],   # Bm(add9)
    [43, 50, 54, 57, 61],   # Gmaj7(#11)
]
t0, k = 0.0, 0
while t0 < LIFT - 0.01:
    length = min(2 * BAR, LIFT - t0)
    place(music, t0, pad(INTRO_CHORDS[k % 2], length + 0.6, cutoff=1600, attack=1.0 if k == 0 else 0.8), 0.9)
    t0 += 2 * BAR
    k += 1

# A sparse, slightly restless pluck line through the intro.
for beat, note in ((2, 66), (6, 61), (10, 62), (14, 66), (18, 69), (22, 66), (26, 61), (30, 64), (34, 66), (36, 69)):
    place(music, beat * BEAT, marimba(note, bright=0.6), 0.26, pan=0.25 if beat % 4 else -0.25)

# A muted tick pulse from the first section card, so the comparison feels like it is going somewhere.
for b in range(11 * 2, int(LIFT / (BEAT / 2))):
    place(music, b * BEAT / 2, hat(), 0.08 if b % 2 else 0.055, pan=0.3)

# Riser into the lift.
place(music, LIFT - 2.2, noise_sweep(2.2, 400, 6000, 1.6, 0.02) * np.linspace(0, 1, int(2.2 * SR)) ** 2, 0.18)

# Groove: D major, from the lift to the end of the Features section.
GROOVE = [
    ([38, 50], [62, 66, 69, 73, 76]),   # Dmaj9
    ([35, 47], [59, 62, 66, 69, 73]),   # Bm9
    ([31, 43], [55, 59, 62, 66, 69]),   # Gmaj9
    ([33, 45], [57, 62, 64, 67, 71]),   # A9sus
]
ARP = [0, 2, 1, 3, 2, 4, 3, 1]
def groove(start, sig, gain, pan=0.0):
    """Places a groove event only before the groove stops, so nothing of it plays over the final chord."""
    if start < GROOVE_END - 0.01:
        place(music, start, sig, gain, pan)


bar_index = 0
t0 = LIFT
while t0 < GROOVE_END - 0.01:
    roots, chord = GROOVE[bar_index % 4]
    features = t0 >= 33.6
    last = (t0 + BAR > GROOVE_END)
    # The last bar is cut at the stop: its chord is held only up to it and released quickly.
    length = (GROOVE_END - t0) if last else BAR + 0.3
    place(music, t0, pad(chord, length, cutoff=2600, attack=0.25, release=0.35 if last else 0.8), 0.42)
    # Bass: root on 1, a push on the "and" of 2, root again on 4.
    for off, beats in ((0.0, 1.0), (1.5, 0.45), (3.0, 0.9)):
        groove(t0 + off * BEAT, bass(roots[0], min(beats * BEAT, max(GROOVE_END - t0 - off * BEAT, 0.05))), 0.38)
    # Marimba arpeggio in eighths.
    for i, step in enumerate(ARP):
        vel = 0.15 if i % 2 == 0 else 0.10
        groove(t0 + i * BEAT / 2, marimba(chord[step] + 12, bright=0.8), vel * (0.85 if features else 1.0), pan=-0.35 + 0.1 * step)
    # Drums: soft kick on 1 and 3, snap on 2 and 4, eighth hats.
    for b in (0, 2):
        groove(t0 + b * BEAT, kick(), 0.42)
    for b in (1, 3):
        groove(t0 + b * BEAT, snap(), 0.2, pan=0.15)
    for h in range(8):
        groove(t0 + h * BEAT / 2, hat(open_=(h == 7)), 0.07 if h % 2 else 0.05, pan=0.35)
    t0 += BAR
    bar_index += 1

# Ending: the groove stops as the Features section leaves, the band slides up, and the marimba ding lands alone under the title,
# ringing out until the video ends.
for note, d in ((62, 0.0), (66, 0.03), (69, 0.06), (74, 0.09)):
    place(music, FINAL + d, marimba(note + 12, duration=4.0), 0.2, pan=-0.2 + 0.1 * (note % 4))

# Sound effects.


def scratch(duration=0.22):
    n = int(duration * SR)
    t = np.arange(n) / SR
    grain = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 34 * t + rng.uniform(0, 6)))
    return fft_filter(rng.standard_normal(n), low=2500, high=9000) * grain * env(duration, 0.01, 0.12)


def click():
    """A real button press: a sharp tick over a small thump."""
    t = t_axis(0.08)
    thump = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.015)
    tick = fft_filter(rng.standard_normal(len(t)), low=3000) * np.exp(-t / 0.003)
    return 0.7 * thump + 0.5 * tick


def thud():
    """The error: a muted low clash, the same for both other ways."""
    t = t_axis(0.6)
    sig = np.sin(2 * np.pi * hz(40) * t) + 0.8 * np.sin(2 * np.pi * hz(41) * t) + 0.3 * np.sin(2 * np.pi * hz(52) * t)
    sig = np.tanh(1.6 * sig) * np.exp(-t / 0.16) * np.minimum(t / 0.004, 1)
    return sig + 0.15 * fft_filter(rng.standard_normal(len(t)), high=600) * np.exp(-t / 0.05)


def pop(f=520):
    t = t_axis(0.09)
    phase = 2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t / 0.012))) / SR
    return np.sin(phase) * np.exp(-t / 0.025) * np.minimum(t / 0.001, 1)


def tick():
    t = t_axis(0.03)
    return np.sin(2 * np.pi * 2600 * t) * np.exp(-t / 0.006)


def key_click():
    t = t_axis(0.05)
    body = fft_filter(rng.standard_normal(len(t)), low=900, high=5000) * np.exp(-t / 0.008)
    return body * rng.uniform(0.7, 1.0)


# Hook: lookups struck out, then the code folds away.
place(sfx, 3.0, scratch(), 0.22, pan=-0.2)
place(sfx, 3.3, scratch(), 0.2, pan=-0.1)
place(sfx, 4.0, noise_sweep(0.45, 3000, 500, 0.08, 0.06), 0.12)

# Title cards: a short swish as the rule draws; the Selvage card gets a brighter one on the lift.
for t in (6.6, 14.2, 33.6):
    place(sfx, t, noise_sweep(0.5, 800, 5000, 0.06, 0.07), 0.13, pan=-0.3)
place(sfx, 23.4, noise_sweep(0.6, 1200, 9000, 0.05, 0.09), 0.17, pan=-0.3)
place(sfx, 23.4, bell(86, 1.5), 0.05)

# Play pressed, then the same error thud for both other ways.
for press, error in ((10.4, 11.0), (20.2, 20.5)):
    place(sfx, press, click(), 0.35, pan=-0.5)
    place(sfx, error, thud(), 0.42)

# Setup files arriving.
place(sfx, 16.6, noise_sweep(0.35, 1500, 600, 0.05, 0.06), 0.1, pan=0.4)
place(sfx, 18.2, noise_sweep(0.35, 1500, 600, 0.05, 0.06), 0.1, pan=0.5)

# Selvage: tiles pop in, threads set off and land as plucks that spell a D chord; the third falls short, the gold catch
# chimes, and its fix completes the chord.
for t, f in ((25.2, 520), (25.4, 600), (30.8, 560)):
    place(sfx, t, pop(f), 0.18, pan=0.5)
for start, land, note, pan in ((25.6, 27.15, 74, 0.1), (26.1, 27.65, 78, 0.25)):
    place(sfx, start, noise_sweep(land - start, 300, 2500, 0.4, 0.05), 0.045, pan=pan)
    place(sfx, land, marimba(note, duration=1.8, bright=1.2), 0.32, pan=pan)
place(sfx, 28.0, noise_sweep(0.9, 300, 1300, 0.3, 0.03), 0.045, pan=0.35)
place(sfx, 28.9, marimba(80, duration=0.6, bright=0.3) * np.exp(-t_axis(0.6) / 0.08), 0.25, pan=0.35)
place(sfx, 29.1, bell(81, 1.8), 0.11, pan=0.0)
place(sfx, 29.18, bell(88, 1.6), 0.07, pan=0.1)
place(sfx, 31.0, noise_sweep(1.15, 300, 2500, 0.35, 0.05), 0.045, pan=0.4)
place(sfx, 32.15, marimba(81, duration=2.0, bright=1.2), 0.32, pan=0.4)
place(sfx, 32.15, marimba(74, duration=2.0, bright=0.8), 0.12, pan=0.1)

# Features: typing, the Inspector updating, the cloud save arriving, Edit mode updating, then "And much more".
for i in range(19):
    place(sfx, 35.6 + i * (1.4 / 19) + rng.uniform(-0.012, 0.012), key_click(), 0.16, pan=-0.3)
place(sfx, 37.4, tick(), 0.14, pan=-0.3)
place(sfx, 40.2, bell(90, 1.2), 0.07, pan=-0.3)
place(sfx, 43.2, tick(), 0.14, pan=-0.3)
place(sfx, 46.0, noise_sweep(0.6, 600, 5000, 0.25, 0.08), 0.1)

# The edge: the hem band slides up, then the stitch is sewn by hand: a faint fabric whisper under a few soft thread pulls,
# irregular like real hands, travelling left to right with the stitching.


def thread_pull(duration):
    """Thread drawn through fabric: breathy filtered noise that swells and is cut off as the thread tightens, its band rising."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    body = noise_sweep(duration, 900, 2600, duration * 0.45, duration * 0.08)
    grain = 1 + 0.35 * np.sin(2 * np.pi * rng.uniform(55, 75) * t)   # the thread's slight rasp against the weave
    return body * grain * np.clip((duration - t) / 0.02, 0, 1)


place(sfx, 48.2, noise_sweep(0.7, 2000, 300, 0.05, 0.12), 0.16)
place(sfx, 48.45, noise_sweep(1.7, 500, 1200, 0.5, 0.25), 0.035)
for i, (offset, length) in enumerate(((0.0, 0.22), (0.27, 0.2), (0.56, 0.24), (0.86, 0.19), (1.12, 0.23), (1.38, 0.26))):
    x = offset / 1.5
    place(sfx, 48.5 + offset + rng.uniform(-0.02, 0.02), thread_pull(length), 0.09 * rng.uniform(0.8, 1.0), pan=-0.7 + 1.4 * x)

# Mix.

def reverb(sig, seconds=1.8, mix=0.18):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t / (seconds / 6.9))[:, None]
    ir = fft_filter(ir, high=6000)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    size = 1 << int(np.ceil(np.log2(len(sig) + n)))
    wet = np.fft.irfft(np.fft.rfft(sig, size, axis=0) * np.fft.rfft(ir, size, axis=0), size, axis=0)[:len(sig)]
    return sig * (1 - mix) + wet * mix * 2.2


mix = reverb(music, 2.2, 0.2) * 0.85 + reverb(sfx, 1.2, 0.12)
# The tail fades out to silence exactly as the video ends.
fade = np.clip((VIDEO_END - np.arange(N) / SR) / 1.8, 0, 1)
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
