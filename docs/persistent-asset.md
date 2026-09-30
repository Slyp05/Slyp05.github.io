---
layout: page
title: Persistent Asset
permalink: /persistent-asset/
image: /assets/images/persistent-asset-social.jpg
description: "Make persistent data a native part of your Unity project! Save your way, anywhere, anything, safely."
software:
  name: "Persistent Asset - Integrated Save System & Data Persistence"
  store_url: https://assetstore.unity.com/packages/slug/389310
---

<img src="/assets/images/persistent-asset.jpg" alt="Persistent Asset" class="package-image" width="1200" height="800" decoding="async">

**Make persistent data a native part of your Unity project! Save your way, anywhere, anything, safely.**

## Description

**Persistent data should feel like a native Unity object, not a separate save system you have to architect around.**

Persistent Asset lets you create project assets whose content persists between play sessions. Each one comes with a manager you can configure to fit your game's needs.

***No save code required:*** all the complex machinery is hidden away. Access advanced features with just a few clicks in the Inspector, letting you focus on building your game.

***You keep full control:*** trigger or monitor any operation through a clean C# API, directly from the Editor, from a debug menu, from components, and more. The package is designed to be extensible, so you can take over as much as you like.

***No forced workflow:*** designers tweak values, programmers read them in code, and tool engineers extend the system. Everyone can work the way they prefer on the same objects. Because Persistent Asset is deeply integrated into Unity, no visual scripting is required.

***Built to scale with your project:*** get set up in no time and add features as you need them. It comes with everything you need to support a full release and beyond, so you won't outgrow it.

## Features

<details class="patch-note">
<summary><strong>Workflow</strong></summary>
<div class="patch-note-body" markdown="1">

- **Saved data:** your classes, scene objects and references to them, spawned prefabs, asset references.
- **Scene objects:** 17 Unity components (Transform, Rigidbody, Animator...) and 7 uGUI and TextMeshPro controls built in, plus your own components.
- **Existing ScriptableObjects:** keep their base class, add one attribute.
- **Persistent Variables:** values authored in the Inspector, no code. 44 built-in types, enums, asset references, input bindings, languages, or your own.
- **Lists and maps:** a variable can also be a list or a keyed map.
- **Variable references:** drag a variable onto a script field, no string names, rename-safe.
- **Prefs:** variables from any script with a static API, PlayerPrefs style.
- **No-code setup:** save menus, buttons and feedback panels, pre-wired from the GameObject menu. Drop a variable on a GameObject to bind it.
- **UnityEvents:** every operation is callable from one.
- **Code hooks:** before/after every save, load and clear, per manager or game-wide, with a veto. Interfaces for fresh start values, serialization callbacks and scope changes.
- **Class policies:** a class can force auto load, auto save, slots or global scope.
- **Extensible:** add managers, backends, serializers, scene component codecs, variable types and settings sections.
- **Utilities:** encryption, compression and atomic writes, reusable in your code.
- **Editor API:** automate setup, build your own tools and inspectors.
- **Create menu:** an asset of any persistent class, no `[CreateAssetMenu]` needed.
- **Version control:** works with a default Unity .gitignore.

</div>
</details>

<details class="patch-note">
<summary><strong>Capabilities</strong></summary>
<div class="patch-note-body" markdown="1">

- **Per platform:** a storage per platform or store distribution, set up in one click.
- **Autosave:** on focus loss, pause, quit and slot change, plus an optional timer, or off.
- **Save slots:** opt-in per asset, listed without loading them, with a thumbnail and chosen values.
- **Slot operations:** create, copy, rename, delete, load from, save to.
- **Quick save:** rotating slots.
- **Continue / New Game:** each asset knows if it loaded a save or started fresh.
- **Global access:** find a persistent asset from any script by type or interface.
- **Sync or async:** per manager, overridable per call. Await, callback or coroutine, with a typed result.
- **Readiness:** each asset reports if it is ready, and why not.
- **Snapshots:** capture values, restore them later.
- **Reset:** some or all fields back to your authored values.
- **Offline play:** remote saves cached locally, pushed when back online.
- **Save conflicts:** merge both saves, ask the player, or keep the newest.
- **Player data requests:** export any slot as portable text, erase everything a player saved.

</div>
</details>

<details class="patch-note">
<summary><strong>Reliability</strong></summary>
<div class="patch-note-body" markdown="1">

- **Atomic writes:** plus a backup, so an interrupted write keeps the previous save.
- **Save on quit:** waits for in-flight saves, up to a timeout.
- **Failed loads:** saving blocked until loaded, so defaults never overwrite a save.
- **Corrupt saves:** reported as corrupt, not as missing.
- **Data migration:** read saves from older versions of your class.
- **Newer saves:** choose whether an older build may overwrite a newer save.
- **Setup changes:** changing a manager or serializer after release migrates old saves automatically.
- **Manager locking:** release builds lock settings that would orphan shipped saves. One toggle unlocks.
- **Operation queue:** one at a time per manager, duplicate saves merged, no late load on the wrong slot.
- **Stable identity:** rename or move an asset or scene object, no save lost.
- **Portable saves:** across machines and OSes, cloud sync, or a text editor.
- **Exceptions in your callbacks:** caught and logged, the operation completes.
- **Timeouts and retries:** per operation, initial load retried automatically.
- **Build validation:** a broken setup fails the build at start (shared storage, Test manager in release, unsupported platform, duplicate scene ids...).
- **Play mode:** assets revert to authored values on exit, or after an Editor crash.
- **Tests:** 3,000+ EditMode and PlayMode tests, most included, run on every Unity minor from 6.0 to 6.6.
- **IL2CPP:** supported with no setup, link.xml generated for you. Odin needs its own AOT step.

</div>
</details>

<details class="patch-note">
<summary><strong>Security</strong></summary>
<div class="patch-note-body" markdown="1">

- **Encryption:** AES-256 and HMAC-SHA256, edited saves refused.
- **Tamper detection:** readable saves, flagged when edited.
- **Save anchoring:** to its device, its location, or a secret your game supplies at runtime.
- **Remote saves:** server copy and local cache encrypted independently.
- **Per-project key:** generated on first run, unique to your project.
- **Your own cheat checks:** integrated into tamper detection.
- **Type injection:** types named in an edited save are checked, unsafe system types refused.
- **Plain HTTP:** the Inspector warns when a release server URL is not HTTPS.

</div>
</details>

<details class="patch-note">
<summary><strong>Performance</strong></summary>
<div class="patch-note-body" markdown="1">

- **Threading:** encryption, compression and I/O run off the main thread on their own (main thread on WebGL). You write no threaded code.
- **Compression:** gzip, local and remote.
- **Lazy loading:** each save loads on first access.
- **No idle allocations:** nothing allocates per frame.
- **Dirty tracking:** optional, skips unchanged saves.
- **Scene saves:** only what changed from the authored scene.

</div>
</details>

<details class="patch-note">
<summary><strong>Quality of Life</strong></summary>
<div class="patch-note-body" markdown="1">

- **Clear Inspectors:** folding groups, problems at the top.
- **Manager Inspector:** status, actions, logs, and any slot's decrypted content with copy, export, import.
- **Save Overview window:** every persistent object with its manager, serializer, storage and problems.
- **Persistent Variables window:** dockable, independent of the selection.
- **Asset References window:** referenceable assets and their build size.
- **Test slot:** start play mode on a slot of your choice.
- **Store simulation:** test a store distribution in the Editor.
- **Fresh start:** Delete Local Data from the menu, or before every Play with one toggle.
- **Separate Editor saves:** Play mode never touches an installed build's saves.
- **Enter Play Mode Options:** supported with Domain Reload off.
- **No bloat:** nothing unrelated to saving.

</div>
</details>

## Content

<details class="patch-note">
<summary><strong>Modules</strong></summary>
<div class="patch-note-body" markdown="1">

**Core**, **Built-Ins**, **No-Code**, **Scene Objects** and **Prefs**, each in its own assemblies. Parts needing another library turn on once it is installed, without compile errors.

</div>
</details>

<details class="patch-note">
<summary><strong>Storage Locations</strong></summary>
<div class="patch-note-body" markdown="1">

9 managers, swapped with a dropdown.

- **Prototype:** local file, no setup.
- **Local File:** folder, file name and extension, backup, encryption, compression.
- **Player Prefs:** small saves on any platform.
- **Server (HTTP):** your server over HTTPS.
- **Cloud Save (UGS):** Unity Gaming Services.
- **Steam Cloud:** synced across the player's devices.
- **Platform (Routing):** a different manager per platform.
- **Session (Memory):** in RAM, cleared on quit.
- **Test:** simulated failures, delays and corrupt saves.

</div>
</details>

<details class="patch-note">
<summary><strong>Backend Services</strong></summary>
<div class="patch-note-body" markdown="1">

- **Recipes tested at release date for the Server (HTTP) manager:** PlayFab, Firebase Firestore, Firebase Realtime Database, Supabase, Nakama, LootLocker, PocketBase, Appwrite, any GraphQL endpoint.
- **Also documented:** Xano, Directus, Strapi, Parse Server, Back4App, Convex, Hasura, Nhost, AWS AppSync, any REST backend, your own database.

</div>
</details>

<details class="patch-note">
<summary><strong>Serialization</strong></summary>
<div class="patch-note-body" markdown="1">

The package integrates the serializer already in your project and improves on it.

- **Unity JSON:** saves exactly what Unity does. Default, no install.
- **Newtonsoft JSON:** types Unity does not serialize, custom converters.
- **Odin:** JSON or binary, with Odin Inspector or the free Odin Serializer.
- **MemoryPack:** binary, no runtime reflection, for `[MemoryPackable]` types. About 8 times smaller and 10 times faster than Unity JSON.
- **Custom:** inherit a class.

</div>
</details>

<details class="patch-note">
<summary><strong>Ready-to-Use GameObjects</strong></summary>
<div class="patch-note-body" markdown="1">

12 pre-wired entries under GameObject > Persistent Asset.

- **uGUI, ready to restyle:** Save, Load, Continue, New Game and Quick Save buttons, Save Menu with thumbnails, Loading Spinner, Conflict Prompt, Drain Display.
- **IMGUI, no Canvas, for development:** Conflict Prompt, Drain Display, and a Debug Overlay (status, actions, save content, logs) stripped from release builds.

</div>
</details>

<details class="patch-note">
<summary><strong>Documentation and Samples</strong></summary>
<div class="patch-note-body" markdown="1">

The guide, manual and API reference ship as offline HTML, opened from Tools > Persistent Asset.

- **Quick Usage Guide:** your first save, step by step.
- **User Manual:** 18 pages, from how saving works to backends, secure saves, slots and troubleshooting.
- **Public API:** every module and the editor extension, plus XML docs on every public member.
- **AI skills:** 8, covering setup, save data, slots and save menus, storage and protection, cloud and remote, No-Code, Scene Objects and troubleshooting.
- **Demo:** a 4-scene sample game (main menu, profile select, level select, game) with profiles, slots, options, achievements and migration.

</div>
</details>

## Getting Started

Learn everything you need to create your first save in the [Quick Usage Guide](/persistent-asset/quick-usage-guide/).

Already using another solution? See [How It Compares](/persistent-asset/comparison/) to make sure Persistent Asset is the right fit for your project.

## About

This is the third iteration of a concept I've had in mind for years. I'm proud of what it has become, and I'm committed to continuously improving it!

If you have any questions, feature requests, feedback, or run into a bug, just email me at [justetools@gmail.com](mailto:justetools@gmail.com). I respond within one business day.

I truly hope this package helps you make awesome games :D

## Requirements

Unity 6.0 or later (tested up to 6.6)

Desktop, mobile and WebGL are supported out of the box. Consoles gate saving behind their platform SDK, so there you write a short script calling it and Persistent Asset routes to it like any other storage.

## Learn More

<a href="/persistent-asset/comparison/" class="asset-store-btn asset-store-btn--featured" target="_blank" rel="noopener">How It Compares</a>
<a href="/persistent-asset/quick-usage-guide/" class="asset-store-btn" target="_blank" rel="noopener">Quick Usage Guide</a>
<a href="/persistent-asset/user-manual/" class="asset-store-btn" target="_blank" rel="noopener">User Manual</a>
<a href="/persistent-asset/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>

## Get It

<a href="https://assetstore.unity.com/packages/slug/389310" class="asset-store-btn">View on Unity Asset Store (Paid)</a>
<a href="https://justetools.itch.io/persistent-asset" class="asset-store-btn" target="_blank" rel="noopener">Play Demo</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v2.0.0</strong> <span class="patch-date">September 28, 2026</span></summary>
<div class="patch-note-body" markdown="1">

A big update. The goal was to cover every workflow I could think of or copy from other packages.

Summary:
- **New modules**: Scene Objects and Prefs.
- **No-code completeness**: new components give access to all operations.
- **Ready-made GameObjects**: save menu, feedback, conflict prompt, drain display.
- **New serializers**: MemoryPack and raw Odin Binary.
- **New managers**: Steam Cloud and Platform (Routing), plus HTTP service templating.
- **Remote managers**: remote encryption, and conflict resolution.
- **New tools**: Save Overview window, Save Data section, debug overlay.
- **Inspectors**: reworked across the package to be coherent and fancier.

New Features:
- Added the **Scene Objects** module. `PersistentSceneObject` saves a GameObject's ticked components, its parenting, and objects spawned or destroyed at runtime, into a `PersistentSceneState` asset.
- Added the **Prefs** module. `Prefs.Set` and `Prefs.Get` save a named value with no class, asset or reference to set up.
- Added `PersistenceOperationControl` and `PersistenceOperationListener`, which make every operation, slot action and event reachable from a UnityEvent.
- Added `PersistentVariablesSlotRegistry`, `SlotList` and `SlotListRow`, which list saved slots with their thumbnail and preview values.
- Added twelve `GameObject > Persistent Asset` menu entries that build the save UI, already wired.
- Added `PersistenceConflictListener` and `PersistenceDrainListener`, which drive a conflict prompt or drain display of your own design, so a gamepad can answer it.
- Added `MemoryPackDataSerializer`.
- `OdinDataSerializer` in Binary mode now writes raw bytes, a third smaller.
- `OdinDataSerializer` now refuses to build unsafe system types when reading a save.
- Added `SteamCloudPersistenceManager`, which saves through Steam Remote Storage.
- Added `PlatformPersistenceManager`, which routes to a different manager per platform.
- Added a per-operation address, verb, body and response path to `HttpPersistenceManager`, plus per-manager credentials.
- Added `Encryption` and `AnchorSaveTo` to `RemotePersistenceManager`, with `CacheEncryption` and `CacheAnchorSaveTo` for the offline cache.
- Added `IMergeable` and `ConflictPolicy.Ask`, with a `PersistenceConflictPrompt` panel to answer it.
- Added the Save Overview window, listing every persistent object in the project.
- Added a Save Data section to every manager inspector, with Copy, Export and Import.
- Added status, actions and save data panes to the in-game debug overlay.
- Added `Readiness`, `NotReadyReason`, `DataOrigin` and `OnReadinessChanged`.
- Added `LoadResult.Corrupt` and `Result.IsTimedOut`.
- Added Use Slot and Always Global toggles to every Persistence Manager.
- Added `SaveFolder` and `FileExtension` to `FilePersistenceManager`.
- Added **Create > Persistent Object**, listing every persistent type in the project.
- Rebuilt the Asset References window, which now reports what each registered asset costs the build.
- Added a toggle that runs Delete Local Data between play sessions.
- Added **Tools > Persistent Asset > Actions > Clear Orphaned Locks**.
- Grouped the manager dropdown into Local, Remote and Other.
- A File Name that cannot be saved now fails the build, like Save Folder and File Extension.
- Reworked the Persistence Manager inspector into folding groups, keeping only what a manager cannot work without in view. A closed group marks itself `(configured)` when it holds a changed setting, and carries the console icon when something inside it needs attention.
- Moved everything wrong with a manager into one block at the top of its inspector, overridable through `DrawProblems`. `PersistentAssetEditorGUI.GroupScope` draws the same group in an editor of your own.
- Gave the package's components and persistent objects the same banded sections as the managers, and gave every package script its own icon.

Removed:
- `IMultiSlot` and `IAlwaysGlobal`. Use Slot and Always Global are per-manager toggles now. Remove the interface and tick the matching toggle, or your saves move.
- `PersistentSingleton`. **Create > Persistent Object** creates an asset for any type. Derive from `PersistentScriptableObject` and tick **Always Global**.
- `HttpPersistenceManager.UsePostRequests`. Set a verb per operation.
- `PersistentVariables.MapTypesOf`. Use `TryGetMap`.
- The Singleton settings section. Use `General > Generated Assets Folder`.

Breaking Changes:
- Save data, with no migration:
  - `OdinDataSerializer` in Binary mode. Older saves do not load. Json mode, its default, is unaffected.
  - A `RemotePersistenceManager` with `Compression` on. Older remote saves and cache files read as corrupt, and the next save overwrites them. Move players to a new slot, or accept the reset. `None`, its default, is unaffected.
  - A save written with `SaveAnchor.FileLocation` no longer verifies. Under `Encryption.AppendHash` it loads marked as tampered. Leaving the flag off, its default, is unaffected.
- Compilation:
  - A custom `PersistenceManager` now carries the payload as `byte[]`. Save files do not change.
  - A custom `RemotePersistenceManager` backend now carries `byte[]` too.
  - `Serializer`'s two methods now take `object` instead of `UnityEngine.Object`.
  - Moved `PersistentSlotRegistry`, `SlotEntry`, `SaveScreenshot` and `ScreenshotFormat` to the `PersistentAsset` namespace.
  - Renamed `InGameLogsViewer` to `PersistenceDebugOverlay`.
  - Renamed `SaveLock` to `SaveAnchor` and `FilePersistenceManager.LockSaveTo` to `AnchorSaveTo`, so "lock" only names manager locking. Existing managers keep their setting.
  - Moved `Snapshot`, `Restore` and `GetStorageLocation` from `PersistenceManager` to a new `SaveData` static, and renamed fifteen other members. The compiler names every call site.
- Behavior:
  - A Global Identifier no longer makes a Persistent Variables asset global. Always Global does that.
  - Slot operations now queue with every other operation, so `IsBusy` covers them.
  - `VariableMap.Remove(KeyValuePair)` now matches the value as well as the key.
  - Two storage paths differing only by case or by a slash are now a conflict.
  - `GzipUtility.Decompress` now throws on a stream it cannot verify.
  - Moved Auto Lock On Build to a new Editor Helpers settings section. It resets to its default once.
  - `VariableRef.Set` with no variable chosen now does nothing instead of throwing.
  - Moved the Create menu entry for the variables slot registry to **Create > Persistent Asset > Variables Slot Registry**.
  - Moved Asset References from the Actions submenu to **Tools > Persistent Asset > Asset References**.

Bug Fixes:
- `UnityJsonSerializer` no longer clears asset references on the live object while it writes a save.
- In a player, the first automatic load no longer runs before its settings arrive and writes an empty asset reference over a real one.
- Deriving an encryption key before those settings arrive no longer falls back to a secret every project shares.
- A `JsonConverter` of your own now runs for a member holding a `UnityEngine.Object`.
- An `IUpgradable.Upgrade` that fails partway no longer reports a successful load and lets the next save overwrite the file.
- Clicks over the debug overlay no longer reach the game's UI behind it.
- An encrypted save can now be written asynchronously in the editor.
- An undefined enum value in a `PersistentVariables` asset is no longer written in the machine's language.
- `VariableList` and `VariableMap` now drop an element they cannot read instead of failing the load.
- Applying a Unity Preset to a Persistence Manager no longer points it at another object's saves. Built-in managers now refuse Presets; add `[ExcludeFromPreset]` to a manager of your own.
- The editor now refuses an asset name a Windows checkout could not hold.
- A truncated compressed save now fails to load instead of loading partial data.

Documentation:
- New quick usage guide.
- The user manual and the public API reference were improved.

</div>
</details>

<details class="patch-note">
<summary><strong>v1.1.0</strong> <span class="patch-date">August 19, 2026</span></summary>
<div class="patch-note-body" markdown="1">

New Features:
- **Saved asset references**: a field pointing at a project asset (the equipped weapon, the selected skin, the unlocked levels) now saves and loads like any other field, with nothing to wrap or declare. What is written is a stable id, resolved back on load through a new project-wide **asset registry**.
  - Assets assigned to a persistent object in the inspector are registered automatically.
  - Assets your code picks at runtime are covered by **Registered Folders**, in the new `Project Settings > Persistent Asset > Asset References` section.
  - **Tools > Persistent Asset > Actions > Asset References** lists everything registered and why.
  - `AssetRegistry` (runtime lookup) and `AssetRegistration` (editor registration) are public, for custom serializers and editor tooling.
  - A deleted asset reads back as `null` and is reported once in the console; nothing else in the save is affected.
- **Newtonsoft JSON serializer**: appears in the serializer dropdown as soon as `com.unity.nuget.newtonsoft-json` is in the project. It writes everything Unity writes plus dictionaries, properties, nullables and plain C# objects, with optional **Shared References** and **Polymorphic Types**, in Pretty Print, One Line or Obfuscated format.
- **Odin serializer**: appears as soon as Odin is in the project, either the serializer bundled with Odin Inspector or the free standalone Odin Serializer. Shared references and polymorphic types are handled by Odin itself, in Json (readable, and the only format save upgrades can read old values from) or Binary format.
- **Asset variables in No-Code**: a Persistent Variable can now hold a project asset. Pick **Asset** in the type menu, choose the kind of asset it accepts, and it takes an object field like any inspector reference.
- **New helpers for custom serializers**: `SaveNodeJson.Parse` reads JSON text into a `SaveNode` tree (to implement `ParseToNode`, what lets save upgrades and field resets recover old values), and `FieldSnapshot.Capture` / `Restore` copies a target's fields and puts them back, so a failed deserialize leaves it unchanged.
- **1,700+ automated tests**, up from 1,600+, now covering the two new serializers and asset references.

Breaking Changes:
- `[RequiredSerializer]` is now inherited by subclasses instead of being redeclarable: a subclass declaring a *different* serializer is a data-format conflict, and is reported as an error in the console.
- `VariableTypes.All` no longer lists asset types, which are resolved on demand (as unregistered enums already were). `VariableTypes.AssetId(Type)` returns the id an asset type's references are stored under.

Documentation:
- New **Serializers** page: what each of the three serializers writes, what it needs, and how switching one on a shipped object migrates existing saves through an import source.
- New **Saving asset references** guide, and a new **Asset References** settings section.
- The Roadmap page was removed from the manual.

</div>
</details>

<details class="patch-note">
<summary><strong>v1.0.0</strong> <span class="patch-date">August 12, 2026</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
