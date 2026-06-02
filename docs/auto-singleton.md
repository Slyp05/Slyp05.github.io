---
layout: page
title: Auto Singleton
permalink: /auto-singleton/
---

<img src="/assets/images/auto-singleton.jpg" alt="Auto Singleton" class="package-image">

The simplest singleton tool on the Asset Store. Add the `[Singleton]` attribute to any class and the asset handles everything: automatic asset generation, cleanup, and polymorphic access at runtime.

Works with both `MonoBehaviour` and `ScriptableObject`.

## Features

- **Attribute-based setup**: decorate any `MonoBehaviour` or `ScriptableObject` with `[Singleton]` — no base classes, no boilerplate; optional `inherited`, `displayName`, and `folderPath` arguments for fine-grained control
- **Automatic asset management**: the editor creates and maintains prefabs (MonoBehaviour) or ScriptableObject assets after each compilation; deleting a singleton class also deletes its asset
- **Polymorphic access**: retrieve all singletons assignable to a type via `Singleton<T>.Instances`; `T` can be a base class or an interface
- **Instance selection**: designate which instance `Singleton<T>.Instance` returns using `SelectInstance` — by predicate, priority function, runtime type, direct reference, or no-arg when only one is registered
- **Safe access helpers**: `HasInstance` and `TryGetInstance` let you check availability without catching exceptions; `Find` returns all instances matching a predicate
- **Manual registration**: use `Singleton.Add` and `Singleton.Remove` at runtime to manage singletons of any reference type, not just Unity objects
- **No reload on play mode**: works seamlessly with Unity's no-domain-reload setting
- **Editor tooling**: Top Bar menu with force-refresh, automatic refresh, change logging, and project icon toggles; singleton list inspector to view and enable/disable each singleton individually

## Content

- **Singleton attribute**: `SingletonAttribute` for automatic asset management, with `inherited`, `displayName`, and `folderPath` options
- **Runtime access classes**: `Singleton` (manual `Add` / `Remove`) and `Singleton<T>` (`Instance`, `Instances`, `HasInstance`, `TryGetInstance`, `Find`, `SelectInstance`)
- **Editor tooling**: automatic refresh system, singleton list inspector, project icons
- **Demo**: a Tic Tac Toe game built with MVC, demonstrating 5 singletons across `MonoBehaviour`, `ScriptableObject`, and plain class types

## Requirements

Unity 6.0 or later

## Documentation

<a href="/auto-singleton/documentation/" class="asset-store-btn">Documentation</a>
<a href="/auto-singleton/public-api/" class="asset-store-btn">Public API</a>

## Get It

<a href="https://assetstore.unity.com/packages/tools/utilities/auto-singleton-264895" class="asset-store-btn">View on Unity Asset Store (Free)</a>

## Patch Notes

**v1.1.0** (January 23, 2026)
- The tool now fully works with no reload on play mode enabled
- Can now add and remove singletons at runtime using new methods, Add and Remove, in the Singleton class
- Removed the Find method from the Singleton class (it still exists in the `Singleton<T>` class)
- Fixed a bug where singleton icons would not appear without an assembly reload
- Fixed a bug happening if you launched the project with compilation errors
- Demo and documentation modified to reflect those changes

**v1.0.0** - Initial release
