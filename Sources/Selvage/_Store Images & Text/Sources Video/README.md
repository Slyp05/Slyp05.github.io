# Sources Video

Sources for the Asset Store video, `../Video 3840x2160.mp4`: 16:9 for YouTube, about 54 s, music and sound effects, no voiceover. Edit the sources and re-render; never edit the MP4.

```sh
python sound.py          # writes soundtrack.wav
node render.mjs          # renders every frame in headless Chrome at 3840x2160, encodes, muxes the soundtrack at -14 LUFS
RENDER_SECONDS=3 node render.mjs test.mp4   # quick test of the start
```

Set `CHROME` if Chrome is not at its default install path. ffmpeg must be on the PATH.

## Files

- `animatic.html`: the whole video as one paused GSAP timeline, and the preview: open it in Chrome and press Play (or Space) to watch it with `soundtrack.wav` in sync, or jump to a section with its button. After changing `sound.py`, re-run it and reload the page; no render needed. `?t=seconds` opens it paused at a time, silent, which is how `render.mjs` steps it.
- `sound.py`: the soundtrack, synthesized with numpy from a fixed seed: a score at 100 BPM (beat grid from 0 s) and every sound effect at its frame. Its comments list each cue and its time.
- `render.mjs`: drives Chrome over the DevTools protocol (no packages needed, Node 18+), pipes PNG frames into ffmpeg.
- `Captures/`: real Editor and game grabs at 200% UI scale.

## Story

Three ways to give a script what it needs, each behind a title card, then the features and the end card:

| Time | Section | What happens |
| --- | --- | --- |
| 0 | Hook | "A typical Unity script.", its lookups struck out and folded away: "With Selvage, nothing to wire." |
| 6.6 | 1 Plain Unity | `[SerializeField]` plus lookups in `Awake`; Play, then `UnassignedReferenceException` |
| 14.2 | 2 With Zenject or VContainer | `[Inject]` fields plus a Zenject installer and a VContainer `LifetimeScope`; Play, then "IScoreBoard is not bound" |
| 23.4 | 3 With Selvage | `[Inject]` on the class; threads to a scene object, an asset folder and a `[Provide]` class; the missing one "caught while editing" in gold, never red |
| 33.6 | Features | Visual Studio colours over real captures: no attribute needed, async loading, Edit mode injection, then "And much more" |
| 48.2 | End | The hem sews in under the title, subtitle and tagline |

Rules the cut follows: no "May be supplied" (yellow) anywhere; `null` appears only after Play, never in the Selvage section; each section starts on its own state under its title card, never morphing out of the previous one; clips never crossfade into each other; captions hold at least 0.3 s per word plus 1 s.

## Captures

From the throwaway project `D:/Unity Projects (bis)/Selvage - Screenshots (throwaway)` (see `_DevTools/Screenshots Project/`), with `Assets/Selvage` mirrored from this repo first:

- `clip1_inspector_*`: `Assets/Store/Cannon` with Inject by Default on, before and after adding `AudioClip fireSound;` (without `body`, which reads May Be Supplied in Edit mode).
- `clip2_game_*`: the demo's HUD with `save` marked `Async` only, in paused Play stepped at 30 fps, at frame 3 ("Best ...") and after the cloud load; the copy's `CloudSave` started 9 points above the device save. Game view at a custom 3200x1800 size in a 1600-point floating view (`capture_game_view` caps at 1280x720).
- `clip4_inspector_*`: `Assets/Store/Level Preview` without, then with, its `[ExecuteAlways]` component in Edit mode.

Every change to the throwaway project is reverted after capturing, and the custom Game view sizes removed (they are a global Editor preference).
