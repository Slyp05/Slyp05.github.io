"""Builds the store video's soundtrack: a score plus sound effects, synced to animatic.html's timeline.

Usage: python sound.py [out.wav]   (default: soundtrack.wav beside this file)

Everything is synthesized with numpy from a fixed seed, so the output is identical on every run. The score runs at 120 BPM
(a beat is 0.5 s, a bar 2 s) with its grid starting at 0 s: each beat of the story starts on a bar, and every saved version,
reel frame and click lands on a half-beat. The sound follows the store art's comic look: bright saw stabs, an octave bass, a
square-wave hook and tight drums, in F major, kept under the sound effects. The AI copy and the copy without history sit on a D minor pedal; a crash opens
each section that answers them.
"""
import sys
import wave
import numpy as np

SR = 48000
LENGTH = 34.6
VIDEO_END = 34.0
BEAT = 0.5
BAR = 4 * BEAT
WHY = (0.0, 6.0)
WITH = (6.0, 8.0)
TIMESTAMPS = (8.0, 14.0)
COPY = (14.0, 18.0)
PROOF = (18.0, 28.0)
FINAL = 28.0

rng = np.random.default_rng(5)
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


def saw(f, t, limit=9000):
    """Band-limited sawtooth."""
    sig = np.zeros_like(t)
    for k in range(1, int(min(limit / f, 60)) + 1):
        sig += np.sin(2 * np.pi * f * k * t) / k
    return sig


def gate(t, duration, release=0.03):
    return np.clip((duration - t) / release, 0, 1)


# Instruments.

def stab(notes, duration=0.22, bright=1.0):
    """Saw chord stab: a bright snap that closes fast onto a rounder body."""
    t = t_axis(duration + 0.05)
    sig = np.zeros_like(t)
    for note in notes:
        for detune in (-0.08, 0.08):
            sig += saw(hz(note + detune), t)
    snap = fft_filter(sig, high=5500 * bright) * np.exp(-t / 0.05)
    body = fft_filter(sig, high=1400) * np.exp(-t / 0.3)
    return (0.8 * snap + body) * np.minimum(t / 0.003, 1) * gate(t, duration + 0.05, 0.05) / (len(notes) * 4)


def octave_bass(note, duration):
    t = t_axis(duration)
    sig = saw(hz(note), t, limit=2500) + 0.6 * np.sin(2 * np.pi * hz(note) * t)
    return fft_filter(sig, high=900) * np.minimum(t / 0.004, 1) * np.exp(-t / 0.25) * gate(t, duration)


def square_lead(note, duration):
    """Square-wave hook: odd harmonics, a short blip of pitch at the attack, light vibrato."""
    t = t_axis(duration + 0.08)
    f = hz(note) * (1 + 0.03 * np.exp(-t / 0.015)) * (1 + 0.003 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(t / 0.2, 1))
    phase = 2 * np.pi * np.cumsum(f) / SR
    sig = np.zeros_like(t)
    for k in range(1, 16, 2):
        sig += np.sin(k * phase) / k
    shape = np.minimum(t / 0.005, 1) * (0.65 + 0.35 * np.exp(-t / 0.08)) * gate(t, duration + 0.08, 0.06)
    return fft_filter(sig, high=6000) * shape


def kick():
    t = t_axis(0.4)
    phase = 2 * np.pi * np.cumsum(50 + 120 * np.exp(-t / 0.025)) / SR
    click = fft_filter(rng.standard_normal(len(t)), low=2000) * np.exp(-t / 0.002) * 0.3
    return np.tanh(1.4 * np.sin(phase) * np.exp(-t / 0.13)) + click


def snare():
    t = t_axis(0.3)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04)
    noise = fft_filter(rng.standard_normal(len(t)), low=1200, high=9000) * np.exp(-t / 0.09)
    return 0.6 * tone + 0.8 * noise


def hat(open_=False):
    noise = rng.standard_normal(int(0.2 * SR))
    return fft_filter(noise, low=8000) * env(0.2, 0.001, 0.06 if open_ else 0.015)


def crash():
    noise = rng.standard_normal(int(1.6 * SR))
    return fft_filter(noise, low=4500) * env(1.6, 0.002, 0.45)


def noise_sweep(duration, f0, f1, tau_in, tau_out):
    """Filtered noise whose band slides from f0 to f1: swishes, risers, whooshes."""
    n = int(duration * SR)
    noise = rng.standard_normal(n)
    t = np.arange(n) / SR
    out = np.zeros(n)
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


def riser(duration):
    return noise_sweep(duration, 400, 7000, duration * 0.8, 0.02) * np.linspace(0, 1, int(duration * SR)) ** 2


def clock_tick(high=True):
    """A wall clock: a woody click, tick a little higher than tock."""
    t = t_axis(0.06)
    f = 2300 if high else 1750
    body = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.007) + 0.5 * np.sin(2 * np.pi * f * 2.3 * t) * np.exp(-t / 0.003)
    return body + fft_filter(rng.standard_normal(len(t)), low=3000) * np.exp(-t / 0.002) * 0.4


# Score.

# Bright sections: I, V, vi, IV, a chord a bar.
CHORDS = [
    (41, [65, 69, 72, 77]),   # F
    (36, [64, 67, 72, 76]),   # C
    (38, [62, 65, 69, 74]),   # Dm
    (34, [62, 65, 70, 74]),   # Bb
]
# The hook, two bars of eighths (None is a rest), over F and C.
HOOK = [72, None, 69, 72, 74, None, 72, 69, 77, None, 76, 74, 72, None, None, None]


def drums(start, stop, full=True):
    t0 = start
    while t0 < stop - 0.01:
        for b in range(4):
            t = t0 + b * BEAT
            place(music, t, kick(), 0.42 if (b % 2 == 0) or full else 0.0)
            if full and (b % 2 == 1):
                place(music, t, snare(), 0.18, pan=0.05)
        for h in range(8):
            place(music, t0 + h * BEAT / 2, hat(), 0.035 if h % 2 else 0.025, pan=0.3)
        t0 += BAR


def bright(start, stop, hook=True):
    """Stabs on the offbeats, an octave bass in eighths, the hook on top."""
    t0, k = start, 0
    while t0 < stop - 0.01:
        root, chord = CHORDS[k % 4]
        for e in range(8):
            t = t0 + e * BEAT / 2
            place(music, t, octave_bass(root + (12 if e % 2 else 0), BEAT / 2 - 0.02), 0.24)
            if e % 2 == 1:
                place(music, t, stab(chord, 0.12, bright=0.8), 0.3, pan=-0.25 if e % 4 == 1 else 0.25)
        if hook:
            for e, note in enumerate(HOOK[(k % 2) * 8:(k % 2) * 8 + 8]):
                if note is not None:
                    place(music, t0 + e * BEAT / 2, square_lead(note, BEAT / 2 - 0.03), 0.055, pan=0.1)
        t0 += BAR
        k += 1
    drums(start, stop)


def tense(start, stop):
    """D minor pedal: a pumping bass, stabs on 1 and the and of 2."""
    t0 = start
    while t0 < stop - 0.01:
        for e in range(8):
            place(music, t0 + e * BEAT / 2, octave_bass(26 + (12 if e % 2 else 0), BEAT / 2 - 0.03), 0.22)
        for off in (0.0, 1.5 * BEAT):
            place(music, t0 + off, stab([62, 65, 69, 74], 0.16, bright=0.6), 0.3)
        t0 += BAR


# Why: the D minor pedal, half-time kick; the copy lands with a hit on bar 2; a riser into the answer.
tense(*WHY)
drums(WHY[0], WHY[1], full=False)
place(music, 3.0, crash(), 0.08, pan=0.3)
place(music, WHY[1] - 2.0, riser(2.0), 0.12)

# With CloneBuster: the F chord hits as the stamp lands, rings for the bar, and a snare fill leads into the groove.
place(music, WITH[0], stab([65, 69, 72, 77], 1.4), 0.45)
place(music, WITH[0], octave_bass(29, 1.2), 0.32)
place(music, WITH[0], kick(), 0.45)
place(music, WITH[0], crash(), 0.11, pan=0.3)
for i in range(4):
    place(music, WITH[1] - BEAT + i * BEAT / 4, snare(), 0.08 + 0.03 * i, pan=0.05)

# Timestamps: crash, then the bright groove with the hook.
place(music, TIMESTAMPS[0], crash(), 0.11, pan=-0.3)
bright(*TIMESTAMPS)

# The copy: back to the pedal, no snare, a clock ticking on every beat; a riser into the proof.
tense(*COPY)
drums(COPY[0], COPY[1], full=False)
for b in range(int((COPY[1] - COPY[0]) / BEAT)):
    place(music, COPY[0] + b * BEAT, clock_tick(b % 2 == 0), 0.12, pan=-0.3)
place(music, COPY[1] - 2.0, riser(2.0), 0.12)

# Proof and reel: crash, the bright groove to the end card.
place(music, PROOF[0], crash(), 0.11, pan=-0.3)
bright(*PROOF)

# End card: one F chord hit with the bass and a crash, left to ring.
place(music, FINAL, stab([65, 69, 72, 77, 81], 1.6), 0.5)
place(music, FINAL, octave_bass(29, 1.4), 0.4)
place(music, FINAL, kick(), 0.5)
place(music, FINAL, crash(), 0.12)
place(music, FINAL, square_lead(84, 0.9), 0.07)

# Sound effects.


def click():
    t = t_axis(0.08)
    thump = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.015)
    tick = fft_filter(rng.standard_normal(len(t)), low=3000) * np.exp(-t / 0.003)
    return 0.7 * thump + 0.5 * tick


def stamp_hit(pitch=1.0):
    """A rubber stamp landing: a short low thud with a papery slap."""
    t = t_axis(0.25)
    thud = np.sin(2 * np.pi * np.cumsum(110 * pitch + 60 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.05)
    slap = fft_filter(rng.standard_normal(len(t)), low=800, high=5000) * np.exp(-t / 0.012)
    return 0.8 * thud + 0.35 * slap


def scan_buzz(duration):
    """The copy being rebuilt: a gritty digital buzz, pulsing sixteen times a second."""
    t = t_axis(duration)
    carrier = np.sign(np.sin(2 * np.pi * 110 * t)) * 0.4 + fft_filter(rng.standard_normal(len(t)), low=1500, high=6000)
    pulse = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 16 * t))
    return fft_filter(carrier * pulse, high=5000) * np.minimum(t / 0.05, 1) * gate(t, duration, 0.05)


def pop(f=700):
    t = t_axis(0.09)
    phase = 2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t / 0.012))) / SR
    return np.sin(phase) * np.exp(-t / 0.025) * np.minimum(t / 0.001, 1)


def paper():
    return noise_sweep(0.45, 3000, 900, 0.06, 0.08)


# Why: the copy is rebuilt under the scan line, and lands complete.
place(sfx, 1.0, scan_buzz(2.0), 0.06, pan=0.4)
place(sfx, 3.0, stamp_hit(0.6), 0.22, pan=0.4)

# With CloneBuster: the stamp lands.
place(sfx, WITH[0], stamp_hit(0.8), 0.3)

# Timestamps: each saved version is stamped, a little higher every time; the legend's two tags pop.
for i in range(10):
    place(sfx, 8.5 + i * 0.5, stamp_hit(1.0 + 0.05 * i), 0.18, pan=0.45)
place(sfx, 9.0, pop(760), 0.12, pan=0.5)
place(sfx, 9.5, pop(900), 0.12, pan=0.6)

# The copy arrives with nothing behind it; our ten versions are stamped in a quick run.
for i in range(10):
    place(sfx, 15.0 + i * 0.125, stamp_hit(1.4 + 0.04 * i), 0.1, pan=0.2 - 0.04 * i)
place(sfx, 14.0, noise_sweep(0.5, 2500, 700, 0.05, 0.08), 0.08, pan=-0.3)
place(sfx, 14.5, noise_sweep(0.5, 2500, 600, 0.04, 0.1), 0.1, pan=0.5)

# Proof: Export clicked, the PDF comes out and zooms to its verdict.
place(sfx, 19.0, click(), 0.4, pan=0.3)
place(sfx, 19.5, paper(), 0.14, pan=0.5)
place(sfx, 20.5, noise_sweep(0.8, 600, 4000, 0.4, 0.08), 0.08)
place(sfx, 21.5, noise_sweep(0.5, 1800, 3200, 0.2, 0.06), 0.06, pan=-0.2)

# Reel: in, then a soft tick on every frame.
place(sfx, 24.0, noise_sweep(0.4, 800, 5000, 0.05, 0.08), 0.07)
for t in (24.0, 24.25, 24.5, 24.75, 25.0, 25.25, 25.5, 25.75, 26.0, 26.25):
    place(sfx, t, clock_tick(True) * 0.5, 0.08, pan=-0.3)

# End card: the stamp lands under the name.
place(sfx, FINAL, stamp_hit(0.8), 0.3)

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


mix = reverb(music, 1.4, 0.12) * 0.85 + reverb(sfx, 1.0, 0.1)
# A gentle bus compressor so the stabs and drums sit together, then the tail fades out to silence as the video ends.
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.2) / np.tanh(1.2)
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
