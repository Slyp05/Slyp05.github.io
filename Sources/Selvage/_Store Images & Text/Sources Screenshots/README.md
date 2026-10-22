# Sources Screenshots

Sources for the twenty-seven Asset Store screenshots, 1950x1300 (the Asset Store gallery size, 3:2). Each page is laid out at 1920x1280 and rendered at scale 1950/1920. Each is an HTML page here, rendered to `../Screenshot NN.png` with headless Chrome. Edit the HTML, re-render, never edit a PNG by hand.

```sh
sh render.sh                  # every NN-*.html
sh render.sh 07-change.html   # one
```

Set `CHROME` if Chrome is not at its default install path.

## Shared parts

- `frame.css`: denim background, headline block, stage, code card, Editor capture frame, captions, legend dots, badges, the IDE squiggle and tooltip.
- `denim.svg`: the cover's denim drawn at the 1920x1280 page size. `selvage.svg`: the hem, copied from `Sources Media/`.
- `highlight.js`: colours the C# inside every `<pre class="cs">`. Cascadia Code ligatures are off, so `=>` and `!=` read as typed.

## Order and audience

The gallery leads with what sets Selvage apart: dependencies come from where they already live (scenes, asset folders, classes, code), with no container. The order is for marketing, not by theme: the payoff and the most visual slides first (Editor collage at 3), the container comparison at 6 to hook DI users, then visuals alternating with code, advanced topics last and the manual as the closing reassurance. Each slide holds one idea with as little text as it needs, and its headline promises a result, never a feature name. Validation results show mostly Guaranteed, with one May Be Supplied (a scene component) and one Missing where the slide is about catching it.

| # | Source | Idea | Captures |
| --- | --- | --- | --- |
| 01 | `01-wiring.html` | Lookups become `[Inject]` fields, each tagged with its source colour | none |
| 02 | `02-sources.html` | Scenes, asset folders, classes and code supply the fields | `hierarchy-rows`, `project-folder-rows`, `insp-turret-play-section` |
| 03 | `03-editor.html` | Every Editor surface in one composition | `providers-expanded`, `provide-tuning-component`, `live-turret`, `insp-turret-edit`, `provide-definition` |
| 04 | `04-checked.html` | The Inspector validates every field before Play; the build gate | `insp-turret-edit`, `validation-settings` |
| 05 | `05-live.html` | The Live tab on the demo's HUD | `live-demo` |
| 06 | `06-classic-di.html` | A container next to Selvage, row by row | none |
| 07 | `07-small-api.html` | Two attributes to start; public types: Selvage 31, VContainer 61, Zenject 478 (counted by reflection over each runtime assembly, 2026-10-20) | none |
| 08 | `08-explain.html` | Explain names the provider that answers, and lists those asked | `validation-explain`, `explain-missing` |
| 09 | `09-no-attribute.html` | Inject by Default: no `using Selvage`, no `[Inject]` | `inject-by-default` |
| 10 | `10-analyzer.html` | SLV0106 warning, SLV0208 hint and its quick fix, with the analyzer's exact messages | none |
| 11 | `11-any-object.html` | MonoBehaviour, ScriptableObject, plain class and static class, one way | none |
| 12 | `12-editmode.html` | EditMode members injected while editing | `insp-editmode` |
| 13 | `13-compiled.html` | Injection woven at compile time; allocations, speed, link.xml, tests | none |
| 14 | `14-spawn.html` | `new` and `Instantiate` inject; a local block passes per-spawn data | none |
| 15 | `15-pooling.html` | `[Provide(Lifetime.Pooled)]` with IResettable: borrow and give back | none |
| 16 | `16-assets.html` | Any folder, Resources and Addressables, the same member | none |
| 17 | `17-options.html` | Optional, Overwrite, and all options combined | none |
| 18 | `18-async.html` | Async waits; the Live tab shows what it waits on | `live-save-waiting` |
| 19 | `19-warm.html` | Warm holds what is ready, then the slower dependency | none |
| 20 | `20-reactive.html` | A Reactive property's setter runs with each newer dependency | none |
| 21 | `21-preference.html` | A preference picks between two classes | `live-jukebox` |
| 22 | `22-channel.html` | Channels ("like a key, but a hint") and `[DynamicChannel]` | `live-announcer` |
| 23 | `23-swap.html` | A `[Provide]` class in an Editor assembly replaces the runtime one | `project-mockstore`, `live-shop` |
| 24 | `24-setups.html` | Save and reuse the Selvage setup (real menu capture, with two throwaway demo setups saved then deleted) | `setups-page` (the native dropdown renders at 1x whatever the Editor scale, so it is rebuilt in HTML at 2x with the same items) |
| 25 | `25-provider.html` | A custom provider, in the provider list | `provider-list-cam` |
| 26 | `26-compat.html` | Migrating from Zenject or VContainer, one script at a time (an escape hatch, not a workflow) | none |
| 27 | `27-learn.html` | Documentation and demo collage, with what the docs include | `manual-home`, `demo-game` |

Attributes are white and bold in code. Each source has one colour on every slide and on the cover: scenes blue (`--scene`), classes mauve (`--class`), assets peach (`--asset`), code teal (`--code`), with the `.chip` style in `frame.css`.

## Captures

`Captures/` holds real Editor and game captures, taken at 200% Editor UI scaling so they stay sharp at slide size, then cropped. They come from the throwaway project `D:/Unity Projects (bis)/Selvage - Screenshots (throwaway)`, committed in `_DevTools/Screenshots Project/` (its README says how to restore it):

- `Assets/Store/` holds the scenario, scene `Assets/Store/Store.unity`: `Turret` (with `Health`: a Rigidbody, `[Provide]` classes, a settings asset and a sound from a Provide Definition, an `IScoreBoard` that `Boot` adds to the registry), `Cannon` (the same fields with no Selvage in its script, for Inject by Default), `Jukebox` with the two audio buses, `Shop` with `SteamStore` and `Editor/MockStore`, `UI/HUD` with a `UI Camera` whose Provide Tuning prefers objects under `UI`, `Announcer` (a `[DynamicChannel]` voice), `Level Preview` (an `[ExecuteAlways]` script with EditMode members; re-add the component after a script reload so its members read as injected), and `Radar`, whose camera comes from `MainCameraProvider` listed second for slide 19.
- Slide 4's Missing member is `Turret.scores` with the Registry Provider removed from the provider list; with it listed, that member is May Be Supplied in Edit mode and injected in Play mode.
- Slide 9 needs Inject by Default enabled while capturing; turn it off afterwards.
- Slides 5, 18 and 27 capture the demo game. Slide 18's waiting card is taken in paused Play mode after two `EditorApplication.Step()` calls, before the cloud save arrives.
- The manual pages are rendered from `Assets/Selvage/Documentation` with headless Chrome at device scale 2.

The capture scripts are in the throwaway project's `Capture Scripts` folder, the store ones in `Capture Scripts/store-2026-10-20` (`ev.sh` runs a C# file in that Editor, `shot.sh` grabs a window off-screen). To capture at 2x: set the EditorPrefs key `CustomEditorUIScale` to 200, restart that Editor, and set it back to 100 afterwards. The key is per user, so every Editor started meanwhile opens at 200%.
