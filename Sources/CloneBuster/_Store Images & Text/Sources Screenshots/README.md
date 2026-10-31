# Sources Screenshots

Sources for the Asset Store screenshots (`../Screenshot 01.png` to `../Screenshot 09.png`, 1950x1300) and the documentation's images (`Assets/CloneBuster/Documentation/img/`). Each slide is an HTML page here, rendered with headless Chrome. Edit the HTML, re-render, never edit a PNG by hand.

```sh
sh render.sh                  # every NN-*.html
sh render.sh 04-answer.html   # one
python -I Demo/docs.py        # the documentation's images, from Captures/
```

Set `CHROME` if Chrome is not at its default install path. Gallery order and headlines are in [Screenshots](../Screenshots.md); the screenshots follow the video and the cover.

## Shared parts

- `frame.css`: the cover's electric blue ground and halftone, the headline, prints (ink outline, hard ink shadow), crops, callouts, text file and terminal cards.
- `slide.js`: shrinks a headline wider than its block, and draws each `.stamp` as the cover's clock stamp.

## Captures

`Captures/` holds real captures: `store-*` at 200% Editor UI scale for the slides, `doc-*` at 100% for the documentation, `reel-NNN.png` the frames of the exported GIF, `pdf-*` the pages of the exported `Proof.pdf` (`pdf-hi-*` at 1800 px wide). Files starting with `_` are contact sheets for checking, not sources.

They come from the throwaway project `D:/Unity Projects (bis)/CloneBuster - Screenshots (throwaway)`, branch `store` (branch `field-test` keeps the field test). Its Editor is driven through the `unity` CLI with the scripts in `Demo/`:

- `seed.py <project>` writes the demo game before the import; `seed.py <project> N` saves step N (1 to 9). `art.js` draws the level, the cover's platformer screen, at ten stages from greybox to final; the copy's store screenshot is the final stage itself, unchanged, as an AI rebuild of the game looks.
- The owner is Example Studio (Player Settings' Company Name), the game Jumpy. "Pixel Props Pack" is a purchased pack: its `.meta` files carry an `AssetOrigin` block. The copy's listing is `https://store.example.com/games/48213`, on the reserved `example.com` domain.
- `ev.sh` runs a C# file from `Demo/cs/` in that Editor; `shot.sh <WindowType|instanceId> <out.png>` grabs a window off-screen. `call.sh 'Drive.Select("...")'` presses the Exporter's controls through `Drive.cs`, which is installed in the throwaway's `Assets/CloneBuster/Review/Editor/` (the package's tree hides that folder).
- `cs/dates.cs` shows the demo dates, 2 March to 20 October 2026, by setting each batch's authority time and Bitcoin block in that Editor's memory only: the window, the Inspector line, the reel and `Proof.pdf` all render the same dates, and the vault's files keep their real proofs. Run it again after every domain reload (after `cs/load.cs` if the vault is not loaded yet).
- The originals of every version are in the throwaway's git history (written by `seed.py` into a scratch work tree and committed with a temporary index), so exports find them.
- `pdf2png.ps1` renders `Proof.pdf` with the Windows PDF engine.
- Slide 7's terminal shows real output: `openssl ts -verify` run on the exported batch with FreeTSA's certificates.

To capture at 2x, set the EditorPrefs key `CustomEditorUIScale` to 200, restart that Editor, and set it back to 100 afterwards. The key is per user, so every Editor started meanwhile opens at 200%. The docked Inspector is too narrow at 2x: `cs/inspector_float.cs` opens a floating one at a set size.

## Decisions

- Dates come from the Editor, set in memory, rather than drawn over the captures: every surface then shows the same dates in Unity's own text rendering, with nothing to align by hand. Lost: overlays in the slide sources, which would have to match the Editor's font, size and background on every capture.
