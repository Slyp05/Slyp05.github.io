# Sources Media

Sources for the Asset Store media. Every marketing image is an HTML/SVG page here, rendered to PNG with headless Chrome. Edit the HTML, re-render, never edit a PNG by hand.

| Output (one level up) | Source | Render (Git Bash, from this folder) |
| --- | --- | --- |
| `Cover 1950x1300.png` | `cover.html` | `sh render.sh` |
| `Card 420x280.png` | `card.html` | `sh render.sh card.html "../Card 420x280.png" 420 280` |
| `Social 1200x630.png` | `social.html` | `sh render.sh social.html "../Social 1200x630.png" 1200 630` |
| `Icon 160x160.png` | `icon.html` | `sh render.sh icon.html "../Icon 160x160.png" 160 160` |

Shared parts, placed with `<image>` so every image draws them identically:

- `illustration.svg`: the provider list threading into a context's members. Used by the cover and the social image. Its coordinates are the cover's original canvas (viewBox `940 220 960 800`); the cover now places it scaled to 749x624 at (1113, 308).
- `selvage.svg`: the bottom-edge hem. Place it at full image width, height = width * 104 / 1950.

The denim background (indigo gradient, twill, heather) is inline in each page, tuned to its canvas: an `<image>` would scale the texture with the image.

`Variants/Dark/` holds the earlier dark (documentation theme) set, self-contained and renderable the same way (`sh render.sh Variants/Dark/cover.html "Variants/Dark/Cover.png"`).

The card and the icon draw their own reduced versions, because a scaled-down illustration is illegible at their size. The card and icon are drawn on a canvas twice the output size and rendered at half size.

Set `CHROME` if Chrome is not at its default install path.

## Asset Store key image rules

From Unity's [What makes a great key image](https://support.unity.com/hc/en-us/articles/210122403-What-makes-a-great-key-image-and-are-there-any-size-restrictions-):

| Image | Size | Allowed text |
| --- | --- | --- |
| Icon | 160x160 (shown at 80x80) | None |
| Card | 420x280 | Asset title, publisher name or logo |
| Cover | 1950x1300 | Asset title, publisher name or logo, a tagline |
| Social media | 1200x630 | None. Unity skips assets with text on this image when choosing what its paid social promotions feature. |

All images:

- No Unity logo, no sale banners, no watermark, no default Unity skybox.
- Not only a screenshot of the Unity Editor.
- Not blurry, stretched or cropped.
- Each size gets its own design so it stays legible at its display size; never scale the cover down to make the card.
- Keep text minimal: it collides with Store sale overlays and does not localize.
- For tools, Unity suggests minimalist designs or clear editor screenshots.

## Visual language

- Denim. A selvage is the finished, self-woven edge of a fabric; selvedge denim is where most people meet the word, so the whole image is jeans fabric.
- Background: worn indigo, `#34557f` at the centre to `#22395e` to `#121e36` at the edges. A 3x1 twill (`#9fb6d6` ribs rotated -62 degrees, opacity 0.10) and a fractal-noise heather of light weft flecks (opacity 0.22 on the cover; fainter and shorter on the card and social, where long flecks read as rain).
- Panels: provider panels `#1b2c4b`, context card `#1d3052`, member rows `#26395c`, borders `#3d5378`, thread casings and icon casings `#142440`, order pips `#7d93b8`.
- Accent colours (from the documentation theme): providers blue `#89b4fa`, mauve `#cba6f7`, teal `#94e2d5`, peach `#fab387`. Validation Green `#a6e3a1`.
- Text: title gradient `#f2efe6` to `#d6e2f5` (off-white), subtitle `#e8ecf4`, tagline `#b9c6db`. Font: Segoe UI Variable Display, bold title, regular tagline.
- Motif: threads run from the ordered provider list (left, with order pips) into the members of a context (right card), each member lit Green. Thread casings make crossings read as woven over/under.
- Hem along the bottom edge: a darker folded indigo band with a worn highlight on the fold and double gold topstitching (`#d9a441`), the jeans signature. It is the images' signature; keep it on every image large enough to show it. Rejected: a dark tight-weave strip with pinholes (did not read as anything on denim), an ecru redline selvedge band (felt out of place), colour registration dots (read as unexplained UI).
- No purely decorative bars or accents: a shape a viewer cannot read as something is noise.
- Provider glyphs are abstract: cube (Scene), brackets (Attributes), stack (Registry), grid (Assets). No real text inside the illustration, so it stays within the cover's text rules.
- Card: title only, with three providers threading into three Green members, thicker strokes, and the hem.
- Social: the cover's illustration centred, no text, with the hem.
- Icon: a 3x3 basket weave on indigo, warp in the provider colours (blue, mauve, teal), weft in warm colours (peach `#fab387`, yellow `#f9e2af`, pink `#f5c2e7`), every crossing alternating over and under. A 2x2 weave reads as a "#" at 80x80; keep three strips per direction. No hem: too small to show it.

## Wording

The text sells what sets Selvage apart from other Unity DI frameworks: it fits the project as it is (plain fields, no base class, scripts that never mention it, dependencies from where they already live), where the others make the project fit them. Every image uses exactly this text, matching the store listing:

- Store title: `Selvage - Native Dependency Injection for Unity`. Images show `Selvage` large with `Native dependency injection for Unity` under it. "Native" carries both easy (Selvage follows Unity's own rules, nothing to learn on top) and complete (it covers how Unity runs: scenes, assets, `Instantiate`, Edit mode, async loading). Rejected: "Easy" (every DI listing claims it, and the free "Light DI | Easy Dependency Injection" nearly collides), "Built for Unity" (Extenject's description opens with it), "Container-Free" (Init(args) has no container either), "Unity-Native" (its hyphen repeats the title's dash), a colon or a pipe separator (store titles almost always use a dash).
- Tagline: `Adapts to your project, not the other way around.` Short; the Summary carries the sources and features. The cover keeps it on one line (38 px, as wide as the 50 px subtitle) and draws the illustration at 0.78 scale, so the text column ends about 190 px before the order pips. The text and the context card sit the same 121 px from their edge of the canvas. Rejected: breaking it after the comma (reads as cut), the full-size illustration (the text ran into it). Rejected: `No container, no installers, no lookups.` (no container is not unique to Selvage). Never claim "no bindings": most bindings become a `[Provide]` attribute or a `registry.Add` call, they do not vanish.
- No publisher name yet; add it under the tagline if wanted (the only other text the cover allows). The card allows title and publisher only, so it drops the tagline.
