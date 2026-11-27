# Sources Video

Sources for the Asset Store video, `../Video 3840x2160.mp4`: 16:9, 50 s, music and sound effects, no voiceover. Edit the sources and re-render; never edit the MP4.

## Files

```sh
pip install numpy scipy pedalboard pyloudnorm   # once
python sound.py          # writes soundtrack.wav
node render.mjs          # writes ../Video 3840x2160.mp4
```

- `animatic.html`: the whole video as one paused GSAP timeline, and the preview: open it in Chrome and press Play (or Space) to watch it with `soundtrack.wav` in sync, scrub, or jump to a scene with its button. After changing `sound.py`, re-run it and reload the page; no render needed. `?t=seconds` opens it paused at a time, silent, which is how a frame render steps it. It reuses the theme and parts of `../Sources Media/` (starfield, crystal ball, Inter).
- `sound.py`: the soundtrack, synthesized from a fixed seed with numpy, filtered and mixed with scipy and pedalboard, measured with pyloudnorm. Its docstring lists each cue; its time constants are the animatic's.
- `render.mjs`: the export. It steps `animatic.html` frame by frame in headless Chrome at 3840x2160 and 30 fps, encodes it with ffmpeg (H.264, CRF 16), and muxes `soundtrack.wav` as mixed. `RENDER_SECONDS=2` renders only the start, for a quick test. Set `CHROME` if Chrome is not at its default install path; ffmpeg must be on the PATH.

## Story

The why, then the how, then what it gives you: one `Enemy` script and one Inspector on a single stage the whole way, so the video reads as one transformation, not a list of features.

| Time | Bar | On screen | Caption |
| --- | --- | --- | --- |
| 0 | 0 | The plain script. On each beat of bar 1 a line lights and a pill names the rule it holds: a limit, a unit, a condition, a description | Your code already knows the rules. |
| 4 | 2 | Unity's Inspector slides in, takes 500 for Speed (red ring), and the members it never shows get a red "not shown" pill | Unity's Inspector doesn't. |
| 6 | 3 | Six attributes stamp onto their lines on sixteenths, the stage jolting under each, then a quarter beat of silence as the stage draws back | So you write them all again. |
| 8 | 4 | The drop: a flash, the attributes scatter, Unity's rows go, Scry's tools appear in the header, a band reads the script while the analysis bar fills and the orb pulses | Scry reads the code instead. |
| 10 | 5 | Each member's line flies across and lands as its row, twelve rows on steady eighths; Target Tag lands red, and the header's orb turns red with a 1 | Every field, property and method. |
| 13 | 6 | Each beam lands on one climbing note: the clamp becomes bounds (500 snaps to 20), the movement gives `/s`, the if strikes Range and Target Tag, the comment becomes the tooltip, `timer += Time.deltaTime` gives Timer its `s`; ticking Is Ranged lifts the strikes | With the rules you already wrote. |
| 16 | 8 | The header's badge and the red field ringed; Target Tag's red Scry button opens its panel: "`Enemy` is not a tag: the code passes it to Component.CompareTag." with Add Tag `Enemy`; the fix clears the red and the badge | Mistakes caught before you press Play. / And fixed right there. |
| 20 | 10 | Play mode (the blue Play button only): Timer runs, Speed is dragged inside its label down and back up into its bound | Live, in Play mode. |
| 24 | 12 | Amount typed to 10; resting on Take Damage previews its run until the click: Amount, which it reads, in teal, Health, which it writes, showing 90 in magenta | See what a click does before it runs. |
| 26 | 13 | The click lands on the bar and the previewed 90 becomes real; a second press (80), then Ctrl+Z twice, half a beat apart, puts Health back | Every click undoable. |
| 28.4 | 14 | Respawn () … opens its dialog, held a full beat; Run, and its button fills for a second while it runs | Or asked first. |
| 32 | 16 | The search button opens a field over the title; "ran" folds every row away but Is Ranged and Range, their matching letters highlighted, then the search clears | Find any member as you type. |
| 36 | 18 | Speed's Scry button shows under the pointer, its panel opens (declaration, Style, Visibility), Style goes from Scry to Unity: Unity draws the field, with the user's own drawers, and the panel's Style line turns bold, answered | Change any choice in one click. |
| 40 | 20 | The `[SerializeReference]` Weapon folds open to a build: Type already on Bow, `new(int arrows)` offered with its parameter, 12 typed, Create, all within the first bar and a half; then Weapon holds `(arrows: 12)` with its trash button, Arrows under it, for two seconds | Even values Unity can't build. / Built with your constructor. |
| 44 | 22 | The stage leaves on a flash: the title, the tagline half a bar later, the ball holding an Inspector, then "Nothing to write. Everything editable.", held three bars | |

## Rules

- The Inspector follows the captures in `../Sources Screenshots/Captures/`: Unity's `#` script header, Scry's search and orb icons in the header toolbar (only the orb on a type with its own editor), bounds as `0 ≤` and `≤ 20` boxes (never a slider), a unit as a muted suffix, relevance as a strike on the label, a read-only value dimmed, a method as a button in the label column whose name lines up with the labels.
- A method's button ends with `…` only when it asks first: Take Damage changes its own object and is undoable (the undo icon); Respawn is an async method, which asks first (the clock icon).
- A private field Unity does not save is read-only by default, dimmed: Health and Timer. An answered line's label is bold. A saved value carries Unity's grey bar on its left edge.
- Rows inside a region group sit on the label column like any other; only members folded open from a value are indented. Foldout arrows sit left of the labels, in line with the header's.
- The Inspector is checked against the real one on the same script: `Assets/Store Captures/Runtime/Video/Enemy.cs` holds it line for line, and `VideoCapture` (in the Store Captures editor assembly) clicks its controls and grabs the capture Inspector's own pixels, even when another window covers it. A getter's value sits in a light-bordered result box with a normal label; a read-only value is borderless and dimmed; a fold's summary is lighter and grey, with the trash button once built; a region ends on a separator; a blank line between members leaves a gap; a build's Type starts on the first type; a float prints as Unity prints it (`5.383333`).
- A preview marks what the run reads in teal and what it writes in magenta, showing the value the run would leave.
- A row's Scry panel tints its row and continues it as one violet box, edge included, from where the labels start to the Scry button.
- Every claim is the design's: a clamp gives bounds, use gives the unit (`speed * Time.deltaTime` is `/s`, `timer += Time.deltaTime` is `s`), an if gives relevance, a doc comment the tooltip, a region a group. No claim that Scry reads `[Tooltip]` or other attributes.
- Motion follows the music: every caption word, stamp, row, beam, press and undo lands on a beat or a sixteenth of the 120 BPM grid. The background breathes on each kick and the stage pushes on each bar from the drop. Nothing drifts.
- Captions are one line at the top, popping in word by word; the key words are violet. A caption leaves at least 0.3 s before the next arrives.
- The cursor moves only toward what it clicks, drags or rests on next; between actions it stays still.
- Each change in the Inspector is ringed while it happens, violet for Scry and red for what Unity gets wrong.
- A class name shared with `../Sources Media/theme.css` (`.title`, `.chip`, `.body` at the top level) takes its rules: elements here use their own names.

## Music

An original score, not shared with any other Juste Tools video: 120 BPM, D minor, resolving to D major on the end card. Selvage's groove (100 BPM, a marimba arpeggio in eighths, kick on 1 and 3, snaps on 2 and 4) is what the previous cut of this video reused; this one shares none of it.

- **Problem**: a lowpassed pad (Dm9, Bbmaj7, A7sus, A7), a heartbeat kick, a pluck per rule rising A4 C5 D5 E5, key clicks and a dull semitone bonk for the 500, tuned stamps rising D to D an octave up over a riser, and a quarter beat of silence.
- **Mistake (bars 8 and 9)**: a Gm9 then A7 interlude under the error, its panel opening on a low pair, Add Tag resolving upward into the Dm of Play mode.
- **Drop to the build**: Dm9 Bbmaj7 Fadd9 C6 twice, then Dm9 Bbmaj7 Fadd9 Gm9 A7sus A7. A kick on 1, 2-and and 3-and, a clap on 2 and 4, swung sixteenth hats, a syncopated bass, a sixteenth-note pluck, and a pad and pluck ducked under the kick. The rows play a run D4 to A5 and back to F5, one note per eighth, the groove unchanged under them; the facts land as stabs, the snap to 20 as a low thunk. A soft lead hook plays through Play mode and the undos, gets an answer under the search and the answers: the same chords, a new line (A C D F E, D F C D, F G A G F C, E G E C D), softer. Each showcase section opens on a short fill and a small rise, and each click plays a note a step higher than the last; the build adds an octave pluck and open hats, and Create lands on a stab with a kick. Each undo is a reversed pluck swell into a tick; the dialog pops, Run clicks, and soft ticks run while the method does.
- **End card**: a soft impact, a D major 9 pad over a low D, a soft bell on D5 for the title and on A5 for the tagline, fading to silence at 50 s.

No voicing holds a semitone, the melody stays at or below A5, the pluck closes its upper harmonics within a few hundred milliseconds, and the lead is a soft square (odd harmonics falling as 1/k², nothing above 3.5 kHz). The master: a reverb send, a dip around 300 Hz, a gentle high shelf, a low shelf 3 dB down at 100 Hz, light glue compression, -15 LUFS over the score, then a lookahead limiter at -1.3 dBFS with the true peak checked at 4x oversampling. Check a change by its numbers (`sound.py` prints the loudness and true peak) and on a spectrogram (`ffmpeg -i soundtrack.wav -lavfi showspectrumpic=s=1600x500:legend=0:stop=8000 spec.png`): note lines and drum hits, no wash of noise.

## Rejected

- The previous cut (50 s): a hook about attributes, then one scene per feature (tooltips, limits, relevance, hidden fields, properties, methods, async, events), each with its own caption. A feature catalogue: it never said why Scry exists or how it works, and at 96 BPM with slow fades it had no energy.
- Its score: Selvage's instruments, arpeggio and drum pattern under new chords, peak-normalized with no loudness target or limiter. It sounded like Selvage and sat at an arbitrary level.
- pedalboard's `Limiter`: it adds makeup gain equal to its threshold, which pushed the mix 3 dB over target and squashed it. `sound.py` has its own lookahead limiter.
- A low end 12 dB above the mids (the first mix of this score): boomy, and the melody vanished on laptop speakers. The kick, bass and low shelf were brought down to about 7 dB.
- The orb as the Inspector header icon: the product keeps Unity's `#` and adds its icons to the header toolbar.
- A bright lead (odd harmonics at 1/k up to 5 kHz, at the level of the plucks) and full-strength FM bells on the end card: both stood out over the mix.
- `…` on Take Damage: it marks a method that asks first, and an undoable one never does.
- "No custom editors." under the tagline: it contradicts the beat right before it, where your own editors keep working.
- Rows speeding up into sixteenths with a stab and an extra kick on the last one: it broke the pulse at 11 s.
- A play-mode tint and blue edge on the Inspector: too much, and the Speed row drew above it untinted. Unity's blue Play button says it.
- A coroutine beside the async method: one method that asks first is enough.
- The custom-editor beat ("Your own editors and drawers still win."): it undersold the answers, which change any choice, Unity style (the user's drawers) included.
- A tooltip still showing when the cursor ticks the toggle under it: it read as clicking the tooltip.
- The hook repeated note for note from 24 s: an answer over the same chords keeps the song without the loop.
- Beams with different sounds (a low thunk on the snap, a falling pair on the strike, a pluck on the tick): only some beams sounded like beams. Every beam is one climbing pluck now; the snap and the tick only click.
- Both style buttons lit when the panel opens, and Speed's label turning bold: classes are set from the time in `paint()`, and only the answer's own line in the panel turns bold.
- "Select Type" before the build: the real Type picker starts on the first type.
- A ring on every step of the build (Type, Constructor, Arrows, the result): the build rings its constructor and its result only.
- Captions popping in word by word, on the same beat as the action they name, over a code card as bright as the Inspector: the eye could not follow both. A caption arrives whole, half a beat before its action.
- Dimming the code card from the mistake on: it stayed dim for most of the video. The code stays bright.
- Two captions in a row for one beat ("Mistakes caught before Play." then "Fixed right there.", and the like): one sentence per beat, twelve captions in all.
- The cursor stepping aside after a click (after Add Tag, the search, Create): the eye follows the cursor, so it moves only to what it acts on next.
- Rings on what is already marked (the previewed Health, Speed's value under its new bounds): one highlight per change.
- A preview that ended before the click, and an undo a quarter beat after the last press: no time to read either.
- A build crowded into its last second: the steps come early now, and the result holds.
- Timer printed as Unity prints floats (`5.383333`): unreadable at a glance; two decimals.
- A half-black dim over the quarter beat of silence before the drop: it read as a glitch. The silence and the stage drawing back carry it.
- A tag passed to CompareTag as a string literal: the analysis checks values, not literals, so it showed no error; the tag is a field, as in real code.
- A dialog close button without its cross, set apart from the corner: Windows draws it flush in the title bar's corner, red with a white cross.
- One flat pluck for every click once the hook rested: the showcase lost its energy halfway.
- A drag that left the label it starts on, and a "Units per second." tooltip once the unit shows in the field: the unit already says it.
- The cuts and rejections of the first animatic, still standing: scenes of equal length on no grid, the code card and Inspector pinned to the corners, two-line captions at the bottom, a slow zoom on every scene, a script scrolling under a fixed band, pure sine bells and noise washes in the score, a vibrato written as `sin(2 pi f t (1 + vib))` (its phase must integrate the frequency).
