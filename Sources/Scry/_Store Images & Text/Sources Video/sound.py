"""Scry trailer score, 28 seconds. Run with Python and NumPy."""
from pathlib import Path
import wave

import numpy as np

RATE = 48_000
DURATION = 28
mix = np.zeros((RATE * DURATION, 2), dtype=np.float64)


def put(at, signal, level, pan=0):
    start = round(at * RATE)
    count = min(len(signal), len(mix) - start)
    gains = np.sqrt((1 + np.array([-pan, pan])) / 2)
    mix[start:start + count] += signal[:count, None] * (level * gains)


def glass(at, pitch, level, pan=0, length=2.4):
    """Damped glass partials, with a soft onset and quiet reflected notes."""
    t = np.arange(round(RATE * length)) / RATE
    phase = 2 * np.pi * 440 * 2 ** ((pitch - 69) / 12) * t
    signal = (
        np.sin(phase) * np.exp(-2.15 * t)
        + .19 * np.sin(2.01 * phase) * np.exp(-4.7 * t)
        + .045 * np.sin(2.74 * phase) * np.exp(-8 * t)
    )
    signal *= np.minimum(1, t / .032) ** 2
    signal *= np.clip((length - t) / .18, 0, 1)
    put(at, signal, level, pan)
    put(at + .167, signal, .23 * level, -.65)
    put(at + .283, signal, .14 * level, .65)


def bowed(at, notes, length, level):
    """Slow glass harmonics with an independent swell in each voice."""
    t = np.arange(round(RATE * length)) / RATE
    envelope = np.sin(np.pi * t / length) ** 1.45
    for index, pitch in enumerate(notes):
        phase = 2 * np.pi * 440 * 2 ** ((pitch - 69) / 12) * t
        signal = np.sin(phase) + .09 * np.sin(2 * phase + .75 * np.sin(2 * np.pi * .41 * t))
        put(at, signal * envelope, level, (index - (len(notes) - 1) / 2) * .31)


def tap(at, pitch, level):
    t = np.arange(RATE // 7) / RATE
    phase = 2 * np.pi * pitch * t
    signal = (np.sin(phase) + .2 * np.sin(2.62 * phase)) * np.exp(-39 * t)
    put(at, signal * np.minimum(1, t / .006), level)


# D, A, E is Scry's open-fifth signature. Leave air between notes.
for at, pitch, level, pan in [
    (.15, 50, .24, -.28), (1.05, 57, .18, .24), (2.25, 64, .15, .08),
    (4, 50, .29, -.29), (5, 57, .24, -.42), (5.5, 64, .31, .37),
    (7.25, 57, .19, -.25), (9, 62, .28, .34), (10.5, 64, .15, .15),
    (12, 48, .26, -.32), (13.5, 57, .20, -.33), (14, 65, .27, .32),
    (15.5, 60, .17, -.17), (17, 62, .31, .29), (18.5, 57, .18, -.24),
    (20, 50, .32, .06), (22, 50, .34, -.27), (22.5, 57, .28, .19),
    (23.25, 64, .32, .29), (24.5, 66, .17, -.12),
]:
    glass(at, pitch, level, pan)

bowed(0, [38, 50, 57], 4.7, .09)
bowed(3.3, [38, 53, 57, 64], 7.6, .11)
bowed(10, [36, 48, 55, 57], 5.9, .09)
bowed(15.3, [43, 50, 57, 59], 6.9, .10)
bowed(21.2, [38, 50, 57, 66], 6.8, .13)

# The tactile sounds mark the number reaching its ceiling, the click, and Undo.
for at, pitch, level in [(8, 210, .08), (9, 178, .19), (17, 295, .20), (20, 190, .21)]:
    tap(at, pitch, level)

mix *= np.minimum(1, np.arange(len(mix))[:, None] / (RATE * .015))
mix *= np.minimum(1, np.arange(len(mix), 0, -1)[:, None] / (RATE * .8))
rms = np.sqrt(np.mean(mix ** 2))
mix *= min(10 ** (-19 / 20) / rms, .85 / np.max(np.abs(mix)))
pcm = np.rint(mix * 32767).astype('<i2')
with wave.open(str(Path(__file__).with_name('soundtrack.wav')), 'wb') as output:
    output.setparams((2, 2, RATE, 0, 'NONE', 'not compressed'))
    output.writeframes(pcm.tobytes())
