---
layout: page
title: Persistent Asset
permalink: /persistent-asset/
image: /assets/images/persistent-asset.png
software:
  name: "Persistent Asset - Premium Save System"
  description: "A complete save system for Unity: automatic saving, save slots, cloud sync, AES-256 encryption, save versioning and crash-safe writes, with no save code to write."
  price: "49.99"
  store_url: https://assetstore.unity.com/packages/slug/389310
---

<img src="/assets/images/persistent-asset.png" alt="Persistent Asset" class="package-image" width="1950" height="1300" decoding="async">

**A complete save system for Unity. Declare your data once, and it saves itself.**

Write your game data in code, or author it in the inspector with no scripting at all.  
Either way it persists between sessions, loaded on launch and saved at safe points, with no save files to manage and no serialization to wire up.  
Save, load and clear stay available whenever you want the control, from a call in your code or straight from a button.

## It evolves with your game

- **Prototype**: saving and loading are automatic, nothing to set up or configure, it just works.
- **Ship**: save slots, screenshot thumbnails, rolling autosaves, cloud sync and encryption, without changing what you already built.
- **Live**: old saves upgrade to your new format on load, so an update never invalidates a player's progress.

## It adapts to you

- **Entirely from the inspector**: author saved values, wire them to the UI and react to them, with no scripting.
- **Or from code**: call save, load and clear in whatever style your code uses, on one object or on all of them at once.
- **Save anywhere**: local files, Player Prefs, memory, your own HTTP server or Unity Cloud Save, switched from a dropdown, with offline saves pushed once the connection returns.
- **Serializes the way you already do**: Unity JSON out of the box, plus Newtonsoft and Odin when either is in your project, for dictionaries, interfaces, polymorphism and object graphs. References to your own assets save with any of them.
- **Extend everything**: every built-in piece can be replaced by your own.

## It does what others do not

- **Waits for saves on quit**: a shutdown drain holds the exit until in-flight saves land.
- **Locks saves down**: AES-256 encryption, tamper detection, and locks tying a save to a machine, a file path or a secret only your server knows.
- **Refuses to wipe progress**: an existing save is never overwritten with default values, and a failed load holds saving until a retry recovers the data.
- **Protects shipped saves**: lock your save configuration once players have it, and any change that would orphan their saves offers to migrate them instead.
- **Simulates disaster**: force slow, failed or cancelled operations and check your game handles them.
- **Keeps your data visible**: it lives in a ScriptableObject asset, so you can read and edit it in the inspector, even while the game runs.
- **Shows its work live**: every load and save, with its result, in the inspector or in an overlay on the device.

## It is built to professional standards

- **Cannot corrupt a save**: atomic writes and an automatic backup copy survive a crash or a power loss.
- **Saves without a hitch**: heavy work happens in the background, and saves can be skipped entirely when nothing changed.
- **Fits a studio workflow**: play sessions never dirty your assets, the whole save configuration lives in one committed file, and a broken or test-only setup fails the build instead of reaching players.
- **Tested end to end**: 1,700+ automated tests, every release verified on Unity 6.0 through 6.6, and the full C# source in your project.
- **Documented in depth**: a full user manual and a searchable API reference, in the package and online.

## Support

Questions, issues or feature requests? Email [justetools@gmail.com](mailto:justetools@gmail.com).

## Requirements

Unity 6.0 or later (tested up to 6.6)

Desktop, mobile and WebGL are supported out of the box. Consoles gate saving behind their platform SDK, so there you write a short script calling it and Persistent Asset integrates it like any other storage.

## Learn More

<a href="/persistent-asset/comparison/" class="asset-store-btn asset-store-btn--featured" target="_blank" rel="noopener">How It Compares</a>
<a href="/persistent-asset/user-manual/" class="asset-store-btn" target="_blank" rel="noopener">User Manual</a>
<a href="/persistent-asset/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>

## Get It

<a href="https://assetstore.unity.com/packages/slug/389310" class="asset-store-btn">View on Unity Asset Store ($49.99)</a>
<a href="https://justetools.itch.io/persistent-asset" class="asset-store-btn" target="_blank" rel="noopener">Play Demo</a>

## Patch Notes

<details class="patch-note" open>
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
