# Sources Media

Sources for the Asset Store media. Every marketing image is an HTML/SVG page here, rendered to PNG with headless Chrome. Edit the HTML or SVG, re-render, never edit a PNG by hand.

| Output (one level up) | Source | Render (Git Bash, from this folder) |
| --- | --- | --- |
| `Cover 1950x1300.png` | `cover.html` | `sh render.sh` |
| `Card 420x280.png` | `card.html` | `sh render.sh card.html "../Card 420x280.png" 420 280` |
| `Social 1200x630.png` | `social.html` | `sh render.sh social.html "../Social 1200x630.png" 1200 630` |
| `Icon 160x160.png` | `icon.html` | `sh render.sh icon.html "../Icon 160x160.png" 160 160` |

`illustration.svg` is the whole stage at cover size, with no text. The cover places it at full size and adds the title over the back wall; the social image shows it through a viewBox cropped to the props (`63 340 1824 958`).

The card and the icon draw their own reduced versions on a canvas twice the output size (an SVG viewBox), because a scaled-down stage is illegible at their size. Check the icon at 80x80, the size the store shows it.

Set `CHROME` if Chrome is not at its default install path. The title font is Bahnschrift, which ships with Windows 10 and later.

## Asset Store key image rules

From Unity's [What makes a great key image](https://support.unity.com/hc/en-us/articles/210122403-What-makes-a-great-key-image-and-are-there-any-size-restrictions-), checked 2026-11-01:

| Image | Size | Allowed text |
| --- | --- | --- |
| Icon | 160x160 (shown at 80x80) | None |
| Card | 420x280 | Asset title, publisher name or logo |
| Cover | 1950x1300 | Asset title, publisher name or logo, a tagline |
| Social media | 1200x630 | None. An asset with text on its marketing image may be left out of Unity's paid social promotions. |

All images:

- No Unity logo, no sale banners, no watermark, no default Unity skybox.
- Not only a screenshot of the Unity Editor.
- Not blurry, stretched or cropped.
- Each size gets its own design so it stays legible; never scale the cover down to make the card.
- Keep text minimal: it collides with store sale overlays and does not localize.

## Visual language

- Cardboard stand-ins. An understudy takes an actor's place without the play being rewritten; a fake takes a member's place without the code being rearchitected. The images show a small stage: the real game props (an alarm clock for `Time`, a film camera for `Camera.main`) set aside in the wings, the clock still ticking and the camera recording the stage, while flat cardboard cutouts of them, propped on wooden braces, play their parts under the spotlight, the clock's hands and the camera's lens and reels painted on. Everyone reads a cardboard cutout as a fake stand-in, with no text.
- Stage: back wall `#15171c` to `#1f2128`, red velvet curtains at both sides (folds `#4e0d14`, `#9c1f2b`, `#b8303b`, darker towards the outside), wooden floor `#5a3d27` to `#7a5434` with boards `#3e2a1a` converging to the back, front edge `#1a120c` with a `#94673e` lip.
- Spotlight: a warm beam (`#fff3d6`, opacity 0.02 to 0.16) and a floor pool (`#ffe9bf`, 0.55 at the centre).
- Real props: flat vector, darkened by a component-transfer filter (slope 0.55) so they sit in shadow without turning see-through. Motion strokes (`#e8e2d4`) show the clock ticking; the camera's red recording light (`#ff5a5a`) is drawn outside the filter so it still reads as on.
- Cutouts: cardboard `#d9b47c` to `#c49a5f`, painted faces `#efe6d2` with marker strokes `#2b2420`, a corrugated cut edge (pattern `flute`) offset behind each towards the lower right, and a brace `#8a6b47` behind. The camera cutout keeps one strip of tape; the clock's was dropped, since at card and icon size it read as a stick.
- Text: title `#f2f0ea`, tagline `#a3a8b2`, in Bahnschrift: bold condensed title, regular semi-condensed tagline.
- Card: the curtains, the title, the real clock ticking in the shadow, and the cardboard clock under the light.
- Social: the stage cropped to the props, no text.
- Icon: the cardboard clock alone. Checked at 80x80.
- Rejected:
  - A stage plot seen from above (black floor, tape spike marks joined like a call graph, the understudy as dashed glowing shoe soles): spike marks mean nothing outside theatre crews, and the image read as random symbols.
  - An abstract code panel (syntax-coloured bars, one call lifted out, a dashed stand-in in its slot): cryptic without readable code, and readable code is text, which the key images must not carry.
  - A die for `Random`: its link to code was not obvious, unlike a clock for time and a camera for the scene camera.
  - Sandbags at the foot of the braces, as grey blocks and then as tied bags: neither looked good, and the brace alone says "propped up".
  - A scalloped valance across the top: the maintainer disliked curtains above the stage.
  - Black side wings: a stage read faster with red curtains, and black panels looked like empty borders.
  - A green check flown in on a line to say the test passed: it read as a UI element dropped into a stage scene, and its meaning was unclear.
  - Top-down figures (head and shoulders), which read as eggs. A spotlight with curtains and code pills, and a prompt book with a struck line (paper, too close to Concurrent Value's sheet music).

## Wording

- Tagline: "Stop rearchitecting your game to test it.", the story in `_Design/README.md`.
