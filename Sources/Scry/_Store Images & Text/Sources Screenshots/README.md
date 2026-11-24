# Sources Screenshots

Sources for the twenty-one Asset Store screenshots, 1950x1300. Each page is laid out at 1920x1280 and rendered at scale 1950/1920 to `../Screenshot NN.png` with headless Chrome. Edit the HTML, re-render, never edit a PNG by hand.

```sh
sh render.sh                    # every NN-*.html
sh render.sh 05-controls.html   # one
```

Set `CHROME` if Chrome is not at its default install path. Fonts: Inter from `../Sources Media/fonts/` for text, as on the cover, and Cascadia Code for code (ships with Windows).

## Shared parts

- `frame.css`: the cover's night-violet sky, the headline block, the six layouts below, code cards, captures (`.shot`, two stacked in `.stack`) and their placeholders (`.ph`), callouts, chips, the key cap, and Unity's Windows confirmation and right-click menu (`.win-dialog`, `.win-menu`).
- `highlight.js`: colours the C# inside every `<pre class="cs">`, in the cover's code colours. `«text»` marks the line a slide is about, `‹text›` a read, `⟪text⟫` a write, `~~text~~` code struck out.
- `slide.js`: draws the starfield (`sky()`) and the crystal ball (`orb()`) from `../Sources Media/parts.js`, so the slides and the cover share one drawing. Once the page has loaded it shifts a column so the beam meets the capture marked `data-beam`, and places each callout near the row it names (`data-y`, in the capture's pixels; `data-shot`, which capture of a stack), joined by a line to a dot on the capture's edge level with that row.

## Asset Store rules

From Unity's [What makes a great key image](https://support.unity.com/hc/en-us/articles/210122403-What-makes-a-great-key-image-and-are-there-any-size-restrictions-): screenshots are at least 1200 wide, show how the asset works and what it can do, and are never only screenshots of the Unity Editor. Marketing images carry no Unity logo, sale banner, watermark or default skybox, and are not blurry, stretched or cropped.

## Rules

- One idea per slide. The title is a plain sentence a buyer understands with no other context, since a screenshot may be the first thing they read. A line under it only where the title needs one. No two slides show the same feature.
- The slides complement the store description, never repeat it: the description lists what Scry does, the slides show concrete cases, and details the description leaves out (unit suffixes, the marks for saved and editor-only values, obsolete fields still holding data, multi-object runs, Settings and Preferences).
- The layout varies with what the slide shows, so the gallery never reads as one slide repeated:
  - Script to Inspector (`pair`): a code card, the crystal ball, the Inspector, where one script causes what the slide shows. Copy as Attribute runs the other way, the ball in the same place. Beside two stacked captures the beam stops at the ball (`in-only`).
  - Vision (`vision`): several one-line code cards beamed through one large crystal ball into the rows they become, as on the cover.
  - Annotated capture (`callouts`): one large capture with labelled callouts on both sides, for the Scry panel and a script nobody read; the search and the errors stack two captures of one component, its rows above its panel.
  - Track (`columns` and `track`): wide, short captures one above the other, each with its moment or its name at the left, for what Scry keeps of your project, a click undone beside the confirmation, and live values over time.
  - Side by side (`side-by-side`): named captures with one short line each, joined by a beam where they show one action, for multi-object runs, Settings and Preferences, asset previews and the docs.
- Code on a slide is short, compiles in a MonoBehaviour, and uses only what Scry reads (checked against the Showcase components and `Scry Built-In.scrydecl`). The part the slide is about carries the violet marker.
- Read and write use Scry's preview colours: teal reads, magenta writes. Errors are red callouts, warnings yellow, as Scry marks them (a divisor set to 0 is a warning).
- The script nobody read is never said to be written by an AI alone: the slide shows only what its Inspector tells.
- Titles use the words Unity users already know; Scry's own names (`_Design/Vocabulary.md`) appear only in callouts.
- No logo or name in the corner: the slides sit on the package's own store page.

## Readers

Every reader finds their slides in the first half, and none needs another's vocabulary:

| Reader | Slides |
| --- | --- |
| New to Unity | 01 (everything shown), 03 (why each row looks as it does), 08 (headers from comments), 10 (what Unity saves), 11 (buttons that undo) |
| Writes attributes, Odin users included | 02 (the attributes dropped), 05 (custom editors and drawers kept), 06 (controls from code), 18 (an attribute only to share a choice) |
| Debugs in Play mode | 12 (live values), 13 (run preview), 14 (coroutines, async and events), 17 (multi-object runs) |
| Lead developer | 04 (a script nobody read), 16 (errors before Play and before the build), 19 (settings for the team) |
| Experienced C# developer | 09 (search inside nested values), 14 (parameters, async and events), 15 (dictionaries, queues, polymorphic fields) |

## Order and slides

The promise first (most buyers see only the first few): everything in the script, no attributes, the panel that explains each row, a script nobody read, and the custom editors Scry keeps. Then controls, layout, search and what Unity saves, then methods, then values Unity cannot draw, the checks, and the setup last.

| # | Source | Layout | Shows | Captures |
| --- | --- | --- | --- | --- |
| 01 | `01-script.html` | pair | Turret.cs, Unity's Inspector (Speed only) against Scry's (everything, live) | `unity-turret`, `scry-turret` |
| 02 | `02-attributes.html` | pair | `[Range]`, `[ShowInInspector]` and `[Button]` struck out; the clamp in OnValidate is enough | `attributes-free` |
| 03 | `03-panel.html` | callouts | Range's panel: declaration, remarks, "Only matters while Use Range is on" with its line and Turn Use Range on, Style, Visibility, a link | `panel` |
| 04 | `04-any-script.html` | callouts | A script never opened: bounds, a dropdown, a missing tag, buttons that undo, ask or run on | `any-script` |
| 05 | `05-compatibility.html` | track | A custom editor kept with the crystal ball in its header, a `[Range]` drawer, a prefab override | `custom-editor`, `property-drawer`, `prefab-override` |
| 06 | `06-controls.html` | vision | Clamp, switch, WaitForSeconds and CompareTag, as bounds, a dropdown, a unit and "Missing Tag" flagged as no tag | `control-range`, `control-dropdown`, `control-unit`, `control-tag` |
| 07 | `07-relevance.html` | pair | Strikethrough while a toggle is off, read-only from OnValidate, Health's panel saying Awake overwrites it | `relevance` |
| 08 | `08-layout.html` | pair | A `#region`, a `///` separator, a hint, and the last field's tooltip open below it | `layout` |
| 09 | `09-search.html` | callouts | The member search finding hidden and nested members; the component's panel with Hidden, Layout and Show | `search`, `search-panel` |
| 10 | `10-saved.html` | pair | The saved bar, a field with none, an underlined static, `editor` after a field only editor code reads | `saved` |
| 11 | `11-methods.html` | track | Reload clicked, then undone with Ctrl+Z; File.WriteAllText asks first | `method-before`, `method-after`, `method-undone`, the confirmation drawn in HTML |
| 12 | `12-live.html` | track | The same Inspector at 0, 2 and 4 seconds of Play mode | `live-0`, `live-2`, `live-4` |
| 13 | `13-preview.html` | pair | Take Damage hovered: reads teal, writes magenta, values previewed | `preview` |
| 14 | `14-calls.html` | vision | A parameter field, a coroutine running, an async method given its token, an event's listeners, in Play mode | `call-parameters`, `call-coroutine`, `call-async`, `call-event` |
| 15 | `15-values.html` | vision | A dictionary on a ScriptableObject with a duplicate key, a queue, an interface field built in place, an array labelled by an enum | `value-dictionary`, `value-queue`, `value-polymorphic`, `value-enum-array` |
| 16 | `16-errors.html` | callouts | Missing component, missing tag, divisor 0, Editor API in a build, a static with Domain Reload off, an obsolete field still set | `errors`, `errors-panel` |
| 17 | `17-multi.html` | side by side | Three turrets selected, one Heal click, one undo step | `multi-hierarchy`, `multi-inspector` |
| 18 | `18-copy-as-attribute.html` | pair, reversed | Hidden in the panel, copied as `[Scry.Visibility.Hidden]` | `copy-as-attribute` |
| 19 | `19-settings.html` | side by side | Project Settings for the team, Preferences for one user | `project-settings`, `preferences` |
| 20 | `20-asset-previews.html` | side by side | Sprite, prefab and AudioClip previews on hover | `peek-sprite`, `peek-prefab`, `peek-audio` |
| 21 | `21-documentation.html` | side by side | The Inspector reference and Public API pages | `docs-manual`, `docs-api` |

## Captures

`Captures/` holds the Editor and docs captures the slides show, each placed as `<img class="shot" src="Captures/<name>.png">` at a width that fits its layout, its height following the capture.

The Editor captures come from `Assets/Store Captures/`, outside the exported package and compiled in the Editor only: one script per slide, written to match its code card, in `Store Captures.unity` (one group per slide) and `Base.unity` (the three turrets of slide 17); the asset previews come from the Showcase's Peeks. `StoreCaptureScenes.Build()` rebuilds both scenes. To retake a capture:

1. Set EditorPrefs `CustomEditorUIScale` to 200 and restart the Editor, in the dark skin. Set it back to 100 afterwards.
2. Through `unity command eval`, `StoreCapture.Open("<group>/<object>", x, y, w, h)` opens a floating Inspector of its own, locked on the object, with Transform folded. `ComponentRect`, `RowRect`, `LabelRect`, `RowButton` and `WindowRect("PanelDropdown")` give screen rects in physical pixels; grab them from the desktop, since a Scry panel is a window of its own. `StoreCaptureSettings.Open` does the same for Project Settings and Preferences.
3. In Play mode, set the Play mode tint to white for the capture. `StoreCaptureClock.RunTo(seconds)` steps game time by a fixed 0.05 s and pauses there, for the live values.

Unity draws its native dialogs and menus at the system scale, not the Editor's, so a 2x capture holds them at 1x. The slides draw both in HTML in their Windows style instead (`.win-dialog`, `.win-menu`, at CSS `zoom` matching the capture), the dialog's icon being Unity's own `UnityPlayerIcon.png` (`Captures/dialog-icon.png`); slide 18's capture is taken without its menu. `native.html` holds the same dialog alone, and `sh render.sh native` renders it at 1x to the User Manual's `img/confirmation`. The docs pages render with headless Chrome at 1110 x 1170 and device scale 4/3.

The User Manual's images (`Assets/Scry/Documentation/img/`) come from the same scenes at 100% UI scale, with the `Docs` group that `StoreCaptureScenes.BuildDocs()` adds.
