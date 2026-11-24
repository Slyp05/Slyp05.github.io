# Sources Video

Sources for the Asset Store video, `../Video 3840x2160.mp4`: 16:9, 47.5 s, music and sound effects, no voiceover. Edit the sources and re-render; never edit the MP4.

## Files

```sh
python sound.py          # writes soundtrack.wav
node render.mjs          # writes ../Video 3840x2160.mp4
```

- `animatic.html`: the whole video as one paused GSAP timeline, and the preview: open it in Chrome and press Play (or Space) to watch it with `soundtrack.wav` in sync, scrub, or jump to a scene with its button. After changing `sound.py`, re-run it and reload the page; no render needed. `?t=seconds` opens it paused at a time, silent, which is how a frame render steps it. It reuses the theme and parts of `../Sources Media/` (starfield, crystal ball, Inter).
- `sound.py`: the soundtrack, synthesized with numpy from a fixed seed. Its docstring and comments list each cue and its time.
- `render.mjs`: the export. It steps `animatic.html` frame by frame in headless Chrome at 3840x2160 and 30 fps, encodes it with ffmpeg (H.264, CRF 16), and muxes `soundtrack.wav` as mixed, with no loudness normalization. `RENDER_SECONDS=2` renders only the start, for a quick test. Set `CHROME` if Chrome is not at its default install path; ffmpeg must be on the PATH.

## Story

One `Enemy` script throughout. Each scene puts its code card and its Inspector side by side, centred together under a one-line caption. Every change in the Inspector gets a violet ring while it happens.

| Time | Scene | On screen | Caption |
| --- | --- | --- | --- |
| 0 | Problem | Unity's Inspector takes 500 and -3; `OnValidate` snaps them to 20 and 0 on the bar, its clamp line flashing | The Inspector accepts anything. / Your code decides what survives. |
| 7.5 | Reads all | The whole script on screen at once. A band sweeps every line top to bottom; each line it passes lights up and keeps a mark, a beam carries it into the ball, and the ball's glow grows as it fills | Scry reads all of your code. |
| 12.5 | Limits | Bound boxes land beside the clamps they come from; a drag stops at 20; Max Hp moves the Hp bound | Limits you already wrote. / Now you can see them. |
| 20 | Relevance | Range is struck while Is Ranged is off; the doc comment becomes Fire Rate's tooltip; ticking Is Ranged clears the strike | Know what matters, and why. |
| 27.5 | Attributes | `[Header]` and `[Tooltip]` are struck (the region and the doc comment already say it); a typed `[Range]` is drawn by Unity as a slider | Your comments and regions already say it. / And your own attributes still work. |
| 35 | More | A method becomes an undoable button, a property a bounded row | Methods and properties too. / And more. |
| 40 | End | The title on the bar, the tagline a bar later, the ball under them | |

## Rules

- Each change in the Inspector is ringed while it happens: the snapped values, the new bound boxes, the bound a drag stops on, Max Hp and the Hp bound it moves, the strike, each tooltip, the slider, the button and the bounded property.
- Every Inspector fact follows the design: bound boxes for a clamp (never a slider), the doc comment as the tooltip, a region as a group, a relevance strike on the label, and `[Range]` drawn by Unity. No claim that Scry reads `[Tooltip]` or turns a clamp into a slider.
- The problem scene shows Unity's own Inspector (the `#` script icon); every later scene shows Scry's (the crystal ball icon).
- A beam leaves the code card's edge and lands on the Inspector's edge, level with its line and its row. A strike covers its text only.
- Scenes fade in on their bar and out just before the next one, never a crossfade. Nothing moves that does not mean something: no camera drift.
- Captions sit on one line at the top and hold at least 0.3 s per word plus 1 s.
- The cut follows the music: 4/4 at 96 BPM, a bar every 2.5 s. Every scene starts on a bar; every beam, snap, strike and tick lands on a beat or a half-beat.

## Music

A slow, warm downtempo groove in A minor, lifting to A major on the end card, so it sounds like no other Juste Tools video (Understudy's pit band waltz, Concordance's acoustic funk, the house grooves of the earlier ones): a kalimba for the melody, a soft string pad, a round plucked bass, a soft kick and a woody knock. Nothing in the score is made of noise.

- **Problem**: the pad and a sparse kalimba line, no kit. Typing is soft keys; each snap is a low kalimba note on the chord.
- **Reads all**: the bass and a soft kick come in, and the kalimba starts its arpeggio (eighths in a 3-3-2 pattern of sixteenths).
- **Limits to More**: the full groove, with the knock on two and four. Every beam lands as a kalimba note above the arpeggio, on a tone of its bar, so the beams play the melody. Strikes are low falling kalimba notes.
- **End card**: the pad on a plain A major chord, a low A under it, and one soft bell each for the title (A) and the tagline (E), ringing out to the fade. Nothing else.

The whole score sits low and soft: the melody, the beams and the bells stay at or below A4 to A5, the kalimba is felted (a 12 ms attack, the fundamental and a quiet octave, nothing above 1.8 kHz), the bells keep only a quiet octave, and the pad stops at 3 kHz. Check a change on a spectrogram (`ffmpeg -i soundtrack.wav -lavfi showspectrumpic=s=1600x600:legend=0:stop=6000 spec.png`): it shows clean horizontal note lines, no wash of noise and no sloping lines. The master: the reverb is a send, a tilt (3 dB less mud around 250 Hz, 4 dB less around 3 kHz, where the ear is most sensitive, 6 dB less air above 5 kHz), the low end in mono, a slow leveler that brings any second louder than the median halfway back, -16 LUFS over the score, and a lookahead limiter with the true peak at -1 dBFS at most. It is darker than Understudy's and Concordance's on purpose: sine-based synthesized notes in the upper register read as aggressive at any level.

## Rejected

- The first cut: scenes of equal length on no grid, the code card and Inspector pinned to the top left and top right with the middle of the frame empty, and two-line captions at the bottom.
- Its score: pure sine bells and a harp built from many slowly falling harmonics, in constant eighth notes; a pad of three detuned voices per note, beating; most of the energy below 200 Hz, and the end card 8 dB louder than the scenes before it. It was painful to hear.
- Brushes on every eighth note, noise swells into each scene and noise in the key clicks: together a wall of hiss across every frequency from 7.5 s to 40 s, unbearable to hear. The kit is tonal now.
- A pad vibrato written as `sin(2 pi f t (1 + vib))`: its depth grows with time, so each held chord slid out of tune like a siren. The phase is now the integral of the frequency.
- Normalizing to -14 LUFS when muxing: under the -1 dB peak it compresses the mix (Concordance and Understudy found the same).
- A bright kalimba (a twelfth, the tine's 5.4x partial, a 3 ms attack) with the beams an octave above the arpeggio (up to A5), bells up to E6, and a 4 dB presence boost around 2 kHz: every high note stabbed.
- A busy end card (a kick, two bass notes, a five-note kalimba chord, three bells and a melody over the pad): a pile of sounds where the title wants one clean chord.
- Fixing the hiss and the siren with gains and EQ instead of removing their causes: the mix lost its life and the harshness stayed.
- The script scrolling under a fixed band in the reads-all scene: only part of it ever showed, so it did not read as all of it.
- A slow zoom on every scene: barely visible, and it only made the frame swim.
- An F in the E chord's arpeggio, an E against F in the F major 7 pad, and an A beam over E7: each a semitone clash.
