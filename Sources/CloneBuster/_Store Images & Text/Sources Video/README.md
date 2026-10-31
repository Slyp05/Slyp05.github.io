# Sources Video

Sources for the Asset Store video, `../Video 3840x2160.mp4`: 16:9, 34 s, music and sound effects, no voiceover. Story and rules are in [Video](../Video.md). Edit the sources and re-render; never edit the MP4.

```sh
python sound.py          # writes soundtrack.wav
node render.mjs          # renders every frame in headless Chrome at 3840x2160, encodes, muxes the soundtrack at -14 LUFS
RENDER_SECONDS=3 node render.mjs test.mp4   # quick test of the start
```

Set `CHROME` if Chrome is not at its default install path. ffmpeg must be on the PATH.

## Files

- `animatic.html`: the whole video as one paused GSAP timeline, and the preview: open it in Chrome and press Play (or Space) to watch it with `soundtrack.wav` in sync, or jump to a section with its button. `?t=seconds` opens it paused at a time, silent, which is how `render.mjs` steps it. The look is the screenshots' (electric blue ground, halftone, prints with an ink outline and a hard ink shadow, the yellow clock stamp).
- `sound.py`: the soundtrack, synthesized with numpy from a fixed seed: a score at 120 BPM (a bar every 2 s from 0 s) and every sound effect at its frame. Each beat of the story starts on a bar; every saved version, reel frame and click lands on a half-beat.
- `render.mjs`: drives Chrome over the DevTools protocol (no packages needed, Node 18+), pipes PNG frames into ffmpeg.
- `Captures/`: the demo's art and real captures, from the throwaway project of [Sources Screenshots](../Sources%20Screenshots/README.md), with the same demo dates.

## Captures

- `level-0.svg` to `level-9.svg`: Level 1 from greybox to final; the copy is `level-9.svg` itself. Cut from the pages `Demo/art.js` writes, so they stay sharp at 4K.
- `store-timeline.png`: the screenshots' Exporter capture of Level 1's 10 versions; the video cuts its VERSIONS header and rows from it.
- `proof-3-options.png`, `proof-4-result.png`: the Exporter at 200%, 880x520 points: the proof's options with the copy filled in (its screenshot is the final level art, its listing a reserved `example.com` URL), then the result. `pdf-1.png` is the `Proof.pdf` of that export.
- `reel-000.png` to `reel-009.png`: the version frames of the exported reel of Level 1 (1080x888). The reel's last two frames, the copy beside the original and its end card, are left out: the copy has its own beat, and the video has its own end card.
