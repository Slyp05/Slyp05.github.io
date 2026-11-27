"""Builds the store video's soundtrack, synced to animatic.html's timeline.

Usage: python sound.py [out.wav]   (default: soundtrack.wav beside this file)
Needs numpy, scipy, pedalboard and pyloudnorm: pip install numpy scipy pedalboard pyloudnorm

120 BPM (a beat is 0.5 s, a bar 2 s), D minor, resolving to D major on the end card. Every note is synthesized from a
fixed seed, so each run writes the same file.

- Problem (bars 0 to 3): a filtered pad and a heartbeat kick. Each rule the code holds lights on a pluck; the Inspector
  taking 500 is three key clicks and a dull bonk; the six attributes stamp in on sixteenths over a riser, then a
  quarter beat of silence.
- Drop (bar 4): an impact and the full groove: a kick on 1, 2-and and 3-and, a clap on 2 and 4, swung sixteenth hats,
  a pumping bass, and a sixteenth-note pluck under a sidechained pad.
- Rows (bar 5): each row that lands on its eighth plays the next note of a run, the groove unchanged under it.
- Rules (bars 6 and 7): each fact lands as a pluck stab on its eighth; the snap to 20 is a low thunk.
- Mistake (bars 8 and 9): a Gm9 then A7 interlude, tense; the panel opens on a low pair, Add Tag resolves upward.
- Live (bars 10 to 15): the lead hook; resting on Take Damage previews its run on a soft rising shimmer. Each button press is a click, each undo a reversed swell into a tick; the dialog
  pops, Run clicks, the running method ticks softly, and its end is a pluck.
- Search (bars 16 and 17), answers (18 and 19) and the build (20 and 21): an answer to the hook plays, softer, each section
  opens on a short fill, and each click plays a note a step higher than the last, so the showcase keeps climbing; the
  build adds an octave pluck and open hats, and Create lands on a stab.
- End card (bars 22 to 24): the groove stops on a soft impact; a D major chord and two bells ring out to the fade.
"""
import sys
import wave
import numpy as np
import pedalboard as pb
import pyloudnorm
from scipy.ndimage import minimum_filter1d
from scipy.signal import butter, resample_poly, sosfilt

SR = 48000
BEAT = 0.5
BAR = 4 * BEAT
S16 = BEAT / 4

# Times shared with animatic.html.
GROOVE, ROWS, RULES, MISTAKE, LIVE, PREVIEW, UNDO, SEARCH, ANSWERS, BUILD, END_CARD = (4 * BAR, 5 * BAR, 6 * BAR, 8 * BAR, 10 * BAR, 12 * BAR,
                                                                               13 * BAR, 16 * BAR, 18 * BAR, 20 * BAR, 22 * BAR)
END = 25 * BAR                                   # 50 s: the end card holds for three bars
RULE_FLASH = [2.0, 2.5, 3.0, 3.5]                # bar 1: the clamp, the movement, the if, the comment
UNITY_IN, TYPED, ACCEPTED, HIDDEN = 4.0, 4.5, 5.0, 5.25
STAMPS = [6.0 + k * S16 for k in range(6)]
SILENCE = 7.75
ROW_TIMES = [ROWS + k * 2 * S16 for k in range(12)]
FACTS = {'limits': 13.0, 'snap': 13.25, 'unit': 13.75, 'strike': 14.25, 'tooltip': 14.5, 'timer': 15.0, 'tick': 15.75}
ERROR_OPEN, ERROR_FIX = 16.75, 18.25
LIMIT_HIT = 21.5
AMOUNT, HOVER = [24.25, 24.375], 25.0
PRESSES = [26.0, 26.5]
UNDOS = [27.25, 27.75]
ASK, RUN, RUN_END = 28.5, 29.5, 30.5
FIND, FIND_KEYS, FIND_CLEAR = 32.5, [33.0, 33.125, 33.25], 35.25
PANEL, STYLE = 36.5, 37.25
FOLD, MENU, PICK, TYPE_IN, CREATE = 40.25, 40.5, 40.75, 41.0, 41.75

rng = np.random.default_rng(11)
N = int((END + 0.5) * SR)
PHASES = rng.uniform(0, 2 * np.pi, 128)
buses = {name: np.zeros((N, 2)) for name in ('drums', 'clap', 'bass', 'pad', 'keys', 'lead', 'sfx')}


def hz(note):
    return 440.0 * 2 ** ((note - 69) / 12)


def t_axis(duration):
    return np.arange(int(duration * SR)) / SR


def place(bus, start, sig, gain=1.0, pan=0.0):
    """Adds a mono or stereo signal to a bus at a time in seconds; pan from -1 (left) to 1 (right)."""
    i = int(round(start * SR))
    if (i >= N) or (len(sig) == 0):
        return
    if sig.ndim == 1:
        left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * left, sig * right], axis=1) * np.sqrt(2)
    j = max(i, 0)
    end = min(N, i + len(sig))
    buses[bus][j:end] += sig[j - i:end - i] * gain


def band(sig, low=None, high=None, order=2):
    if (low is not None) and (high is not None):
        sos = butter(order, [low, high], 'bandpass', fs=SR, output='sos')
    elif low is not None:
        sos = butter(order, low, 'highpass', fs=SR, output='sos')
    else:
        sos = butter(order, high, 'lowpass', fs=SR, output='sos')
    return sosfilt(sos, sig, axis=0)


def adsr(duration, attack, decay, sustain, release):
    t = t_axis(duration + release)
    a = np.minimum(t / max(attack, 1e-4), 1.0)
    d = sustain + (1 - sustain) * np.exp(-np.maximum(t - attack, 0) / max(decay, 1e-4))
    r = np.clip((duration + release - t) / max(release, 1e-4), 0, 1)
    return a * d * r


def saw(f, t, top, rolloff=1.0, phase_seed=0):
    """A band-limited saw: harmonics up to `top` Hz, each softened above it by a fourth-order slope."""
    out = np.zeros_like(t)
    k = 1
    while (f * k < min(top * 2.5, 16000)) and (k < 120):
        amp = (1 / k ** rolloff) / (1 + (f * k / top) ** 4)
        out += amp * np.sin(2 * np.pi * f * k * t + PHASES[(k + phase_seed) % 128])
        k += 1
    return out


# Instruments.

def pluck(note, duration=0.5, bright=1.0, decay=0.22):
    """A saw pluck whose upper harmonics close fast, like a filter envelope."""
    t = t_axis(duration)
    f = hz(note)
    out = np.zeros_like(t)
    k = 1
    while (f * k < 7000) and (k < 60):
        out += (1 / k) * np.exp(-t * k * 9 / bright) * np.sin(2 * np.pi * f * k * t + PHASES[k])
        k += 1
    return out * np.minimum(t / 0.002, 1) * np.exp(-t / decay) * np.clip((duration - t) / 0.03, 0, 1)


def pad(notes, duration, top=1800, attack=0.6, release=0.8):
    """Two saws per note, a few cents apart, one on each side."""
    t = t_axis(duration + release)
    left, right = np.zeros_like(t), np.zeros_like(t)
    for i, note in enumerate(notes):
        left += saw(hz(note - 0.05), t, top, phase_seed=i * 7)
        right += saw(hz(note + 0.05), t, top, phase_seed=i * 7 + 3)
    shape = adsr(duration, attack, 1.0, 1.0, release)
    return np.stack([left, right], axis=1) * shape[:, None] / len(notes)


def bass(note, duration):
    t = t_axis(duration + 0.02)
    f = hz(note)
    sig = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t + 0.6) + 0.12 * np.sin(6 * np.pi * f * t)
    sig = np.tanh(1.8 * sig) / np.tanh(1.8)
    return sig * adsr(duration, 0.004, 0.12, 0.6, 0.02)


def kick(punch=1.0):
    t = t_axis(0.45)
    phase = 2 * np.pi * np.cumsum(48 + 110 * np.exp(-t / 0.035)) / SR
    body = np.sin(phase) * np.exp(-t / 0.2)
    click = band(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t / 0.003) * 0.25 * punch
    return np.tanh(1.5 * (body + click)) / np.tanh(1.5)


def clap():
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    noise = band(rng.standard_normal(n), 900, 4200)
    shape = np.zeros(n)
    for d in (0.0, 0.009, 0.018):
        shape += np.where(t >= d, np.exp(-(t - d) / 0.005), 0)
    shape += np.where(t >= 0.027, 0.55 * np.exp(-(t - 0.027) / 0.09), 0)
    body = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.04) * 0.5
    return noise * shape * 0.8 + body


def hat(length=0.025):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return band(rng.standard_normal(n), low=7500) * np.exp(-t / length)


def lead(note, duration):
    """A soft square with a late vibrato; the phase integrates the frequency, so held notes stay in tune."""
    t = t_axis(duration + 0.12)
    vib = 0.18 * np.clip((t - 0.18) / 0.2, 0, 1) * np.sin(2 * np.pi * 5.2 * t)
    freq = hz(note) * 2 ** (vib / 12)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    sig = np.zeros_like(t)
    for k in range(1, 12, 2):
        if hz(note) * k > 3500:
            break
        sig += np.sin(k * phase) / (k * k) * (1 / (1 + (hz(note) * k / 1700) ** 4))
    sig += 0.25 * np.sin(2 * phase)
    return sig * adsr(duration, 0.012, 0.25, 0.75, 0.12)


def bell(note, duration=5.0):
    """An FM bell on a harmonic ratio, so it rings in tune."""
    t = t_axis(duration)
    f = hz(note)
    index = 1.3 * np.exp(-t / 0.4)
    sig = np.sin(2 * np.pi * f * t + index * np.sin(2 * np.pi * 2 * f * t))
    return sig * np.minimum(t / 0.003, 1) * np.exp(-t / 1.8)


# Sound effects.

def key_click():
    t = t_axis(0.04)
    return band(rng.standard_normal(len(t)), 1800, 6000) * np.exp(-t / 0.005) * rng.uniform(0.8, 1.0)


def bonk():
    """The Inspector taking a value it should not: two dull tones a semitone apart."""
    t = t_axis(0.5)
    sig = np.sin(2 * np.pi * hz(50) * t) + 0.8 * np.sin(2 * np.pi * hz(51) * t)
    return np.tanh(2 * sig) * np.exp(-t / 0.14) * np.minimum(t / 0.004, 1)


def stamp(note):
    """A rubber stamp: a tuned thud and a paper slap."""
    t = t_axis(0.4)
    phase = 2 * np.pi * np.cumsum(hz(note) * (1 + 0.8 * np.exp(-t / 0.02))) / SR
    thud = np.sin(phase) * np.exp(-t / 0.12)
    slap = band(rng.standard_normal(len(t)), 400, 2500) * np.exp(-t / 0.025) * 0.6
    return np.tanh(1.6 * (thud + slap))


def riser(duration):
    t = t_axis(duration)
    x = t / duration
    phase = 2 * np.pi * np.cumsum(220 * 2 ** (2.5 * x)) / SR
    tone = np.sin(phase) * 0.35 + np.sin(phase * 1.5) * 0.2
    noise = rng.standard_normal(len(t))
    swept = np.zeros_like(t)
    edges = np.linspace(0, len(t), 9).astype(int)
    for a, b in zip(edges[:-1], edges[1:]):
        fc = 500 * 2 ** (4 * (a / len(t)))
        swept[a:b] = band(noise, fc / 1.5, min(fc * 1.5, 20000))[a:b]
    return (tone + swept * 0.5) * x ** 2


def impact(soft=False):
    t = t_axis(2.5)
    phase = 2 * np.pi * np.cumsum(30 + 70 * np.exp(-t / 0.08)) / SR
    boom = np.sin(phase) * np.exp(-t / (0.5 if soft else 0.8))
    thump = band(rng.standard_normal(len(t)), high=350) * np.exp(-t / 0.15) * 1.5
    crash = band(rng.standard_normal(len(t)), low=3500) * np.exp(-t / 0.9) * (0.0 if soft else 0.12)
    return np.tanh(1.4 * (boom + thump)) + crash


def whoosh(duration, up=True):
    t = t_axis(duration)
    x = t / duration
    noise = rng.standard_normal(len(t))
    out = np.zeros_like(t)
    edges = np.linspace(0, len(t), 7).astype(int)
    for a, b in zip(edges[:-1], edges[1:]):
        p = a / len(t)
        fc = 400 * 2 ** (3 * (p if up else 1 - p))
        out[a:b] = band(noise, fc / 1.6, fc * 1.6)[a:b]
    return out * np.sin(np.pi * x) ** 2


def click():
    t = t_axis(0.08)
    thump = np.sin(2 * np.pi * 210 * t) * np.exp(-t / 0.012)
    tick = band(rng.standard_normal(len(t)), low=2500) * np.exp(-t / 0.003)
    return 0.8 * thump + 0.5 * tick


def reversed_swell(notes, duration=0.45):
    """A pluck chord played backwards, so it swells into the time it ends on."""
    sig = sum(pluck(n, duration, bright=1.2, decay=0.3) for n in notes)
    return sig[::-1] / len(notes)


# Harmony. Pads leave the root to the bass; no voicing holds a semitone.
Dm9 = (38, [50, 53, 57, 60, 64])
Bbmaj7 = (34, [50, 53, 58, 62, 69])
Fadd9 = (41, [53, 57, 60, 65, 67])
C6 = (36, [52, 55, 60, 64, 69])
Gm9 = (31, [53, 58, 62, 65, 69])
A7sus = (33, [52, 57, 62, 64, 67])
A7 = (33, [52, 55, 61, 64, 67])
Dmaj9 = (38, [50, 54, 57, 61, 64])

# (bar, beats, chord) from 0 s to the end card.
PROGRESSION = [(0, 8, Dm9), (2, 4, Bbmaj7), (3, 2, A7sus), (3.5, 2, A7),
               (4, 4, Dm9), (5, 4, Bbmaj7), (6, 4, Fadd9), (7, 4, C6),
               (8, 4, Gm9), (9, 2, A7sus), (9.5, 2, A7),
               (10, 4, Dm9), (11, 4, Bbmaj7), (12, 4, Fadd9), (13, 4, C6),
               (14, 4, Dm9), (15, 4, Bbmaj7), (16, 4, Fadd9), (17, 4, C6),
               (18, 4, Dm9), (19, 4, Bbmaj7), (20, 4, Gm9), (21, 2, A7sus), (21.5, 2, A7)]


def chord_at(time):
    for bar, beats, chord in reversed(PROGRESSION):
        if time >= bar * BAR - 1e-6:
            return chord
    return Dm9


# Pads: lowpassed through the problem, open from the drop.
for bar, beats, (root, notes) in PROGRESSION:
    start, length = bar * BAR, beats * BEAT
    top = 900 if (start < GROOVE) else 2200
    place('pad', start, pad(notes, length, top=top, attack=(1.2 if start == 0 else 0.08), release=0.35), 0.55)

# Problem: a heartbeat kick in bars 1 and 2, the bass entering on bar 2.
for b in (1, 2):
    for off in (0, 6):
        place('drums', b * BAR + off * S16, band(kick(0.3), high=400), 0.5)
for k in range(8):
    place('bass', 2 * BAR + k * 2 * S16, bass(Bbmaj7[0] + 12, 0.18), 0.22)
for k in range(4):
    place('bass', 3 * BAR + k * 2 * S16, bass(A7[0] + 12, 0.18), 0.26)

# The four rules the code holds, rising.
for t, note in zip(RULE_FLASH, (69, 72, 74, 76)):
    place('keys', t, pluck(note, 0.9, bright=0.9, decay=0.35), 0.32, pan=0.3)

# The Inspector arrives, takes 500, and hides what it cannot show.
place('sfx', UNITY_IN - 0.25, whoosh(0.5), 0.12, pan=0.4)
for k in range(3):
    place('sfx', TYPED + k * 0.12, key_click(), 0.25, pan=0.35)
place('sfx', ACCEPTED, bonk(), 0.32, pan=0.3)
for k, note in enumerate((57, 53)):
    place('keys', HIDDEN + k * S16 * 2, pluck(note, 0.6, bright=0.6, decay=0.3), 0.3, pan=-0.2)

# The six attributes stamp in, rising, over a riser into a quarter beat of silence.
for t, note in zip(STAMPS, (38, 41, 43, 45, 48, 50)):
    place('sfx', t, stamp(note), 0.38, pan=-0.25 + 0.1 * STAMPS.index(t))
place('sfx', STAMPS[0], riser(SILENCE - STAMPS[0]), 0.22)
for k in range(6):
    place('clap', 7.0 + k * S16, clap(), 0.08 + 0.05 * k)

# The groove, from the drop to the end card.
KICKS = []
for bar in range(4, 22):
    t0 = bar * BAR
    root, notes = chord_at(t0)
    for off, gain in ((0, 1.0), (6, 0.8), (10, 0.9)):
        place('drums', t0 + off * S16, kick(), 0.6 * gain)
        KICKS.append(t0 + off * S16)
    if bar % 2 == 1:
        place('drums', t0 + 15 * S16, kick(0.4), 0.4)
    for off in (4, 12):
        place('clap', t0 + off * S16, clap(), 0.5, pan=0.05)
    for s in range(16):
        swing = 0.018 if (s % 2 == 1) else 0.0
        place('drums', t0 + s * S16 + swing, hat(0.035 if s % 4 == 2 else 0.018), (0.14, 0.06, 0.11, 0.06)[s % 4], pan=0.35)
    for s in range(16):
        chord_root = chord_at(t0 + s * S16)[0]
        if s in (0, 3, 8, 11):
            place('bass', t0 + s * S16, bass(chord_root, 0.2), 0.38)
        elif s in (6, 14):
            place('bass', t0 + s * S16, bass(chord_root + 12, 0.14), 0.32)
    for s in range(16):
        arp_notes = chord_at(t0 + s * S16)[1]
        step = (0, 2, 4, 2, 1, 3, 4, 3)[s % 8]
        accent = 1.0 if (s % 3 == 0) else 0.6
        place('keys', t0 + s * S16, pluck(arp_notes[step] + 12, 0.3, bright=0.7, decay=0.12), 0.13 * accent, pan=-0.4 + 0.2 * step)

# The drop: an impact, and the stickers scattering as a quick falling run.
place('sfx', GROOVE, impact(), 0.4)
for k, note in enumerate((81, 77, 74, 69, 65)):
    place('keys', GROOVE + 0.03 + k * 0.045, pluck(note, 0.5, bright=1.3, decay=0.2), 0.16, pan=(-0.6 if k % 2 else 0.6))
place('sfx', GROOVE + 0.5, whoosh(1.3), 0.08, pan=-0.2)

# Rows: each landing row plays the next note of a run over Bbmaj7, turning on the bar into F.
for t, note in zip(ROW_TIMES, (62, 65, 69, 70, 72, 74, 77, 79, 81, 79, 77, 74)):
    place('keys', t, pluck(note, 0.6, bright=1.1, decay=0.25), 0.24, pan=0.35)

# Rules: each fact a stab on its beat. The strike falls, clearing it rises.
# Every beam lands on the same pluck, one step higher each time; what the beams cause (the snap, the tick) only clicks.
for key, note in (('limits', 72), ('unit', 74), ('strike', 77), ('tooltip', 79), ('timer', 81)):
    place('keys', FACTS[key], pluck(note, 0.7, 1.2, 0.3) + 0.5 * pluck(note - 12, 0.7, 1.0, 0.3), 0.24, pan=0.35)
place('sfx', FACTS['snap'], click(), 0.25, pan=0.35)
place('sfx', FACTS['tick'], click(), 0.3, pan=0.3)

# Live: the lead hook, (bar offset in beats, length in beats, note).
HOOK = [
    (0, 0.75, 74), (0.75, 0.75, 77), (1.5, 0.5, 81), (2, 0.5, 79), (2.5, 0.5, 77), (3, 0.5, 76), (3.5, 0.5, 77),
    (4, 1.5, 74), (5.5, 0.5, 72), (6, 0.5, 74), (6.5, 1.5, 77),
    (8, 0.75, 79), (8.75, 0.75, 77), (9.5, 0.5, 74), (10, 0.5, 72), (10.5, 0.5, 69), (11, 1, 72),
    (12, 0.75, 76), (12.75, 0.75, 72), (13.5, 0.5, 76), (14, 0.5, 79), (14.5, 0.5, 76), (15, 1, 74),
]
place('sfx', LIVE - 0.4, whoosh(0.45), 0.1, pan=0.3)
for off, beats, note in HOOK:
    place('lead', LIVE + off * BEAT, lead(note, beats * BEAT * 0.92), 0.13, pan=-0.1)
# An answer to the hook under the search and the answers, softer: the same chords, a new line, so the showcase keeps its
# song without repeating it.
HOOK_ANSWER = [
    (0, 0.5, 69), (0.5, 0.5, 72), (1, 1, 74), (2.5, 0.5, 77), (3, 1, 76),
    (4, 0.75, 74), (4.75, 0.75, 65), (5.5, 0.5, 72), (6, 2, 74),
    (8, 0.5, 77), (8.5, 0.5, 79), (9, 0.5, 81), (9.5, 0.5, 79), (10, 1, 77), (11.5, 0.5, 72),
    (12, 0.75, 76), (12.75, 0.75, 79), (13.5, 0.5, 76), (14, 1, 72), (15, 1, 74),
]
for off, beats, note in HOOK_ANSWER:
    place('lead', 14 * BAR + off * BEAT, lead(note, beats * BEAT * 0.92), 0.1, pan=-0.1)

# The mistake: its panel opens on a low note over Gm9; Add Tag resolves upward over A7 into the Dm of Play mode.
place('sfx', ERROR_OPEN, click(), 0.3, pan=0.35)
place('keys', ERROR_OPEN, pluck(62, 0.6, 0.9, 0.25) + pluck(58, 0.6, 0.9, 0.25), 0.2, pan=0.35)
place('sfx', ERROR_FIX, click(), 0.35, pan=0.35)
place('keys', ERROR_FIX, sum(pluck(n, 0.8, 1.2, 0.3) for n in (69, 73, 76)) / 2, 0.26, pan=0.3)
place('sfx', LIMIT_HIT, click(), 0.28, pan=0.35)
place('keys', LIMIT_HIT, pluck(57, 0.5, 0.9), 0.25, pan=0.35)
# Amount is typed (1, 0); resting on Take Damage previews its run, a soft rising shimmer; then it is pressed.
for t in AMOUNT:
    place('sfx', t, key_click(), 0.22, pan=0.35)
for k, note in enumerate((74, 77, 81)):
    place('keys', HOVER + k * S16, pluck(note, 0.6, 1.0, 0.3), 0.14, pan=0.35)
for t in PRESSES:
    place('sfx', t, click(), 0.4, pan=0.35)
for t in UNDOS:
    place('sfx', t - 0.45, reversed_swell(chord_at(t)[1]), 0.5, pan=0.3)
    place('sfx', t, key_click(), 0.3, pan=0.3)

# Or asked first: the dialog pops, Run clicks, and the method ticks while it runs.
place('keys', ASK, pluck(81, 0.4, 1.0, 0.12) + pluck(76, 0.4, 1.0, 0.12), 0.16, pan=0.35)
place('sfx', ASK, click(), 0.3, pan=0.35)
place('sfx', RUN, click(), 0.35, pan=0.35)
for k in range(8):
    place('sfx', RUN + 0.06 + k * S16, key_click(), 0.07, pan=0.35)
place('keys', RUN_END, pluck(74, 0.7, 1.1, 0.3), 0.22, pan=0.35)

# Each section of the showcase opens on a short fill and a small rise.
for start in (SEARCH, ANSWERS, BUILD):
    for k in range(3):
        place('clap', start - 3 * S16 + k * S16, clap(), 0.12 + 0.06 * k)
    place('sfx', start - 1.0, riser(1.0), 0.07)

# Search: the field opens, each typed letter a step up, the rows fold away, the search clears.
place('sfx', FIND, click(), 0.3, pan=0.35)
place('keys', FIND, pluck(69, 0.5, 1.0, 0.15), 0.18, pan=0.35)
for t, note in zip(FIND_KEYS, (72, 74, 77)):
    place('sfx', t, key_click(), 0.22, pan=0.35)
    place('keys', t, pluck(note, 0.4, 1.1, 0.12), 0.16, pan=0.35)
place('sfx', FIND_KEYS[-1] + 0.05, whoosh(0.35, up=False), 0.08, pan=0.3)
place('sfx', FIND_CLEAR, key_click(), 0.25, pan=0.35)
place('sfx', FIND_CLEAR + 0.05, whoosh(0.35), 0.08, pan=0.3)

# Answers: the panel opens a step higher, and Unity style lands higher still.
place('sfx', PANEL, click(), 0.3, pan=0.35)
place('keys', PANEL, pluck(77, 0.5, 1.1, 0.18), 0.2, pan=0.35)
place('sfx', STYLE, click(), 0.3, pan=0.35)
place('keys', STYLE, pluck(77, 0.7, 1.2) + pluck(81, 0.7, 1.2), 0.2, pan=0.35)

# The build: an octave pluck and open hats lift it; each step climbs, and Create lands on a stab.
for bar in (20, 21):
    t0 = bar * BAR
    for s16 in range(0, 16, 2):
        notes = chord_at(t0 + s16 * S16)[1]
        place('keys', t0 + s16 * S16, pluck(notes[(s16 // 2) % 5] + 24, 0.25, 0.9, 0.08), 0.06, pan=0.45)
    for s16 in (2, 6, 10, 14):
        place('drums', t0 + s16 * S16, hat(0.08), 0.08, pan=-0.35)
place('sfx', FOLD, click(), 0.28, pan=0.35)
place('keys', FOLD, pluck(74, 0.5, 1.0, 0.15), 0.18, pan=0.35)
place('sfx', MENU, click(), 0.28, pan=0.35)
place('keys', MENU, pluck(77, 0.4, 1.0, 0.12), 0.14, pan=0.35)
place('sfx', PICK, click(), 0.3, pan=0.35)
place('keys', PICK, pluck(77, 0.6, 1.2) + pluck(81, 0.6, 1.2), 0.2, pan=0.35)
for k in range(2):
    place('sfx', TYPE_IN + k * 0.12, key_click(), 0.25, pan=0.35)
place('sfx', CREATE, click(), 0.4, pan=0.35)
place('keys', CREATE, sum(pluck(n, 0.9, bright=1.3, decay=0.35) for n in (69, 74, 76, 81)) / 2, 0.32, pan=0.2)
place('drums', CREATE, kick(), 0.35)

# A fill into the end card.
for k in range(4):
    place('clap', END_CARD - 0.5 + k * S16, clap(), 0.18 + 0.08 * k)
place('sfx', END_CARD - 1.0, riser(1.0), 0.12)

# End card: a soft impact, D major, a bell for the title and one for the tagline.
place('sfx', END_CARD, impact(soft=True), 0.45)
place('pad', END_CARD, pad(Dmaj9[1], 4.0, top=1600, attack=0.05, release=2.0), 0.6)
place('bass', END_CARD, bass(Dmaj9[0], 3.5), 0.5)
place('keys', END_CARD, bell(74), 0.12, pan=-0.15)
place('keys', END_CARD + BAR / 2, bell(81), 0.08, pan=0.2)

# Mix.


def fx(sig, *plugins):
    return pb.Pedalboard(list(plugins))(sig.T.astype(np.float32), SR).T.astype(np.float64)


# The pad and the plucks duck under every groove kick.
t_all = np.arange(N) / SR
duck = np.ones(N)
for k in KICKS:
    i = int(k * SR)
    seg = t_all[i:i + int(0.4 * SR)] - k
    duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], 1 - 0.55 * np.exp(-seg / 0.11))

drums = fx(buses['drums'], pb.Compressor(threshold_db=-10, ratio=3, attack_ms=4, release_ms=90))
claps = fx(buses['clap'], pb.HighpassFilter(200))
low = fx(buses['bass'], pb.LowpassFilter(1200))
low = np.repeat(low.mean(axis=1, keepdims=True), 2, axis=1)
pads = fx(buses['pad'] * duck[:, None], pb.HighpassFilter(140), pb.Chorus(rate_hz=0.25, depth=0.15, mix=0.3))
keys = fx(buses['keys'] * (0.4 + 0.6 * duck)[:, None], pb.HighpassFilter(150),
          pb.Delay(delay_seconds=3 * S16, feedback=0.28, mix=0.2))
leads = fx(buses['lead'], pb.HighpassFilter(180), pb.Delay(delay_seconds=3 * S16, feedback=0.3, mix=0.22))
sfx = buses['sfx']

send = pads * 0.25 + keys * 0.4 + leads * 0.3 + claps * 0.2 + sfx * 0.15
wet = fx(send, pb.Reverb(room_size=0.72, damping=0.55, wet_level=1.0, dry_level=0.0, width=1.0),
         pb.HighpassFilter(250), pb.LowpassFilter(6500))

mix = drums + claps + low + pads + keys + leads + sfx + wet * 0.5

# A quarter beat of silence before the drop, and the tail fading out to silence as the video ends.
gate = np.ones(N)
a, b = int(SILENCE * SR), int((GROOVE - 0.004) * SR)
gate[a - int(0.02 * SR):a] = np.linspace(1, 0, int(0.02 * SR))
gate[a:b] = 0
gate[b:int(GROOVE * SR)] = np.linspace(0, 1, int(GROOVE * SR) - b)
fade_start = END - 2.5
gate *= np.clip((END - t_all) / (END - fade_start), 0, 1) ** 1.5
mix *= gate[:, None]

mix = fx(mix, pb.HighpassFilter(28), pb.PeakFilter(cutoff_frequency_hz=300, gain_db=-2.0, q=0.8),
         pb.HighShelfFilter(cutoff_frequency_hz=7000, gain_db=-2.5), pb.LowShelfFilter(cutoff_frequency_hz=100, gain_db=-3.0),
         pb.Compressor(threshold_db=-18, ratio=2, attack_ms=25, release_ms=220))

# Loudness: -15 LUFS over the score, then a limiter, and the true peak held at -1 dBTP.
meter = pyloudnorm.Meter(SR)
loud = meter.integrated_loudness(mix[:int(END * SR)])
mix *= 10 ** ((-15.0 - loud) / 20)


def limit(sig, ceiling_db=-1.3, lookahead=0.005, release=0.06):
    """A lookahead peak limiter: the gain each sample needs, held over the lookahead and released smoothly."""
    ceiling = 10 ** (ceiling_db / 20)
    need = np.minimum(1.0, ceiling / np.maximum(np.max(np.abs(sig), axis=1), 1e-9))
    size = int(lookahead * SR) * 2 + 1
    held = minimum_filter1d(need, size)
    window = np.hanning(size)
    smooth = np.convolve(held, window / window.sum(), mode='same')
    tail = int(release * SR)
    recovered = minimum_filter1d(smooth, tail * 2 + 1, origin=-tail)
    gain = np.minimum(smooth, np.convolve(recovered, np.ones(tail) / tail, mode='same'))
    return sig * np.minimum(gain, need)[:, None]


mix = limit(mix)
true_peak = np.max(np.abs(resample_poly(mix, 4, 1, axis=0)))
if true_peak > 10 ** (-1.0 / 20):
    mix *= 10 ** (-1.0 / 20) / true_peak
    true_peak = 10 ** (-1.0 / 20)

out = sys.argv[1] if len(sys.argv) > 1 else __file__.replace('\\', '/').rsplit('/', 1)[0] + '/soundtrack.wav'
pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out, f'{N / SR:.1f} s, {meter.integrated_loudness(mix[:int(END * SR)]):.1f} LUFS, true peak {20 * np.log10(true_peak):.1f} dBTP')
