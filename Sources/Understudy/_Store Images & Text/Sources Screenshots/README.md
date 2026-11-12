# Sources Screenshots

Sources for the eighteen Asset Store screenshots, 1950x1300. Each page is laid out at 1920x1280 and rendered at scale 1950/1920 to `../Screenshot NN.png` with headless Chrome. Edit the HTML, re-render, never edit a PNG by hand.

```sh
sh render.sh                    # every NN-*.html
sh render.sh 06-partial.html    # one
```

Set `CHROME` if Chrome is not at its default install path. Fonts: Bahnschrift for text, as on the cover, and Cascadia Code for code; both ship with Windows.

## Shared parts

- `frame.css`: the cover's stage (back wall, spotlight beam, a strip of curtain at each side), the headline block, the stage, code cards, captures (`.shot`) and their placeholders (`.ph`), outcome lines.
- `highlight.js`: colours the C# inside every `<pre class="cs">`, and marks what Understudy adds to a test (the `Stub`, `Spy`, `Fake` and `Real` entry points, and `Returns`, `Do`, `EachReturns`, `EachDo`, `Raise`) in cardboard. `<pre class="cs plain">` marks nothing. Cascadia Code ligatures are off, so `=>` reads as typed.

## Asset Store rules

From Unity's [What makes a great key image](https://support.unity.com/hc/en-us/articles/210122403-What-makes-a-great-key-image-and-are-there-any-size-restrictions-), checked 2026-11-12: screenshots are at least 1200 wide, show how the asset works and what it can do, and are never only screenshots of the Unity Editor. Marketing images carry no Unity logo, sale banner, watermark or default skybox, and are not blurry, stretched or cropped.

## Look

The cover's visual language carries over: the stage is the slide, and cardboard means a stand-in.

- Background: the cover's back wall (`#15171c` to `#1f2128`) under a faint spotlight beam, with a strip of the red curtains at each side.
- Code: one or two lines on a dark card, large. What Understudy adds is bold cardboard (`#d9b47c`) on a soft marker.
- Failures take the curtains' red (`#e0525f`), passes a green (`#7fcf86`).
- Title in Bahnschrift bold condensed, like the cover's title; the optional line under it in semi-condensed.
- No logo or name in the corner: the slides sit on the package's own store page.

## Rules

- Glanceable: each slide reads in two seconds. A title, at most one short line under it, and one picture. The picture carries the point: a diagram, a drawing, a check matrix, tags or a capture, with code only where the code is the point, and never more than two lines of it. No paragraphs, no file listings, no code under test beside the test.
- Files are drawn as pages with abstract lines: green lines added, red lines removed, grey lines unchanged.
- Diagrams share one grammar: grey boxes are the game's code, cardboard boxes what a test declares, dashed red boxes code written only to make testing possible. A green check is a pass, a red cross a failure.
- The title promises a result in plain words. "Control", not "stub", in titles a beginner reads first.
- No two slides show the same feature.
- Code on the slides is real API, checked against the documentation and the analyzer's exact messages (UST0012 on slide 11).
- Vocabulary follows `_Design/Vocabulary.md`. No slide says "your code" for the code a test runs.

## Readers

Every reader finds their slides in the first half, and none needs another's vocabulary:

| Reader | Slides |
| --- | --- |
| Never written a test | 01 (no rewrite), 03 (tests that only pass on one machine), 09 (a picture, not an API), 18 (a tutorial) |
| Writes NUnit tests, no mocking | 04 (records checked with NUnit), 12 (failures), 13 (every test starts fresh) |
| Uses Moq or NSubstitute | 01, 05 (the check matrix), 10 (what they can't reach) |
| Lead developer | 03, 13, 15 (mistakes caught early), 16 (CI), 17 (release unchanged, cost) |
| Experienced tester | 07 (partial stubs), 08 (one instance or all), 11 (swallowed exceptions), 14 (calls Unity makes) |

## Order and slides

The promise first (most buyers see only the first few), then the reach, leak detection as the second reason to buy, spies for NUnit users, and the NSubstitute and Moq comparison at 05 so mocking users meet it early. Then features, then the workflow (failures, fresh tests, engine calls, code analysis, CI), reassurance, and the docs last.

| # | Source | Shows | Captures |
| --- | --- | --- | --- |
| 01 | `01-rewrite.html` | Without Understudy: Mover.cs drawn as a diff (green and red lines) with a red cross, plus IClock.cs, UnityClock.cs and FakeClock.cs added. With it: Mover.cs untouched with a green check, and the one stub line in MoverTests.cs | none |
| 02 | `02-unity-api.html` | Cardboard tags of what a test controls: Time, Random, Input, Physics, Camera.main, singletons, `new`, events | none |
| 03 | `03-leaks.html` | The same test passing on a laptop and failing on a build server, above the leak warning | `console-leaks` |
| 04 | `04-spy.html` | `menu.Quit()` calls the real `game.Save()`; the spy hangs a "1 call recorded" tag off the call; the spy and its assertion | none |
| 05 | `05-coming-from.html` | A check matrix: interfaces and virtual methods for all three; static members, fields, `new` and Unity engine types for Understudy only | none |
| 06 | `06-singleton.html` | ScoreLabel reads GameManager.Instance, which leads to the cardboard test manager; the real manager below, never touched | none |
| 07 | `07-partial.html` | Downward raycasts stubbed to miss, others real, drawn as rays | none |
| 08 | `08-instances.html` | Every enemy's health faked, the boss's set to 1, drawn as health bars | none |
| 09 | `09-fake.html` | `Time.timeScale` faked: pause icon and 0 for the code, play icon and 1 for the real one | none |
| 10 | `10-members.html` | Four icon tiles: constructors, engine events, engine types, destroyed objects | none |
| 11 | `11-catch.html` | An exception from `Save()` disappears into an empty `catch { }`; a "Spy.Catch: 1 caught" tag records it, and the test fails | none |
| 12 | `12-failures.html` | `Assert.That(damage.Calls, Is.Empty)`, and the Test Runner failure listing each recorded call with its result and line | `testrunner-failure` |
| 13 | `13-fresh.html` | Three tests, each starting `Score.best` at 0 and ending elsewhere; the `[TearDown]` they no longer need, struck out | none |
| 14 | `14-engine-calls.html` | A Button's On Click list, a click arrow to `door.Open()`, and its "1 call recorded" tag | `inspector-onclick` |
| 15 | `15-analysis.html` | UST0012 and its quick fix | none |
| 16 | `16-ci.html` | Push, tests, a red cross for a leak; Report Leaks as Errors | `project-settings` |
| 17 | `17-builds.html` | Mover.cs woven in the Editor (about 3 ns per access outside a test), then built into a player as written | none |
| 18 | `18-learn.html` | The tutorial, the Quick Usage Guide and the User Manual | `docs-tutorial`, `docs-qug`, `docs-manual` |

## Captures

`Captures/` holds the Editor and docs captures the slides show. The Editor ones come from the screenshots project (`_DevTools/Screenshots Project/`), at 200% Editor UI scale with the dark skin, cropped on the one element the slide is about; the docs pages render with headless Chrome at device scale 2. A capture still to take shows as a dark, dashed "Screenshot pending" box (`.ph` in `frame.css`) with its name and what it must show.

- `console-leaks`: the Console, warnings only, cropped on one leak warning: "Leak in EnemyTests.Spawns: Random.Range(int, int) ran for real at Enemy.cs:42. Stub it, or declare it real with Real."
- `testrunner-failure`: the Test Runner's message for `PlayerTests.ShieldBlocksSpikes`, failed on `Is.Empty`: both recorded `Player.TakeDamage(5)` calls with their results, lines and order. A collection constraint prints the list; `Has.Count` would print only the count.
- `inspector-onclick`: a Button's On Click () list wired to `Door.Open`.
- `project-settings`: the Understudy page of Project Settings, cropped on Report Leaks as Errors, enabled.
- `docs-tutorial`, `docs-qug`, `docs-manual`: Write your first test on Write the test, the Quick Usage Guide and the User Manual home, cropped on the content column.

## Rejected

- "Works with the tests you already have" (abstract test bars, a leak flag, NUnit and mode tags): its leak repeated 03 and its tags repeated what 04 implies; the most abstract slide of the set.
- "Let the code pause the game. The Editor won't.": it read as the Editor refusing something.
- A first set of twenty-four dense slides, each with a test file, the code under test marked unchanged, outcome lines and captions: too much to read at gallery size, and it scared off readers who don't write tests. Features cut with it: failed-assertion output, computed answers, no-cleanup fixtures, reusable helper classes, calls from the engine.
- Plain cream or white slides, as Concordance's: the cover's dark stage is Understudy's identity, and cardboard reads only on it.
- Full curtains on every slide: they take a fifth of the width. A strip at each side keeps the stage.
- Slide 01 as a box-and-arrow diagram of IClock, UnityClock, FakeClock and Mover: it read as a UML chart, not as work saved. Pages with diff lines show the rewrite at a glance.
- A second set of one-line slides: lighter, but most slides were a lone code line that only a C# reader could decode. Diagrams replaced them.
- "Stub" in beginner-facing titles, and "Other mocking libraries" as the label of the rewrite: both assume the reader knows mocking.
- The leak warning drawn in HTML: the real Console reads as proof; it is a capture.
