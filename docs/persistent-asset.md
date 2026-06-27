---
layout: page
title: Persistent Asset
permalink: /persistent-asset/
image: /assets/images/persistent-asset.png
sitemap: false
software:
  description: "A ScriptableObject-based save system for Unity: the asset you read at runtime is the one that saves and loads itself. Automatic, no-code-friendly, cloud-ready, and extensible."
  price: "49.99"
  store_url: ""
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

A save system that loses progress is worthless, so reliability is the core design goal. File saves are written atomically, with an automatic backup copy, so a crash or power loss leaves the last good save intact instead of a corrupt one, and Persistent Asset never overwrites a real save with default values. An extensive suite of 1,300+ automated EditMode and PlayMode tests covers the operations, readiness, serialization, slots, and security end to end.

## What's Included

*Save anything, your way*

- **Save and load automatically**: your objects load on launch, save at safe points and on a regular timer, and retry a failed load, all on their own with no save code; switch any of it off per manager (the backend that handles where and how each object saves) when you want manual control.
- **Call the save API however you code**: a complete save API you can run fire-and-forget, by callback, synchronously, with `async`/`await`, or from a coroutine, on one object or all at once.
- **Reach for more when you need it**: save slots with metadata, global events, typed results, and opt-in interfaces for advanced behavior.
- **Move saves anywhere without a rewrite**: swap your storage from a dropdown: Local File, Player Prefs, Session, a self-hosted HTTP server, or Unity Cloud Save; the server and cloud backends stay fully playable offline and sync in the background once the connection returns.
- **Let designers ship without code**: hand them persistent variables in 40+ built-in types, observable values, and UI binder components, plus optional Input System and Localization bindings.

*Protect player progress*

- **Save when the player leaves**: autosave when a mobile app loses focus or is paused, and on quit your game waits for any in-flight save to finish rather than dropping it.
- **Keep saves safe from cheaters**: lock your saves down with AES-256 encryption, tamper-detection, and device locks.
- **Never strand a shipped save**: lock a manager once it ships, and any change that would orphan existing saves prompts you to migrate them instead of silently wiping them.
- **Upgrade saves across updates**: when your data changes between releases, old saves migrate to the new format on load, so an update never invalidates existing progress.
- **Reset and roll back**: reset your data to defaults, or snapshot and restore it in memory.

*Built for production*

- **Ship on desktop, mobile, and WebGL**: out of the box, Mono and IL2CPP/AOT ready, with WebGL writes flushed to the browser's IndexedDB; consoles are supported through a small custom manager.
- **Save with no frame stutter**: keep your frame rate smooth with off-thread background saving, gzip compression, and optional dirty-checking that skips no-op saves.
- **Debug and stress-test your save handling**: live status and a running log, in the inspector or an on-device overlay, a one-click local-save wipe, plus an integration-test manager that forces slow or failed operations, so you can prove your game survives them.
- **Keep version control clean**: runtime play never dirties your authored assets, sparing your diffs play-session noise, and your project settings live in one committed file, so everyone on the team builds with the same configuration, encryption key included.

*Yours to own*

- **Own and edit everything**: full C# source with no mandatory dependencies, and plain, human-readable JSON saves when unencrypted.
- **Get handy extras**: save-screenshot capture for slot thumbnails, a persistent-singleton helper, and a playable demo game.

## Requirements

Unity 6.0 or later (tested up to 6.6)

## Learn More

<a href="/persistent-asset/comparison/" class="asset-store-btn asset-store-btn--featured" target="_blank" rel="noopener">How It Compares</a>
<a href="/persistent-asset/user-manual/" class="asset-store-btn" target="_blank" rel="noopener">User Manual</a>
<a href="/persistent-asset/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>

## Get It

<!-- TODO: unreleased; replace href="#" with the Unity Asset Store URL on release, then set store_url in the front matter above and remove `sitemap: false` (here and the persistent-asset scope in _config.yml). -->
<a href="#" class="asset-store-btn">View on Unity Asset Store ($49.99)</a>
<a href="https://justetools.itch.io/persistent-asset" class="asset-store-btn" target="_blank" rel="noopener">Play Demo</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v1.0.0</strong> <span class="patch-date">Initial release</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
