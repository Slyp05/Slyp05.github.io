# Sources Video

Sources for the Asset Store video, `../Video 3840x2160.mp4`: 16:9, 36 s, music and sound effects, no voiceover. Edit the sources and re-render; never edit the MP4.

```sh
python sound.py          # writes soundtrack.wav
node render.mjs          # renders every frame in headless Chrome at 3840x2160, encodes, muxes the soundtrack at -14 LUFS
RENDER_SECONDS=3 node render.mjs test.mp4   # quick test of the start
```

Set `CHROME` if Chrome is not at its default install path. ffmpeg must be on the PATH.

## Files

- `animatic.html`: the whole video as one paused GSAP timeline, and the preview: open it in Chrome and press Play (or Space) to watch it with `soundtrack.wav` in sync, or jump to a section with its button. `?t=seconds` opens it paused at a time, silent, which is how `render.mjs` steps it. The look is the screenshots' (cream paper, the three inks, code cards, the value in ink).
- `sound.py`: the soundtrack, synthesized with numpy from a fixed seed. Its comments list each cue and its time.
- `render.mjs`: drives Chrome over the DevTools protocol (no packages needed, Node 18+), pipes PNG frames into ffmpeg.

## Story

One drawn stretch of two gravity zones, Flip (`× -1`) and Heavy (`= 2`), crossed twice: once without Concordance, the value made visible beside it, and once with it, landing on the flag with a bounce. With Concordance, the window first catches the conflict (what no wrapper type does), then one line per write fixes it. The character carries an arrow along its gravity, turned up when it is negative and twice as long at 2, so the value reads on the character too.

| Time | Section | On screen | Caption |
| --- | --- | --- | --- |
| 0 | Without Concordance | Title card, the words alone, 1.5 s | |
| 1.5 | Plain run | The level beside `body.gravityScale`: each zone's line lands as the character crosses its edge and replaces the value. Leaving Heavy writes 1 while Flip still applies: Flip flashes, the value shakes, and the character ends upside down past the flag | Two gravity zones. Each undoes its own change. / Leaving one zone wiped out the other. |
| 10 | With Concordance | Title card, 1.5 s: the words alone, like "Without Concordance" | |
| 12 | Conflict | The Concordance window flags the two scripts overwriting each other, each with its line | See which scripts overwrite each other. |
| 16 | One line | `FlipZone.cs` and `HeavyZone.cs`, two lines each: `(Modifier)` slides into each entry line, each exit's undo is struck out and becomes `Modifier.Stop` | No wrapper type. Keep your line, make it a Modifier. |
| 22 | Concordance run | The same stretch: the Modifiers stack between "before any change" and the value, and leave one by one; the character lands on the flag | Now Modifiers stack on the value. / Each zone removes only its own. |
| 30 | End | The three rings come together, then the name and the tagline | |

## Rules

- One idea: scripts overwrite each other on a value you can't see; Concordance makes the changes combine, and shows them. The other features belong to the gallery.
- Never frame it as "several scripts can share a value": any project can, with a wrapper type and boilerplate. The value is one Unity owns (`Rigidbody2D.gravityScale`), which no wrapper can cover, and the code is the user's own line, kept.
- The level is drawn, not filmed: a schematic reads at a glance and owes nothing to the demo's code. It takes the demo's look (zones in their inks, a disc, a flag) and numbers (1, -1, 2).
- The value is drawn as on screenshot 07: what it was before any change, each change in its zone's ink, the value in ink. Multiply is blue, set is crimson, as in the demo.
- The two code cards hold an entry and an exit line each, so the change reads in one glance, and nothing else: no phase attribute, even where a real project would set one.
- Captions sit on one line, hold at least 0.3 s per word plus 1 s, and use the store text's words (change, before any change), and `Modifier` once the code cards have shown it.
- Every section starts on a bar of the music (120 BPM, a bar every 2 s), every zone entry and exit on a beat or a half-beat.

## Music

The gravity scale has a sound: 1 is D, home; -1 is the A below; 2 is F#. The zones' notes are soft keys with no metallic overtone, so the run can be replayed without tiring the ear; the groove keeps its punch. Notes play only while the character runs, one per zone edge, on the beat it crosses it: the note of the value that edge sets.

- **Without Concordance**, each note is short and cuts the last, over a soft D minor and one slow kick a bar. The run ends on the A of the wrong value, left hanging.
- **With Concordance** starts a groove on its card and keeps it under the window and the code cards to the end card: four on the floor, claps, open hats on the offbeats, an octave bass in eighths, offbeat chord stabs.
- **The Concordance run**: each zone's note holds while its Modifier applies, so Flip and Heavy stack into a chord and leave it note by note; leaving the last zone lands home on D with the full chord. The groove keeps a chord a bar (D, B minor, G, D) under it.
- **End card**: a bell per ring, then the chord.

## Captures

`captures/window-conflict.png`, taken as `_DevTools/Captures/README.md` describes: the Concordance window on a Rigidbody2D's `gravityScale` in Play at 200%, written with plain writes by `FlipZone` and `HeavyZone` in the plain run's order, cropped to the member's Writes and Values: both scripts' lines, and the conflict naming each one's line. Rings in each script's light ink then the warning's ochre come in one after the other, so the eye follows FlipZone's writes, HeavyZone's, then the conflict.

## Rejected

- A tour of features, each behind its own title card: the gallery already covers the features, and that structure is not built from this package's story.
- A number in the middle that lines of code take turns overwriting, with no level: nothing on screen shows what the wrong value does.
- Demo footage for the level: the drawing reads better, and the video need not match the demo.
- Keeping the demo's own `player.Gravity`: a property of the demo's own, so it reads as something a wrapper type does for free.
- `Physics2D.gravity`: a vector, so the value and the set zone read as (0, -9.81) instead of one number.
- Switching the demo itself to `gravityScale` so the video and the demo match: the video only has to look like the demo.
- A montage of other values (`movement.enabled`, `cam.fieldOfView`, `AudioListener.volume`): it repeats the run's idea without adding one.
- Rings drifting apart on the "Without Concordance" card: it read as broken, not as a statement; the words alone are cleaner.
- D, B minor, D, G under the Concordance run, so the landing D falls in a D bar: it sounded worse than ending the run's bars on G then D.
- The rings coming together on the "With Concordance" card: the logo built twice, there and on the end card; it builds once, at the end.
- The Concordance window after the Concordance run, as a recap: it came after the story was over, and what it does best (finding the conflict) belongs before the fix.
- One bar of the theme before the hook's run, the character waiting: it sounded like the start stuttering, and the melody belongs to the run.
- The drawing of the value growing into the Concordance window: the panel scaling and fading while the window appeared read as a glitch, not a transition.
- The hook played backwards and five times faster under the "Without Concordance" card, and a detuned double note for the wrong value: painful to hear.
- A hook before "Without Concordance" with the same run and no value shown: it told the same thing twice.
- The Concordance window before "With Concordance": the window is Concordance, so it belongs to the "with" side.
- The whole Concordance window in the conflict section: at video size its text read too small; the member's details carry the conflict.
- A four-bar theme broken by the zones and played right with Concordance: too long to rewatch, and its opening notes repeated at the start of every run. One note per zone edge says the same in less.
- Softening the whole mix (round stabs, dark quiet drums, top rolled off): it killed the groove. Only the zones' notes needed softening.
- Sound as the core idea, each change a note and the bug a dissonance: it guides the music instead, under a story told by the picture.
- Notes and effects scattered on the events (a drone, one note per zone, knocks): no melody to follow, so nothing is heard going from wrong to right.
