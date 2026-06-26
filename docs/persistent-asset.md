---
layout: page
title: Persistent Asset
permalink: /persistent-asset/
image: /assets/images/persistent-asset.png
sitemap: false
software:
  description: "A ScriptableObject-based save system for Unity: the asset you read at runtime is the one that saves itself. Automatic, no-code-friendly, cloud-ready, and extensible."
  price: "49.99"
  store_url: ""
---

<img src="/assets/images/persistent-asset.png" alt="Persistent Asset" class="package-image" width="1950" height="1300" decoding="async">

Most save systems mean data classes to maintain, save files to keep in sync, and serialization to wire up by hand. Persistent Asset removes all of it: the ScriptableObject you already read and write at runtime is the one that saves and loads itself.  
No save code, no boilerplate, no rewrites as your project grows.  
It is automatic and no-code-friendly to start, and becomes cloud-ready and extensible as you scale.

## It grows with your project

- **Prototyping:** inherit `PersistentScriptableObject` and you're done; it saves to disk on its own, with no configuration.
- **Designers:** no coding needed. Author variables, bind them to UI, and save settings from the Inspector, with live tools to watch it work while you play.
- **Mid-size projects:** you won't outgrow it. Real save files, slots, and cloud sync are a setting away on the same objects, never a rewrite.
- **Large projects:** extension points throughout. Swap the storage, serializer, or save format; add your own data types and save policies; and hook into events and interfaces.
- **Live games:** ship updates without breaking existing player saves; built-in versioning upgrades old saves to your new format the moment they load.

## Built to be trusted

A save system that loses progress is worthless, so reliability is the core design goal. Saves are written atomically with an automatic backup copy, so a crash or power loss can't corrupt them, and Persistent Asset never overwrites a real save with default values. An extensive suite of 1,300+ automated EditMode and PlayMode tests covers the operations, serialization, slots, and security end to end.

## What's Included

- **Own and edit everything**: full C# source with no mandatory dependencies; Mono and IL2CPP/AOT ready.
- **Ship on every platform**: desktop, mobile, and WebGL, with autosave on mobile focus-loss and pause, and WebGL writes flushed to the browser's IndexedDB.
- **Save without writing save code**: `PersistentScriptableObject` and a full save API, save slots with metadata, global events, typed results, and opt-in interfaces for advanced behaviour.
- **Move saves anywhere without a rewrite**: storage backends you swap from a dropdown: Prototype, local File, PlayerPrefs, Session, a self-hosted HTTP server, and Unity Cloud Save.
- **Keep saves safe from cheaters**: AES-256 encryption, tamper-detection, and device locks.
- **Never strand a shipped save**: lock a manager once it ships, and any change that would orphan existing saves prompts you to migrate them instead of silently wiping them.
- **Upgrade saves across updates**: when your data changes between releases, old saves migrate to the new format on load, so an update never invalidates existing progress.
- **Reset and roll back**: reset to defaults, or snapshot and restore in memory.
- **Save with no frame stutter**: off-thread background saving, gzip compression, and optional dirty-checking that skips no-op saves.
- **Let designers ship settings without code**: persistent variables, observable values, and UI binder components, plus optional Input System and Localization bindings.
- **Debug saves at a glance**: live save status and log, a failure-simulation test mode, and a one-click local-save wipe, on extendable inspectors and drawers.
- **Extras**: save-screenshot capture for slot thumbnails, a persistent-singleton helper, and a playable demo game.

## Requirements

Unity 6.0 or later (tested up to 6.6)

## Learn More

<a href="/persistent-asset/user-manual/" class="asset-store-btn" target="_blank" rel="noopener">User Manual</a>
<a href="/persistent-asset/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>
<a href="/persistent-asset/comparison/" class="asset-store-btn asset-store-btn--featured" target="_blank" rel="noopener">How It Compares</a>

## Get It

<!-- TODO: unreleased; replace href="#" with the Unity Asset Store URL on release, then set store_url in the front matter above and remove `sitemap: false` (here and the persistent-asset scope in _config.yml). -->
<a href="#" class="asset-store-btn">View on Unity Asset Store ($49.99)</a>
<a href="https://justetools.itch.io/persistent-asset" class="asset-store-btn">Play Demo</a>

## Patch Notes

**v1.0.0** - Initial release
