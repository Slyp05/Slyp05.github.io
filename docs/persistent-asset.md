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

Persistent Asset is a ScriptableObject-based save system for Unity: the very asset you read and write at runtime is the one that saves and loads itself.  
Stop writing save code: there are no data classes to maintain, nothing to mirror into save files, and no serialization to wire up.  
It is automatic and no-code-friendly to start, and becomes cloud-ready and extensible as your project scales.

## It grows with your project

- **Prototyping:** inherit `PersistentScriptableObject` and you're done; it saves to disk on its own, with no configuration.
- **Designers:** no coding needed. Author variables, bind them to UI, and save settings from the Inspector, with live tools to watch it work while you play.
- **Mid-size projects:** you won't outgrow it. Real save files, slots, and cloud sync are a setting away on the same objects, never a rewrite.
- **Large projects:** extension points throughout. Swap the storage, serializer, or save format; add your own data types and save policies; and hook into events and interfaces.
- **Live games:** ship updates without breaking existing player saves; built-in versioning upgrades old saves to your new format the moment they load.

## Built to be trusted

A save system that loses progress is worthless, so reliability is the core design goal. Saves are written atomically with an automatic backup copy, so a crash or power loss can't corrupt them, and Persistent Asset never overwrites a real save with default values. An extensive suite of 1,300+ automated EditMode and PlayMode tests covers the operations, serialization, slots, and security end to end.

## What's Included

- **Full C# source** with no mandatory dependencies; Mono and IL2CPP/AOT ready.
- **Cross-platform**: desktop, mobile, and WebGL, with autosave on mobile focus-loss and pause, and WebGL writes flushed to the browser's IndexedDB.
- **`PersistentScriptableObject` and the save API**: managers, save slots with metadata, global events, typed results, and opt-in interfaces for advanced behaviour.
- **Storage backends** you swap from a dropdown: Prototype, local File, PlayerPrefs, Session, a self-hosted HTTP server, and Unity Cloud Save.
- **Security**: AES-256 encryption, tamper-detection, and device locks.
- **Recovery & versioning**: reset-to-defaults and checkpoints, save upgrades after a game update, and a readiness signal that tells you when async or cloud data is loaded.
- **Performance**: off-thread background saving, gzip compression, and optional dirty-checking that skips no-op saves.
- **No-Code module**: persistent variables, observable values, and UI binder components, plus optional Input System and Localization bindings.
- **Editor tooling**: live save status and log, a failure-simulation test mode, and a one-click local-save wipe, on extendable inspectors and drawers.
- **Extras**: save-screenshot capture for slot thumbnails, a persistent-singleton helper, and a playable demo game.

## Requirements

Unity 6.0 or later (tested up to 6.6)

## Learn More

<a href="/persistent-asset/user-manual/" class="asset-store-btn" target="_blank" rel="noopener">User Manual</a>
<a href="/persistent-asset/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>
<a href="/persistent-asset/comparison/" class="asset-store-btn" target="_blank" rel="noopener">How It Compares</a>

## Get It

<!-- TODO: unreleased; replace href="#" with the Unity Asset Store URL on release, then set store_url in the front matter above and remove `sitemap: false` (here and the persistent-asset scope in _config.yml). -->
<a href="#" class="asset-store-btn">View on Unity Asset Store ($49.99)</a>
<a href="https://justetools.itch.io/persistent-asset" class="asset-store-btn">Play Demo</a>

## Patch Notes

**v1.0.0** - Initial release
