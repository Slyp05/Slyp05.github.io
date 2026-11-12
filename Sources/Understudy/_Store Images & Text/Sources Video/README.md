# Sources Video

Sources for the Asset Store video, `../Video 3840x2160.mp4`: 16:9, 39 s, music and sound effects, no voiceover. Edit the sources and re-render; never edit the MP4.

## Files

```sh
python sound.py          # writes soundtrack.wav
node render.mjs          # writes ../Video 3840x2160.mp4
```

- `animatic.html`: the whole video as one paused GSAP timeline, and the preview: open it in Chrome and press Play (or Space) to watch it with `soundtrack.wav` in sync, or jump to a scene with its button. After changing `sound.py`, re-run it and reload the page; no render needed. `?t=seconds` opens it paused at a time, silent, which is how a frame render steps it.
- `sound.py`: the soundtrack, synthesized with numpy from a fixed seed. Its docstring and comments list each cue and its time.
- `render.mjs`: the export. It steps `animatic.html` frame by frame in headless Chrome at 3840x2160 and 30 fps, encodes it with ffmpeg (H.264, CRF 16), and muxes `soundtrack.wav` as mixed, with no loudness normalization. `RENDER_SECONDS=2` renders only the start, for a quick test.

## Story

The cover's stage, played out. A script reads `Time.deltaTime`, played by the real alarm clock under the spotlight; with Understudy, the real clock steps into the wings, still ticking, and the cardboard clock takes its place. The video ends on the cover's own scene.

| Time | Scene | On screen | Caption |
| --- | --- | --- | --- |
| 0 | Hook | The house curtains part on the real clock, ticking at uneven times. `Mover.cs`, its `Time.deltaTime` ringed in grey and linked to the clock. Three runs: the object stops short of its mark, on it, then past it | This script reads the real frame time. / Its test passes on one run and fails the next. |
| 10.5 | Without Understudy | The stage dims: `Mover.cs` rewritten (green and red lines), then `IClock.cs`, `UnityClock.cs` and `FakeClock.cs` added and a red cross on the script, as on screenshot 01's "Without Understudy" side | Without Understudy: rewrite the script around an interface. |
| 15.0 | Curtain | The curtains close and part on the stage as it was | |
| 16.5 | With Understudy | The stub line typed under `Mover.cs`. The real clock steps into the wings (18.5), the cardboard one takes its place with a wobble, and the ring and the link turn cardboard. Three runs, each on the mark | With Understudy, one line in the test. / The test now sets the frame time. / Same result on every run, with the script unchanged. |
| 28.5 | Leak detection | The stage dims under the Console's leak warning | Miss one, and Understudy names the line. |
| 32.4 | End | The curtains close and part on the cover's scene; the name (34.5) and the tagline, and the cardboard clock bows (36.0) | |

## Rules

- The rewrite scene is always named "Without Understudy", on screen: called "the usual fix", it read as something Understudy does.
- One story, told on the stage: a test can't control the real thing, a stand-in can, and the script stays as written. The other features belong to the gallery.
- Scenes change with the house curtains, never with title cards.
- The stage, the props and the colours are the cover's: grey and real for the code under test, cardboard for what a test declares, red for a failed run, green for a passed one.
- The real clock ticks at uneven times from start to end, in the wings too; the cardboard clock never moves its hands. The object moves in uneven steps when the real clock drives it, smoothly when the test sets the frame time.
- Code is real API: `Stub.Property(() => Time.deltaTime).Returns(0.5f);`, as in the Quick Usage Guide. The leak warning is the real message.
- Captions sit on one line and hold at least 0.3 s per word plus 1 s. Vocabulary follows `_Design/Vocabulary.md`: "the script" or "the code under test", never "your code".

## Music

A theatre pit band playing a jazz waltz, 3/4 at 120 BPM from 0 s (a bar every 1.5 s), so it sounds like no other Juste Tools video: pizzicato violins and cello, a clarinet, a bassoon, a glockenspiel and a timpani, with a cymbal for the curtains. Every scene, every run, the band's entry (19.5 s) and the end title (34.5 s) fall on a bar. Each bar is the cello's root on one and its fifth on three, the violins' seventh chord short on two and accented on the swung "and" of two, and the clarinet swings its eighths: a plain oom-pah-pah in D minor sounded sad, where the story wants a playful one.

- **The real clock** ticks as a woodblock (tick, tock) at exactly its second hand's uneven times, from the same generator and seed as `animatic.html`, never on the beat: in the centre while it plays, quieter and to the left once it is in the wings, to the very end. The cardboard clock never ticks.
- **Hook**, D minor turning to G (Dm7, G9): a timpani roll and a velvet swoosh as the curtains part, a light jazz waltz and a swung clarinet figure. Each run plays a pizzicato note per uneven step of the object; a failed run ends on a sour bassoon semitone, the passed one on a plain pizzicato note, no better than the failures.
- **Without Understudy**: a plodding bassoon line, a pencil scratch per rewritten line, a cello note per added file, a dull timpani on the red cross.
- **Curtains**: a roll up to each close, a swoosh each way, a swell into each opening.
- **With Understudy**: pizzicato on C building under the typed line with soft key presses; the real clock leaves on a falling pizzicato run; the full band comes in, in F major, as the cardboard clock arrives, with a glockenspiel trill on its wobble. Each run is a smooth rising arpeggio landing on a glockenspiel ding, the three dings rising.
- **Leak detection**: the waltz thins to D minor, a clarinet question, a knock and a ding as the warning lands.
- **End**: the whole band on F major on the title, a clarinet grace and two glockenspiel notes for the bow, then the clock's ticks alone, fading by 39 s.

Every voice is synthesized, so each one keeps its upper harmonics short: the pizzicato stops at 4 kHz, the reeds at 4.5 kHz, the glockenspiel's inharmonic partials and the woodblock's overtone stay faint, and the cymbals and noises stop at 8 kHz. Left bright, they read as harsh, the woodblock above all, since it ticks from start to end.

The master: the reverb is a send, a tilt (3 dB less mud around 250 Hz, 3 dB less of the harsh band around 3.5 kHz, 4 dB less air above 6 kHz), the low end in mono, then a slow leveler that brings each second louder than the score's median halfway back to it, by at most 5 dB. Hand-set gains alone left jumps of up to 14 dB between scenes (the failed runs, the band's entry and the title stood out, the typed line sank); the leveler keeps the swells but no scene jumps out. It never raises a quiet second: in a curtain's gap that lifted the cymbal and the swooshes above the music around them, so the quiet scenes are balanced by hand. The score is set to -16 LUFS, and a lookahead limiter keeps the true peak at -1 dBFS at most, with no saturation: at -12.8 LUFS the limiter worked on every accent and hardened them. The timpani and the cello stay light: most of the energy sits between 500 Hz and 2 kHz, so the mix never turns muffled.

## Captures

- `Captures/console-leaks.png`: the same capture as screenshot 03, the Console cropped on "Leak in EnemyTests.Spawns: Random.Range(int, int) ran for real at Enemy.cs:42. Stub it, or declare it real with Real." It shows alone: a tag naming `Enemy.cs:42` only repeated the line it pointed at.
