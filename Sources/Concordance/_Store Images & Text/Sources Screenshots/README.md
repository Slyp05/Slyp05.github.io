# Sources Screenshots

Sources for the nineteen Asset Store screenshots, 1950x1300 (the Asset Store gallery size, 3:2). Each page is laid out at 1920x1280 and rendered at scale 1950/1920 to `../Screenshot NN.png` with headless Chrome. Edit the HTML, re-render, never edit a PNG by hand.

```sh
sh render.sh                    # every NN-*.html
sh render.sh 07-order.html      # one
```

Set `CHROME` if Chrome is not at its default install path.

## Shared parts

- `frame.css`: the paper, the headline block, the stage, the code cards (one per script, its file name on a bar in the script's ink), the capture placeholders, tags and captions.
- `paper.svg`: the cover's cream paper and grain at the page size.
- `highlight.js`: colours the C# inside every `<pre class="cs">`, and marks what Concordance adds to a line (`(Modifier)`, `Modifier.Stop`, `[ModifierPhase.X]`, the `Modify` and `Observe` calls) in the card's ink. In a `<pre class="cs manual">`, only the text between `«` and `»` is marked. Cascadia Code ligatures are off, so `=>` reads as typed.

## Rules

- Each slide holds one feature and reads at a glance from its title and one picture: a graph, a code card, a diagram or a capture. The line under the title is optional detail and stays one short line. The headline promises a result, never names a feature.
- No two slides show the same feature. Every feature that can be shown, or that is central to the package, gets its slide.
- Each slide's example also shows a second feature in passing: SetActive written like a property (05), a method call inside a change (07), an observer with no unsubscribe (10), an owner passed to the regular syntax (11).
- Package terms that the code on a slide shows anyway are named, since the code explains them at a glance: `Modifier` (02, 07, 08, 09, 12), "quick syntax" and "regular syntax" (11), "advanced API" (15). A term the slide doesn't show stays out of the prose, and each slide leaves the next slide's feature to it: 11 shows no function, 12 does.
- Labels in a sequence share one form: numbered steps (07), not a mix of names and actions.
- Code is welcome on slides: short, large, with only what the slide is about highlighted. The no-code rule applies to the store description only, which is plain text.
- Read every slide as a buyer who has never heard of Concordance: no slide relies on knowing the package, "Without Concordance" labels the broken side, and every word means what a Unity user reads in it. The person playing is not "the player" (that is the build, or the person); the thing moving on screen is "the character".
- Each slide takes its own value, so the gallery shows the range: game speed, movement, gravity, a HUD's active state, speed, field of view, damage, a light, the master volume, gravity scale, music volume, asset fields. No value carries the gallery.
- Script cards take the logo's three inks, blue, ochre and crimson, including scripts that don't use Concordance. The value itself is ink, as on the cover.
- Editor captures use the dark skin, the one most Unity users see, taken at 200% UI scale and cropped on the one element the slide is about; a whole window is never shown.
- No logo or name in the corner: the slides sit on the package's own store page.
- Vocabulary follows the store text (change, before any change, field or property) on slides with no code that shows a package term.

## Order and slides

The order is for marketing: the problem and the fix first (most buyers see only the first few), the demo third as the most visual proof, scripts written apart fourth (the core promise, for whoever writes the code, an AI assistant included), then what the window shows, then how changes behave, then the code side, then reassurance.

| # | Source | Feature | Captures |
| --- | --- | --- | --- |
| 01 | `01-overwrite.html` | The overwrite bug: game speed over time, slow motion ending unpauses the game under the menu without Concordance | none |
| 02 | `02-one-keyword.html` | `(Modifier)` and `Modifier.Stop` on an existing line: a stun and a cutscene both disable movement, and the character moves again only once both have ended | none |
| 03 | `03-demo.html` | The demo's overlapping gravity zones, both ways | `demo-plain`, `demo-concordance` |
| 04 | `04-written-apart.html` | Scripts written apart, by you, a teammate or an AI assistant, combine; Concordance itself needs no AI. Three scripts on one value next to the cover's rings | none |
| 05 | `05-who-writes.html` | Every write to a value, and conflicts in Play: three `SetActive` calls on a HUD | `window-writes` |
| 06 | `06-breakdown.html` | How a value is built: before any change, each change with its line, mute, history | `window-values`, `window-history` |
| 07 | `07-order.html` | Order by phase: field of view 60, sprint +20, a `Mathf.Min` cap at 75 (Late), a cutscene's 40 (Latest) | none |
| 08 | `08-lifetime.html` | No cleanup code: a power-up's change ends with it, its `OnDestroy` cleanup struck out | none |
| 09 | `09-on-top.html` | Writes that don't use Concordance (old scripts, Animator, Timeline, UI) keep working, changes apply on top: a light the Animator writes every frame, dimmed by a storm | none |
| 10 | `10-observe.html` | Observe the master volume, which Unity raises no event for; a display-only meter follows | none |
| 11 | `11-method.html` | Quick syntax and regular syntax side by side; the regular syntax's options, such as the object a change ends with | none |
| 12 | `12-functions.html` | Inspector functions: the function field and its use in `Modify` highlighted | `function-inspector` |
| 13 | `13-inspector.html` | The Inspector section and the custom window's Needs a Decision | `inspector-section`, `window-decisions` |
| 14 | `14-restore.html` | Exiting Play mode restores every value; ScriptableObject assets keep theirs | none |
| 15 | `15-control.html` | The advanced API, `Concord`: stop by target, release a pooled object, clone without changes for a save | none |
| 16 | `16-compiled.html` | Compile-time rewriting, as facts only: no wrapper type or boilerplate, direct calls, pay for what you use, no allocation, no stripping issues with IL2CPP, packages and DLLs | none |
| 17 | `17-analyzer.html` | The CND0107 warning, a modifier function field without `[SerializeReference]`, with the analyzer's exact message and code fix title, then the fixed line | none |
| 18 | `18-everywhere.html` | Unity 6.0 to 6.6, the build targets, Mono, IL2CPP, Enter Play Mode without Domain Reload, Test Runner | none |
| 19 | `19-learn.html` | Quick Usage Guide, User Manual and the demo, fanned | `docs-qug`, `docs-manual`, `demo-start` |

Captures sit in `captures/`, cropped from the Editor or the demo as `_DevTools/Captures/README.md` describes. A capture still to take shows as a dark, dashed "Screenshot pending" box (`.ph` in `frame.css`) with its name and what it must show.

## Captures

All taken in the throwaway capture project at 200% UI scale, dark skin, except the demo frames (its Game view) and the two docs pages (headless Chrome at device scale 2, 1200x1008).

- `window-writes`: Play mode, the HUD's `activeSelf/SetActive` watched: the Writes section with the tracked CutsceneManager, LowHealthWarning and PauseMenu lines open, the packages folded, and the conflict flag on the HUD.
- `window-values`, `window-history`: Play mode, `Mover.speed` watched: 5 before any change, Sprint +3 (8), MudZone x0.5 in Late (4); its history.
- `function-inspector`: the MusicFadeZone component in Play, the Fade field set to Blend with its Target and Weight.
- `inspector-section`: a Character's Concordance section open in Play: 3 modified, 1 conflicting writes.
- `window-decisions`: the member list with Needs a Decision on in Play.
- `demo-plain`, `demo-concordance`: each mode past the overlapping zones, near the flag. `demo-start`: the start screen after a plain run.
- `docs-qug`, `docs-manual`: the Quick Usage Guide and the tutorial page.

## Rejected

- Separate slides for the writes list, the conflict flag and the member details on the same value: three slides of one window. Writes and conflicts share slide 05; the value breakdown, on another value, is slide 06.
- A grid of one-line changes on nine values: it repeats what the other slides already show, each on its own value.
- A "costs nothing where unused" slide on its own: the claim has no picture except a number, and the store text uses no benchmark numbers; it is a fact on slide 16.
- The time scale as the example on most slides: the gallery read as a time scale tool. It stays on slide 01 only, the most familiar overwrite bug.
- "Regular assignments" as the label of the broken side: it names a distinction only a user of the package knows.
- The demo's ending told by the flag or a gravity number: the flag means nothing before playing, and the numbers vary with where the character stands.
- A logo and name in the bottom right corner of every slide.
- Grey cards for scripts that don't use Concordance: every script takes a logo ink.
- "The same level, played twice" as slide 03's title: it describes the demo instead of what the buyer gets.
- Uncropped Editor windows: dense, unreadable at gallery size.
- AI as its own section of slides: one slide says it, and the slides on the analyzer, the window, the keyword and cleanup already show why it helps. The claims stay modest: no promise that Concordance fixes generated code.
- The light Editor skin: buyers recognise the dark one as their Editor.
- "One keyword" on slide 02: the code right under the title shows what it is, `(Modifier)`.
- A graph for slide 08: the feature is what the user doesn't write, so the slide shows the cleanup code struck out.
- A pipeline diagram on slide 16: the boxes added nothing to the facts.
- ": metaprogramming" closing a subtitle.
- A volume slider on slide 10: a slider reads as input; the meter is display only.
- CND0001 on slide 17: it shows a syntax quirk of the package; CND0107 catches a Unity serialization trap and fixes it.
- The function dropdown open on slide 12: Unity draws it as a native menu at the desktop's scale, half the size of a 200% Inspector and over the field it belongs to.
- Section tags on slide 06's captures: the captures' own headers already say Values and History.
- The function dropdown and the mute toggle's tooltip rebuilt in HTML at 200% over the captures (slides 12 and 06): they made the slides worse than the plain captures.
