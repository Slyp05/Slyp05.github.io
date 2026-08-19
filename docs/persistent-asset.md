---
layout: page
title: Persistent Asset
permalink: /persistent-asset/
image: /assets/images/persistent-asset.png
software:
  description: "A ScriptableObject-based save system for Unity: the asset you read at runtime is the one that saves and loads itself. Automatic, no-code-friendly, cloud-ready, and extensible."
  price: "49.99"
  store_url: https://assetstore.unity.com/packages/tools/utilities/persistent-asset-runtime-scriptableobject-saves-389310
---

<img src="/assets/images/persistent-asset.png" alt="Persistent Asset" class="package-image" width="1950" height="1300" decoding="async">

Most save systems mean data classes to maintain, save files to keep in sync, and serialization to wire up by hand. Persistent Asset removes all of it: the ScriptableObject you already read and write at runtime is the one that saves and loads itself.  
No save code, no boilerplate, no rewrites as your project grows.  
It is automatic and no-code-friendly to start, and becomes cloud-ready and extensible as you scale.

New to ScriptableObjects? [Start here](https://justetools.net/persistent-asset/user-manual/pages/What%20is%20a%20ScriptableObject.html).

## It grows with your project

- **Prototyping:** inherit `PersistentScriptableObject` and you're done; it saves to disk on its own, with no configuration.
- **Designers:** no coding needed. Author variables, bind them to UI, and save settings from the Inspector, with live tools to watch it work while you play.
- **Mid-size projects:** you won't outgrow it. Real save files, slots, and cloud sync layer onto the same objects, a dropdown away or a one-line change, never a rewrite.
- **Large projects:** extension points throughout. Swap the storage, serializer, or save format; add your own data types and save policies; and hook into events and interfaces.
- **Live games:** ship updates without breaking existing player saves; built-in versioning upgrades old saves to your new format the moment they load.

## Built to be trusted

A save system that loses progress is worthless, so reliability is the core design goal.

- **Atomic file writes with an automatic backup copy**: a crash or power loss leaves the last good save intact, never a corrupt one.
- **Player progress is never wiped by accident**: an existing save can never be replaced with a blank or freshly reset one.
- **1,700+ automated tests**: an extensive EditMode and PlayMode suite covers operations, serialization, slots, and security end to end.

## What's Included

*Save anything, your way*

- **Save and load automatically**: objects load on launch, save at safe points and on a timer, and retry failed loads, with no save code; switch any of it off when you want manual control.
- **Call the save API however you code**: fire-and-forget, callback, synchronous, `async`/`await`, or coroutine, on one object or all at once.
- **Reach for more when you need it**: save slots with metadata, global events, typed results, and opt-in advanced interfaces.
- **Move saves anywhere without a rewrite**: swap storage from a dropdown: Local File, Player Prefs, Session, self-hosted HTTP server, or Unity Cloud Save; once loaded, the online backends keep working through connection drops and sync in the background when the connection returns.
- **Save what Unity's serialization cannot**: pick the serializer from a dropdown, Unity JSON, Newtonsoft JSON or Odin, and dictionaries, properties, interfaces and shared object graphs save too.
- **Point at your project assets**: a field holding a ScriptableObject or a prefab (the equipped weapon, the unlocked levels) saves and resolves back on load, with nothing to wire.
- **Let designers ship without code**: persistent variables in 40+ built-in types and any project asset, observable values, and UI binder components, plus optional Input System and Localization bindings.

*Protect player progress*

- **Save when the player leaves**: autosave when a mobile app loses focus or is paused; on quit, your game waits for in-flight saves to finish.
- **Keep saves safe from cheaters**: AES-256 encryption, tamper-detection, and device locks.
- **Never strand a shipped save**: lock your save setup once it ships, and any change that would orphan existing saves prompts you to migrate them instead of silently wiping them.
- **Upgrade saves across updates**: old saves migrate to your new format on load, so an update never invalidates existing progress.
- **Reset and roll back**: reset your data to defaults, or snapshot and restore it in memory.

*Built for production*

- **Ship on desktop, mobile, and WebGL**: Mono and IL2CPP/AOT ready, with WebGL writes flushed to the browser's IndexedDB; consoles are supported through a small custom backend.
- **Save with no frame stutter**: off-thread background saving, gzip compression, and optional dirty-checking that skips no-op saves.
- **Debug and stress-test your save handling**: live status and logs in the inspector or an on-device overlay, a one-click local-save wipe, and an integration-test mode that forces slow or failed operations so you can prove your game survives them.
- **Keep version control clean**: runtime play never dirties your authored assets, and your project settings live in one committed file so the whole team builds with the same configuration, encryption key included.

*Yours to own*

- **Own and edit everything**: full C# source, no mandatory dependencies, and human-readable JSON saves when unencrypted.
- **Get handy extras**: save-screenshot capture for slot thumbnails, a persistent-singleton helper, and a playable demo game.

## Requirements

Unity 6.0 or later (tested up to 6.6)

## Learn More

<a href="/persistent-asset/comparison/" class="asset-store-btn asset-store-btn--featured" target="_blank" rel="noopener">How It Compares</a>
<a href="/persistent-asset/user-manual/" class="asset-store-btn" target="_blank" rel="noopener">User Manual</a>
<a href="/persistent-asset/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>

## Get It

<a href="https://assetstore.unity.com/packages/tools/utilities/persistent-asset-runtime-scriptableobject-saves-389310" class="asset-store-btn">View on Unity Asset Store ($49.99)</a>
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
