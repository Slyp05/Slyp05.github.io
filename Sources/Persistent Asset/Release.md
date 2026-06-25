# Persistent Asset — Release Materials

Working draft of the Unity Asset Store page (description + comparison table) and a pricing note.
Produced this session. Not final copy; edit freely.

---

## Store description (text before the table)

*A ScriptableObject-based save system for Unity: the asset you read at runtime is the one that saves itself. Automatic, no-code-friendly, cloud-ready, extendable, and more!*

**Stop writing save code!**

ScriptableObjects are already the cleanest way to hold your game's data in Unity: gold, levels, settings, unlocks, progress. Persistent Asset makes that data stick. The very asset you read and write at runtime is the one that saves and loads itself, so there is nothing to mirror into save files, no data classes to maintain, no serialization to wire up. Your data is your save.

**It grows with your project**
- **Prototyping:** one class and you're done. Inherit `PersistentScriptableObject`, press Play, and it saves to disk on its own.
- **Designers:** accessible without coding. Author variables, bind them to UI and save settings from the Inspector, with live tools to watch it work while you play.
- **Mid-size projects:** fully featured. Save slots, local or cloud storage, offline sync, AES-256 encryption, crash-safe writes, save versioning, saves that finish before the game quits, and more.
- **Large or live projects:** extension points everywhere. Swap the storage, serializer or save format, add your own data types and save policies, and hook into events and interfaces.

**Built to be trusted.**
A save system can't afford to lose progress, so reliability is the whole point: the system protects you from breaking existing player saves, an extensive automated test suite covers it end to end!

**Key features**
- **Automatic save & load** — inherit `PersistentScriptableObject`, press Play, it persists itself.
- **No code required** — author variables, bind them to UI, and save settings entirely from the Inspector.
- **UnityEvent-ready** — drop Save / Load / Clear straight onto a button.
- **Save slots** — multiple independent saves, listed without loading them.
- **Local or cloud** — files, PlayerPrefs, or Unity Cloud Save, with offline writes that upload later.
- **Crash-safe** — atomic write-then-swap plus an automatic backup copy; never overwrites good progress with defaults.
- **Save versioning** — upgrade old saves after a game update.
- **AES-256 encryption** + tamper-detection and device locks.
- **Smooth performance** — heavy work runs off the main thread; optional dirty-checking skips no-op saves; gzip compression.
- **Live editor tooling** — load state, last result, a save/load log, and a failure-simulation test mode, right in the Inspector.
- **Extensible everywhere** — swap the storage, serializer or save format; add custom data types, events, and opt-in interfaces.
- **Trustworthy** — 1,300+ automated EditMode & PlayMode tests, full C# source, IL2CPP/AOT ready, no mandatory dependencies.

**New here? Start with the User Manual.**
It takes you from your first save to cloud, security and the no-code workflow, with honest notes on the limits. *(link to the User Manual)*

**How it compares**
See how it holds up against the other solutions on the store! (link to Comparison page)

---

## Demo

https://justetools.itch.io/persistent-asset

## Comparison table

### Persistent Asset vs. Easy Save vs. Bayat Save System

*A simpler way to save and load your game.*

| What you care about | Persistent Asset | Easy Save 3 | Bayat Save System |
|---|---|---|---|
| **Setup & workflow** | | | |
| Saves & loads automatically, no code | ✅ Runs on its own | ⚠️ AutoSave component | ⚠️ AutoSave component |
| Set up entirely in the Inspector | ✅ No C# needed | ⚠️ Mostly code | ⚠️ Mostly code |
| Drop Save / Load onto a button | ✅ Ready for UnityEvents | ⚠️ Small script | ❌ Needs scripting |
| Save or wipe everything in one call | ✅ One call, every object | ⚠️ One at a time | ⚠️ One at a time |
| Change where saves go without rewriting code | ✅ Dropdown on the asset | ❌ Tied to your calls | ⚠️ Set in code |
| **Where it saves** | | | |
| Local files & PlayerPrefs | ✅ Built in | ✅ Built in | ✅ Built in |
| Multiple save slots | ✅ Built in | ✅ Multiple files | ✅ Catalog API |
| Cloud saves across devices, built-in | ✅ Unity Cloud Save | ❌ Your own server | ✅ Firebase / PlayFab |
| Keeps working offline, syncs later | ✅ Auto-uploads later | ❌ Not built in | ⚠️ Manual |
| Database storage (SQL / NoSQL) | ➖ Server owns the DB | ❌ No | ✅ Firebase (NoSQL) |
| PC, mobile, WebGL & console | ✅ Console via add-on | ✅ Console via add-on | ✅ Console untested |
| **Reliability & data safety** | | | |
| Saves can't corrupt on crash or power loss | ✅ Atomic write-then-swap | ⚠️ Backup-based | ⚠️ Backup-based |
| Automatic backup copy | ✅ Automatic fallback | ✅ Backup & restore | ✅ Built-in backup |
| Never overwrites good progress with defaults | ✅ Won't wipe a real save | ⚠️ Up to your code | ⚠️ Up to your code |
| Knows when async/cloud data is ready to use | ✅ Built-in ready signal | ⚠️ You track it | ⚠️ You track it |
| Upgrades old saves after a game update | ✅ Versioning built in | ⚠️ Migrate yourself | ⚠️ Migrate yourself |
| Reset to defaults or restore a checkpoint | ✅ Built-in reset & checkpoints | ⚠️ Manual | ⚠️ Manual |
| Finishes saving before the game closes | ✅ Waits for in-flight saves | ⚠️ No async drain | ⚠️ No async drain |
| **Security** | | | |
| Save encryption | ✅ AES-256 | ✅ AES-128 | ✅ AES |
| Tamper-proofing & anti-cheat | ✅ Edit-detection + device locks | ⚠️ Encryption only | ⚠️ Encryption only |
| **Performance** | | | |
| Smooth saving, no frame stutter | ✅ Heavy work in the background | ⚠️ Mostly main thread | ⚠️ Async API |
| Compress saves to shrink file size | ✅ gzip (Fast or Optimal) | ✅ gzip | ❌ Not built in |
| Skips saving when nothing changed | ✅ Optional dirty-check | ⚠️ Manual / cache | ⚠️ Manual |
| **What you can save** | | | |
| Deep object graphs & polymorphism out of the box | ⏳ via [SerializeReference]; full serializers coming | ✅ Reflection serializer | ✅ Json.NET-based |
| Save any object from anywhere in code | ➖ By design — one clear asset | ✅ Save anything, anywhere | ✅ Save anything, anywhere |
| Save entire scenes & GameObjects | ➖ By design — we save data | ✅ Snapshots scene objects | ✅ Unity objects & components |
| Save references between objects | ⏳ Asset refs planned | ✅ Unity & shared refs | ✅ Resolvers + shared refs |
| Save individual values / keys | ✅ Via Persistent Variables bag | ✅ Per-key partial saves | ✅ Per-key |
| **Editor & debugging tools** | | | |
| Live save status right in the Inspector | ✅ Load state & last result | ❌ No live panel | ❌ None |
| Edit your data live while playing | ✅ Tweak in the Inspector mid-play | ⚠️ Your component fields | ⚠️ Your component fields |
| Run Save / Load / Clear by hand while playing | ✅ Inspector buttons | ❌ From code | ❌ From code |
| Running log of every save & load | ✅ Built-in log | ❌ Not built in | ❌ Not built in |
| Simulate failures & slow/cancelled saves | ✅ Built-in test mode | ❌ Not built in | ❌ Not built in |
| One-click wipe of local saves for re-testing | ✅ Dev tool included | ⚠️ Editor tools | ❌ Via code |
| **No-code for designers** | | | |
| Save options & settings, no code | ✅ Ready-made workflow | ❌ Code required | ❌ Code required |
| Bind values to UI without code | ✅ Binder components | ❌ Not offered | ❌ Not offered |
| Values notify your UI when they change | ✅ Observable values | ❌ Not offered | ❌ Not offered |
| **Extending & integrations** | | | |
| Add your own save destination | ✅ Custom manager (+ cloud base) | ⚠️ Write the IO yourself | ✅ Modular Storage API |
| Swap in your own save format / serializer | ✅ Serializer is a slot | ⚠️ Harder to swap | ✅ Modular Serialization API |
| Teach it your own custom data types | ✅ Custom codecs | ✅ Custom ES3 types | ✅ Custom converters |
| React to saves & loads with events / hooks | ✅ Global events | ⚠️ Limited | ⚠️ Limited |
| Add advanced behaviour with one small interface | ✅ Opt-in interfaces | ❌ No equivalent | ⚠️ Extensible APIs |
| Free official serializer add-ons | ⏳ Newtonsoft / Odin (coming) | ⚠️ Community | ❌ JSON only |
| Third-party integrations (Steam, PlayFab, Firebase…) | ⏳ On the roadmap | ⚠️ Some / community | ✅ Firebase, PlayFab, Steam, GPG, Xbox |
| Visual scripting (PlayMaker) | ❌ Under consideration | ✅ PlayMaker actions | ✅ PlayMaker & Bolt |
| Spreadsheet / CSV export | ❌ Not our focus | ✅ Built in | ❌ Not offered |
| **Compatibility & ownership** | | | |
| Full C# source included | ✅ Editable source | ✅ Editable source | ✅ Editable source |
| No mandatory dependencies | ✅ Standalone | ✅ Standalone | ✅ Standalone |
| IL2CPP / AOT ready | ✅ Mono & IL2CPP | ✅ Mono & IL2CPP | ✅ Mono & IL2CPP |
| Human-readable saves (unencrypted) | ✅ Plain JSON | ✅ Plain JSON | ✅ Plain JSON |
| Save to a custom file path | ✅ Configurable | ✅ Configurable | ✅ Configurable |
| **Track record** | | | |
| Years of proven track record | ❌ New release | ✅ Long-established | ✅ Established |
| Actively developed (new features) | ✅ Active | ✅ Frequent updates | ❌ No release since Dec 2024 |
| Big community, tutorials & integrations | ❌ New | ✅ Large ecosystem | ⚠️ Smaller |
| Tested | ✅ 1,300+ automated tests (EditMode & PlayMode) | ✅ Field-proven over years | ⚠️ Platform-tested |
| Thorough documentation | ✅ Full docs | ✅ Full docs | ✅ Docs site |

✅ yes · ⚠️ partly / manual | unclear · ➖ deliberately not · ❌ no · ⏳ coming