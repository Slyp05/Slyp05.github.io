# Sources Media

Sources for the Asset Store media. Every marketing image is an HTML/SVG page here, rendered to PNG with headless Chrome. Edit the HTML, re-render, never edit a PNG by hand.

| Output (one level up) | Source | Render (Git Bash, from this folder) |
| --- | --- | --- |
| `Cover 1950x1300.png` | `cover.html` | `sh render.sh` |
| `Card 420x280.png` | `card.html` | `sh render.sh card.html "../Card 420x280.png" 420 280` |
| `Social 1200x630.png` | `social.html` | `sh render.sh social.html "../Social 1200x630.png" 1200 630` |
| `Icon 160x160.png` | `icon.html` | `sh render.sh icon.html "../Icon 160x160.png" 160 160` |

Shared parts, in `theme.css` and `parts.js`, so every image draws them identically:

- `orb()`: the crystal ball on its gold stand, the meaning of the name and the shape of Scry's icon in the Editor. The stand's base is gold too: a dark brown base read as a stray shape. With `rows`, the Inspector shows inside the glass (card, icon).
- `vision()`: the cover's and social image's picture. Three lines of plain C# enter the ball and come out, level with them, as the controls Scry draws from them: a clamp gives bound boxes, a switch a dropdown, a method an undoable button. The controls follow the real Inspector (Unity's dark skin, the saved bar, `0 ≤` / `≤ 20` boxes, the method name on a faint fill with the undo arrows).
- `sky()`: a seeded starfield, the same on every render.
- `fonts/Inter.woff2`: Inter, the Editor's font (SIL Open Font License), Latin subset; other glyphs fall back to Segoe UI.

The media images show the idea at a glance: code goes into the crystal ball, the Inspector comes out. One example per kind of control, three in all; the detail (panels, facts, warnings, a whole component) belongs in the screenshot gallery. A full Inspector beside its script, joined line by line, lost: it read as a screenshot, not as a picture of the package. Beams run straight, each line level with its control, since angled threads were hard to follow. Violet is Scry's accent in the Editor (`ScryColors`, #8466de in the dark skin); the controls keep Unity's own colors, as in the product. The card and icon, too small for code, show the Inspector inside the ball.

Set `CHROME` if Chrome is not at its default install path.

## Asset Store key image rules

From Unity's [What makes a great key image](https://support.unity.com/hc/en-us/articles/210122403-What-makes-a-great-key-image-and-are-there-any-size-restrictions-):

| Image | Size | Allowed text |
| --- | --- | --- |
| Icon | 160x160 (shown at 80x80) | None |
| Card | 420x280 | Asset title, publisher name or logo |
| Cover | 1950x1300 | Asset title, publisher name or logo, a tagline |
| Social media | 1200x630 | None |

All images: no Unity logo, no sale banners, no watermark; not only a screenshot of the Unity Editor; not blurry, stretched or cropped.
