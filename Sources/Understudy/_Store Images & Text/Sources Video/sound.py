"""Builds the store video's soundtrack: a theatre pit band playing the stage, with the real clock ticking out of time.

Usage: python sound.py [out.wav]   (default: soundtrack.wav beside this file)

Everything is synthesized with numpy from a fixed seed, so the output is identical on every run. The score is a jazz
waltz, 3/4 at 120 BPM from 0 s (a beat is 0.5 s, a bar 1.5 s), for a small pit band: pizzicato strings (violins and a cello),
a clarinet, a bassoon, a glockenspiel and a timpani, with a cymbal for the curtains.

- The real clock ticks as a woodblock at the same uneven times as its second hand in animatic.html, never on the beat,
  from start to end: in the centre while it plays, quieter and to the left once it steps into the wings. The cardboard
  clock never ticks.
- Hook, in D minor turning to G: a timpani roll opens the curtains, a light jazz waltz and a swung clarinet figure. Each run
  plays a pizzicato note per uneven step of the object; a failed run ends on a sour bassoon note, the passed one on a
  plain pizzicato note, no better than the failures.
- Without Understudy: a plodding bassoon line, a scratch for each rewritten line, a low note for each added file, a dull
  timpani on the red cross.
- With Understudy: the curtains, then pizzicato on C building under the typed line; the real clock leaves on a falling
  pizzicato run, and the full band comes in, in F major, on the bar at 19.5 s as the cardboard clock arrives. Each run
  is a smooth rising arpeggio, landing on a glockenspiel ding, the three dings rising.
- Leak detection: the waltz thins, a clarinet question, a knock and a ding as the warning lands.
- End: the curtains, a full F major chord on the title, a small flourish for the bow, then the clock's ticks alone.

The master: the reverb is a send, a tilt that takes out mud and the harsh band, the low end in mono, a slow leveler that
keeps every scene near the same loudness, -16 LUFS over the score, and a lookahead limiter (no saturation) that keeps the
true peak at -1 dBFS at most.
"""
import sys
import wave
import numpy as np

SR = 48000
LENGTH = 39.3
VIDEO_END = 39.0
BEAT = 0.5
BAR = 3 * BEAT

# Times from animatic.html.
CURTAIN_OPEN = 0.5                    # the first opening, 0.8 s long
REAL_RUNS, STUB_RUNS = 4.5, 22.5      # three runs each, a bar apart; the result chip shows 1.05 s into each
USUAL = 10.5                          # Without Understudy: lines turn at 11.3 + 0.18 i, files at 12.5, 13.0, 13.5, cross 14.1
CURTAIN1 = 15.0                       # closes over 0.6 s, opens at 16.2 over 0.8 s
TYPING = 17.0                         # the stub line, 50 characters over 1.4 s
SWAP = 18.5                           # the real clock leaves over 1 s; the cardboard one arrives from 19.0, wobbles at 19.8
BAND = 19.5                           # the full band comes in
LEAK, WARNING = 28.5, 28.7               # the Console's warning lands
CURTAIN2, FINAL = 32.4, 33.7          # closes over 0.6 s; opens at FINAL over 0.8 s
TITLE, BOW = 34.5, 36.0               # the bow dips over 0.45 s, holds 0.25 s, and rises

rng = np.random.default_rng(31)
N = int(LENGTH * SR)
dry = np.zeros((N, 2))
send = np.zeros((N, 2))               # feeds the reverb


def hz(note):
    """MIDI note number to frequency."""
    return 440.0 * 2 ** ((note - 69) / 12)


def t_axis(duration):
    return np.arange(int(duration * SR)) / SR


def place(start, sig, gain=1.0, pan=0.0, wet=0.0):
    """Adds a mono signal at a time in seconds, panned from -1 (left) to 1 (right), with `wet` of it sent to the reverb."""
    i = int(round(start * SR))
    if i >= N or i < 0:
        return
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    stereo = np.stack([sig * left, sig * right], axis=1) * np.sqrt(2) * gain
    end = min(N, i + len(sig))
    dry[i:end] += stereo[:end - i]
    if wet > 0:
        send[i:end] += stereo[:end - i] * wet


def fft_filter(sig, low=None, high=None, order=4):
    """Zero-phase band limit by FFT with soft shoulders."""
    n = len(sig)
    spec = np.fft.rfft(sig, axis=0)
    f = np.fft.rfftfreq(n, 1 / SR)
    gain = np.ones_like(f)
    if high is not None:
        gain *= 1 / (1 + (f / high) ** order)
    if low is not None:
        gain *= 1 / (1 + (low / np.maximum(f, 1e-3)) ** order)
    if sig.ndim == 2:
        gain = gain[:, None]
    return np.fft.irfft(spec * gain, n, axis=0)


def noise(duration):
    return rng.standard_normal(int(duration * SR))


def gate(t, length, release):
    """1 until `length`, then a linear release to 0."""
    return np.clip((length + release - t) / release, 0, 1)


def beat(bar_start, b):
    return bar_start + b * BEAT


# Instruments.

def pizz(note, length=0.5, tau=0.16, bright=0.8):
    """A pizzicato string: a few harmonics up to 4 kHz, a quick decay, and the soft snap of the finger."""
    f = hz(note)
    t = t_axis(length)
    sig = np.zeros_like(t)
    for k in range(1, int(min(4000 / f, 8)) + 1):
        sig += np.sin(2 * np.pi * f * k * t) / k ** 1.7 * np.exp(-t * (1 + bright * (k - 1) ** 1.4) / tau)
    snap = fft_filter(noise(0.012), low=600, high=3000) * np.exp(-t_axis(0.012) / 0.003) * 0.06
    sig[:len(snap)] += snap
    return sig * np.minimum(t / 0.006, 1) * gate(t, length - 0.03, 0.03)


def cello(note, length=0.9):
    """The cello's pizzicato: lower, rounder and longer."""
    return pizz(note, length, tau=0.45, bright=0.6)


def reed(note, length, harmonics, attack=0.05, release=0.12, vibrato=0.004, breath=0.02):
    """A wind instrument by additive synthesis: `harmonics` gives each harmonic's level, a delayed vibrato, and breath."""
    t = t_axis(length + release)
    f0 = hz(note)
    vib = 1 + vibrato * np.sin(2 * np.pi * 5.2 * t) * np.clip((t - 0.25) / 0.3, 0, 1)
    phase = 2 * np.pi * np.cumsum(f0 * vib) / SR
    sig = np.zeros_like(t)
    for k, amp in enumerate(harmonics, start=1):
        if f0 * k < 4500:
            sig += amp * np.sin(k * phase)
    sig += fft_filter(noise(length + release), low=1200, high=3500) * breath
    env = np.minimum(t / attack, 1) ** 1.5 * gate(t, length, release)
    return sig * env


def clarinet(note, length, release=0.12):
    """Odd harmonics strong, even ones faint: the clarinet's hollow tone."""
    return reed(note, length, [1, 0.04, 0.55, 0.05, 0.3, 0.04, 0.14, 0.03, 0.06, 0.02, 0.03], release=release)


def bassoon(note, length, release=0.1, vibrato=0.002):
    """A soft reedy low voice, its harmonics peaking around 500 Hz and falling away fast above, so it never turns brassy."""
    f0 = hz(note)
    levels = [(0.1 + 1 / (1 + ((f0 * k - 500) / 250) ** 2)) / k ** 1.5 for k in range(1, 11)]
    return reed(note, length, levels, attack=0.07, release=release, vibrato=vibrato, breath=0.01) * 0.6


def glock(note, length=1.8):
    """A glockenspiel bar: a short inharmonic shimmer and a long clean ring."""
    t = t_axis(length)
    f = hz(note)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.7) + 0.1 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.08)
    sig += 0.02 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t / 0.03)
    return sig * np.minimum(t / 0.003, 1)


def woodblock(high=True):
    """The real clock's tick: a hollow knock, tick and tock alternating."""
    t = t_axis(0.09)
    f = 1150 if high else 900
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.018) + 0.12 * np.sin(2 * np.pi * f * 2.3 * t) * np.exp(-t / 0.006)
    sig += fft_filter(noise(0.09), low=1500, high=4000) * np.exp(-t / 0.002) * 0.1
    return sig * np.minimum(t / 0.001, 1)


def timpani(note, length=1.6):
    """A kettle drum: its pitch settling after the strike, a felt thump."""
    t = t_axis(length)
    f = hz(note) * (1 + 0.04 * np.exp(-t / 0.05))
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.7) + 0.35 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * np.exp(-t / 0.3)
    sig += fft_filter(noise(length), low=60, high=600) * np.exp(-t / 0.03) * 0.5
    return sig * np.minimum(t / 0.002, 1)


def roll(start, duration, note, low=0.05, high=0.6):
    """A timpani roll, swelling from `low` to `high`."""
    n = int(duration / 0.055)
    for i in range(n):
        x = i / max(n - 1, 1)
        place(start + i * 0.055 + rng.uniform(-0.006, 0.006), timpani(note, 0.5), 0.6 * (low + (high - low) * x ** 1.6), pan=0.1 * (-1) ** i, wet=0.15)


def cymbal(length=2.2):
    t = t_axis(length)
    return fft_filter(noise(length), low=3000, high=8000) * np.minimum(t / 0.004, 1) * np.exp(-t / 0.6)


def swell(duration):
    """A cymbal rolled with soft mallets, rising into what follows."""
    t = t_axis(duration)
    return fft_filter(noise(duration), low=2500, high=7500) * (t / duration) ** 2.5 * gate(t, duration - 0.02, 0.02)


def swoosh(duration):
    """Heavy velvet moving: dark noise, swelling and fading with the curtain's ease."""
    t = t_axis(duration)
    env = np.sin(np.pi * np.clip(t / duration, 0, 1)) ** 1.5
    return fft_filter(noise(duration), low=150, high=1400) * env


def scratch():
    """A pencil stroke: one rewritten line."""
    t = t_axis(0.12)
    return fft_filter(noise(0.12), low=1800, high=4500) * np.sin(np.pi * t / 0.12) * (1 + 0.5 * np.sin(2 * np.pi * 45 * t))


def key():
    """A soft key press."""
    t = t_axis(0.025)
    return fft_filter(noise(0.025), low=1500, high=5000) * np.exp(-t / 0.004)


SWING = 2 / 3                         # a swung "and": two thirds into the beat


def waltz(bar_start, root, chord, gain=1.0):
    """One bar of jazz waltz: the cello's root on one and its fifth on three, the violins' chord short on two and
    accented on the swung "and" of two."""
    place(bar_start, cello(root, 1.0), 0.3 * gain, pan=-0.15, wet=0.2)
    place(beat(bar_start, 2), cello(root + 7, 0.5), 0.17 * gain, pan=-0.15, wet=0.2)
    for b, length, level in ((1, 0.18, 0.12), (1 + SWING, 0.32, 0.17)):
        for i, note in enumerate(chord):
            place(beat(bar_start, b) + 0.004 * i, pizz(note, length), level * gain, pan=0.3 - 0.1 * i, wet=0.25)


def melody(bar_start, notes, gain=0.16, pan=-0.25):
    """Clarinet notes, each (beat offset, MIDI note, length in beats)."""
    for b, note, length in notes:
        place(beat(bar_start, b), clarinet(note, length * BEAT - 0.05), gain, pan=pan, wet=0.3)


# The real clock: the same uneven ticks as its second hand in animatic.html (the same generator and seed), in the centre,
# then in the left wing once it steps aside.
seed = 7


def rand():
    global seed
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647


t, i = 0.3, 0
while t < VIDEO_END:
    rand()                            # the shake's direction
    in_wings = t > SWAP + 0.6
    place(t, woodblock(i % 2 == 0), 0.05 if in_wings else 0.085, pan=-0.6 if in_wings else 0.0, wet=0.1)
    t += 0.22 + rand() * 0.55
    i += 1

# Chords: (cello root, violins' voicing), with sevenths and ninths for the jazz waltz.
DM = (38, [60, 65, 69])               # Dm7
G7 = (43, [59, 65, 69])               # G9, the bright Dorian turn of D minor
A7 = (45, [61, 67, 70])               # A7 flat 9
BB = (46, [62, 65, 69])               # B flat major 7
C7 = (36, [64, 70, 74])               # C9
F = (41, [65, 69, 72, 76])            # F major 7

# Hook: a timpani roll and a cymbal swell as the curtains open, then a quiet waltz in D minor and a clarinet figure.
roll(0.0, CURTAIN_OPEN + 0.3, 50, 0.04, 0.25)
place(CURTAIN_OPEN - 0.2, swell(0.9), 0.05, wet=0.3)
place(CURTAIN_OPEN, swoosh(0.9), 0.1, pan=-0.5)
place(CURTAIN_OPEN, swoosh(0.9), 0.1, pan=0.5)
place(1.5, timpani(38, 1.6), 0.2, wet=0.2)
for k, chord in enumerate((DM, G7, DM, G7, DM, A7)):
    waltz(1.5 + k * BAR, *chord, gain=1.0)
melody(1.5, [(0, 74, 1), (1, 77, SWING), (1 + SWING, 76, 1 - SWING), (2, 74, SWING), (2 + SWING, 71, 1 - SWING)])
melody(3.0, [(0, 72, 1), (1, 71, SWING), (1 + SWING, 69, 1 + SWING)])

# The three real runs: a pizzicato note on each uneven step of the object, the pitch wandering as the object does.
REAL_STEPS = [[62, 65, 64, 67, 65, 66], [62, 66, 65, 69, 70, 69], [62, 64, 67, 69, 72, 73]]
for r, steps in enumerate(REAL_STEPS):
    start = REAL_RUNS + r * BAR
    for s, note in enumerate(steps):
        place(start + 0.15 + s * 0.15, pizz(note + 12, 0.3), 0.14, pan=-0.3 + 0.12 * s, wet=0.2)
    chip = start + 1.05
    if r == 1:
        place(chip, pizz(74, 0.5), 0.2, pan=0.1, wet=0.3)
    else:
        # A sour bassoon: a semitone that will not settle.
        place(chip, bassoon(51, 0.45, release=0.15, vibrato=0.006), 0.2, pan=0.1, wet=0.2)
        place(chip, bassoon(50, 0.45, release=0.15), 0.15, pan=-0.1, wet=0.2)

# Without Understudy: a plodding bassoon line, a scratch for each rewritten line, a low note for each added file, and a
# dull timpani on the red cross.
for k, chord in enumerate((DM, BB, A7)):
    place(USUAL + k * BAR, cello(chord[0], 1.2), 0.27, pan=-0.15, wet=0.2)
for k, note in enumerate((50, 48, 46, 45, 46, 45, 43, 45, 44)):
    place(USUAL + k * BEAT, bassoon(note, BEAT - 0.08), 0.28, pan=0.15, wet=0.2)
for i in range(6):
    place(USUAL + 0.8 + i * 0.18, scratch(), 0.13, pan=0.2 - 0.08 * i)
for i, note in enumerate((57, 55, 53)):
    place(USUAL + 2.0 + i * 0.5, cello(note, 0.8), 0.2, pan=0.3, wet=0.2)
place(USUAL + 3.6, timpani(45, 1.4), 0.2, wet=0.2)

# The first curtain: a roll up to the close, a swoosh each way, a swell into the opening.
roll(CURTAIN1 - 0.5, 1.1, 45, 0.04, 0.15)
for pan in (-0.5, 0.5):
    place(CURTAIN1, swoosh(0.7), 0.1, pan=pan)
    place(CURTAIN1 + 1.2, swoosh(0.9), 0.1, pan=pan)
place(CURTAIN1 + 0.6, cymbal(1.2), 0.03, wet=0.3)

# With Understudy: pizzicato on C building under the typed line, soft keys, the real clock leaving on a falling run.
for k in range(2):
    bar_start = 16.5 + k * BAR
    place(bar_start, cello(36, 1.2), 0.3 + 0.05 * k, pan=-0.15, wet=0.2)
    for e in range(6):
        for i, note in enumerate(C7[1]):
            place(bar_start + e * BEAT / 2 + 0.004 * i, pizz(note, 0.25), (0.1 + 0.06 * (k * 6 + e) / 11), pan=0.3 - 0.1 * i, wet=0.2)
for c in range(0, 50, 2):
    place(TYPING + c * 1.4 / 50, key(), 0.05, pan=0.1)
for i, note in enumerate((84, 82, 79, 76, 72, 70, 67, 64)):
    place(SWAP + i * 0.12, pizz(note, 0.3), 0.15, pan=-0.1 - 0.08 * i, wet=0.25)
place(SWAP + 0.4, swell(BAND - SWAP - 0.4), 0.07, wet=0.3)

# The band comes in as the cardboard clock arrives: timpani, cymbal, glockenspiel, then the waltz in F major and the
# clarinet's tune. A small glockenspiel trill for its wobble.
place(BAND, timpani(41, 2.0), 0.2, wet=0.2)
place(BAND, cymbal(), 0.05, pan=0.2, wet=0.3)
place(BAND, glock(89, 2.0), 0.16, pan=0.2, wet=0.4)
for i, note in enumerate((89, 93, 89, 93)):
    place(BAND + 0.3 + i * 0.07, glock(note, 0.8), 0.07 - 0.012 * i, pan=0.25, wet=0.4)
for k, chord in enumerate((F, C7, F, BB, F, C7)):
    waltz(BAND + k * BAR, *chord)
melody(BAND, [(0, 72, SWING), (SWING, 74, 1 - SWING), (1, 76, SWING), (1 + SWING, 77, 1 - SWING), (2, 79, 1)])
melody(BAND + BAR, [(0, 81, 1 + SWING), (1 + SWING, 79, 1 - SWING), (2, 76, 1)])
melody(STUB_RUNS, [(0, 72, 2), (2 + SWING, 74, 1 - SWING)], gain=0.12)
melody(STUB_RUNS + BAR, [(0, 77, 1), (1, 74, SWING), (1 + SWING, 72, 1 - SWING), (2, 70, 1)], gain=0.12)
melody(STUB_RUNS + 2 * BAR, [(0, 69, 2), (2 + SWING, 72, 1 - SWING)], gain=0.12)
melody(STUB_RUNS + 3 * BAR, [(0, 76, SWING), (SWING, 77, 1 - SWING), (1, 79, SWING), (1 + SWING, 81, 1 - SWING), (2, 82, 1)])

# The three runs with Understudy: a smooth rising arpeggio, the object's glide, landing on a ding; the dings rise.
ARPEGGIOS = [[65, 69, 72, 77], [65, 70, 74, 77], [65, 69, 72, 77]]
DINGS = [81, 84, 89]
for r, (notes, ding) in enumerate(zip(ARPEGGIOS, DINGS)):
    start = STUB_RUNS + r * BAR
    for s, note in enumerate(notes):
        place(start + 0.15 + s * 0.22, pizz(note + 12, 0.35), 0.11, pan=-0.3 + 0.2 * s, wet=0.3)
    place(start + 1.05, glock(ding, 2.0), 0.2, pan=0.3, wet=0.4)

# Leak detection: the waltz thins, a clarinet question, a knock and a ding as the warning lands.
for k, chord in enumerate((DM, BB, C7)):
    waltz(LEAK + k * BAR, *chord, gain=0.6)
melody(LEAK, [(1, 74, SWING), (1 + SWING, 77, 1 - SWING), (2, 76, 1)], gain=0.13)
melody(LEAK + BAR, [(0, 74, 1 + SWING), (1 + SWING, 72, 1 - SWING), (2, 70, 1)], gain=0.13)
melody(LEAK + 2 * BAR, [(0, 72, SWING), (SWING, 74, 1 - SWING), (1, 76, 1)], gain=0.12)
place(WARNING, woodblock(False), 0.14, pan=0.1, wet=0.2)
place(WARNING + 0.04, glock(86, 1.5), 0.12, pan=0.1, wet=0.4)

# The last curtain: a roll on C up to the close, a cymbal when it meets, then the swoosh of the opening.
roll(CURTAIN2 - 0.4, 1.0, 48, 0.05, 0.3)
for pan in (-0.5, 0.5):
    place(CURTAIN2, swoosh(0.7), 0.1, pan=pan)
    place(FINAL, swoosh(0.9), 0.1, pan=pan)
place(CURTAIN2 + 0.6, cymbal(1.8), 0.06, wet=0.3)
place(FINAL, swell(TITLE - FINAL), 0.06, wet=0.3)

# The title: the whole band on F major, ringing out.
place(TITLE, timpani(41, 3.0), 0.16, wet=0.25)
place(TITLE, cymbal(3.0), 0.04, pan=0.2, wet=0.35)
place(TITLE, cello(41, 2.0), 0.25, pan=-0.1, wet=0.3)
for i, note in enumerate((65, 69, 72, 77)):
    place(TITLE + 0.006 * i, pizz(note, 1.0, tau=0.3), 0.14, pan=0.35 - 0.12 * i, wet=0.35)
place(TITLE, clarinet(77, 2.2, release=0.6), 0.12, pan=-0.25, wet=0.4)
place(TITLE, bassoon(53, 2.2, release=0.6), 0.14, pan=0.2, wet=0.35)
place(TITLE, glock(89, 2.5), 0.1, pan=0.3, wet=0.4)

# The bow: a clarinet grace into a glockenspiel note as the cutout dips, a second note as it rises.
place(BOW - 0.1, clarinet(72, 0.08, release=0.04), 0.12, pan=-0.25, wet=0.3)
place(BOW, clarinet(77, 0.5, release=0.3), 0.1, pan=-0.25, wet=0.35)
place(BOW, glock(93, 1.8), 0.1, pan=0.3, wet=0.45)
place(BOW + 0.7, glock(89, 2.2), 0.1, pan=0.3, wet=0.45)
place(BOW + 0.7, pizz(53, 1.0, tau=0.3), 0.13, pan=-0.1, wet=0.3)


# Mix.

def reverb(sig, seconds=2.0):
    """A hall tail from decaying noise, 22 ms pre-delay, rolled off above 5 kHz, nothing below 200 Hz."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t / (seconds / 6.9))[:, None]
    ir = fft_filter(ir, low=200, high=5000)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    ir = np.concatenate([np.zeros((int(0.022 * SR), 2)), ir])
    size = 1 << int(np.ceil(np.log2(len(sig) + len(ir))))
    return np.fft.irfft(np.fft.rfft(sig, size, axis=0) * np.fft.rfft(ir, size, axis=0), size, axis=0)[:len(sig)]


def true_peak(sig):
    """Peak of the signal oversampled 4 times, as a loudness meter reads it."""
    n = len(sig)
    spec = np.fft.rfft(sig, axis=0)
    up = np.fft.irfft(spec, 4 * n, axis=0) * 4
    return np.max(np.abs(up))


def limit(sig, ceiling, lookahead=0.004, release=0.12):
    """A transparent lookahead peak limiter: gain falls before a peak arrives and recovers slowly, so nothing clips."""
    la = int(lookahead * SR)
    peak = np.max(np.abs(sig), axis=1)
    need = np.minimum(1.0, ceiling / np.maximum(peak, 1e-9))
    padded = np.concatenate([need, np.ones(la)])
    ahead = np.lib.stride_tricks.sliding_window_view(padded, la + 1).min(axis=1)[:len(sig)]
    coef = np.exp(-1 / (release * SR))
    gain = np.empty_like(ahead)
    g = 1.0
    for i, a in enumerate(ahead):
        g = a if a < g else a + (g - a) * coef
        gain[i] = g
    kernel = np.ones(la) / la
    gain = np.minimum(np.convolve(gain, kernel, mode='same'), ahead)
    return sig * gain[:, None]


def k_weight(sig):
    """The loudness meter's ear (ITU-R BS.1770 K-weighting, approximated): no deep bass, 4 dB more above 1.5 kHz."""
    spec = np.fft.rfft(sig, axis=0)
    f = np.fft.rfftfreq(len(sig), 1 / SR)
    gain = 10 ** (4 * f ** 2 / (f ** 2 + 1500 ** 2) / 20) / (1 + (38 / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(spec * gain[:, None], len(sig), axis=0)


def loudness(sig, window):
    """Loudness in LUFS over a sliding window in seconds, per sample."""
    power = (k_weight(sig) ** 2).sum(axis=1)
    w = int(window * SR)
    c = np.concatenate([[0], np.cumsum(power)])
    idx = np.arange(len(power))
    lo, hi = np.clip(idx - w // 2, 0, len(power)), np.clip(idx + w // 2, 0, len(power))
    return -0.691 + 10 * np.log10((c[hi] - c[lo]) / np.maximum(hi - lo, 1) + 1e-12)


def smooth(x, seconds):
    w = int(seconds * SR)
    c = np.concatenate([np.zeros(w // 2 + 1), np.cumsum(x), np.full(w // 2, np.cumsum(x)[-1])])
    return (c[w:w + len(x)] - c[:len(x)]) / w


mix = dry + reverb(send, 2.2) * 0.6
# The tilt: 3 dB less mud around 250 Hz, 3 dB less of the harsh band around 3.5 kHz, 4 dB less air above 6 kHz.
spec = np.fft.rfft(mix, axis=0)
f = np.fft.rfftfreq(len(mix), 1 / SR)
mud = 1 / (1 + ((f - 250) / 200) ** 2)
harsh = 1 / (1 + ((f - 3500) / 1500) ** 2)
air = f ** 2 / (f ** 2 + 6000 ** 2)
spec *= (10 ** ((-3 * mud - 3 * harsh - 4 * air) / 20))[:, None]
mix = np.fft.irfft(spec, len(mix), axis=0)
# The low end in mono, so the cello and the timpani sit in the centre on every speaker.
low = fft_filter(mix, high=120)
mix = mix - low + low.mean(axis=1, keepdims=True)
# A slow leveler: each second louder than the score's median comes halfway back to it, by at most 5 dB, so no scene
# jumps out while the swells keep their shape. It never raises a quiet second: in a curtain's gap that lifted the cymbal
# and the swooshes above the music around them.
level = loudness(mix, 1.0)
active = level > level.max() - 20
target = np.median(level[active])
ride = np.clip((target - level) * 0.5, -5, 0)
mix *= 10 ** (smooth(ride, 0.6) / 20)[:, None]
# The tail fades over the last 1.4 s of the video, after the bow.
fade = np.clip((VIDEO_END - np.arange(N) / SR) / 1.4, 0, 1)
mix *= fade[:, None]

# -16 LUFS over the score, then a limiter for the rare peak and the true peak at -1 dBFS at most.
CEILING = 10 ** (-1.0 / 20)
power = (k_weight(mix) ** 2).sum(axis=1)
blocks = power[:len(power) // 4800 * 4800].reshape(-1, 4800).mean(axis=1)
gated = blocks[-0.691 + 10 * np.log10(blocks + 1e-12) > -70]
gated = gated[10 * np.log10(gated + 1e-12) > 10 * np.log10(gated.mean()) - 10]
mix *= 10 ** ((-16.0 - (-0.691 + 10 * np.log10(gated.mean()))) / 20)
mix = limit(mix, CEILING * 0.94)
mix *= min(1.0, CEILING / true_peak(mix))

out = sys.argv[1] if len(sys.argv) > 1 else __file__.rsplit('\\', 1)[0].rsplit('/', 1)[0] + '/soundtrack.wav'
pcm = np.round(np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out, f'{LENGTH:.1f} s')
