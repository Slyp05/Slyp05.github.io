---
layout: page
title: Auto Singleton
permalink: /auto-singleton/
image: /assets/images/auto-singleton.jpg
software:
  description: "Add the [Singleton] attribute to any class and the asset handles automatic asset generation, cleanup, polymorphic access, and inspector integration in Unity."
  price: "0"
  store_url: https://assetstore.unity.com/packages/tools/utilities/auto-singleton-264895
---

<img src="/assets/images/auto-singleton.jpg" alt="Auto Singleton" class="package-image" width="1950" height="1300" decoding="async">

The simplest singleton tool on the Asset Store. Add the `[Singleton]` attribute to any class and the asset handles everything: automatic asset generation, cleanup, and polymorphic access at runtime.

## Features

- **Attribute-based setup**: decorate any `MonoBehaviour` or `ScriptableObject` with `[Singleton]`: no base classes, no boilerplate; optional `inherited`, `displayName`, and `folderPath` arguments for fine-grained control
- **Automatic asset management**: the editor creates and maintains prefabs (MonoBehaviour) or ScriptableObject assets after each compilation; deleting a singleton class also deletes its asset
- **Polymorphic access**: retrieve all singletons assignable to a type via `Singleton<T>.Instances`; `T` can be a base class or an interface
- **Instance selection**: designate which instance `Singleton<T>.Instance` returns using `SelectInstance`: by predicate, priority function, runtime type, direct reference, or no-arg when only one is registered
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

Unity 6.0 or later (tested up to 6.5)

## Documentation

<a href="/auto-singleton/documentation/" class="asset-store-btn" target="_blank" rel="noopener">Documentation</a>
<a href="/auto-singleton/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>

## Get It

<a href="https://assetstore.unity.com/packages/tools/utilities/auto-singleton-264895" class="asset-store-btn">View on Unity Asset Store (Free)</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v1.2.0</strong> <span class="patch-date">June 5, 2026</span></summary>
<div class="patch-note-body" markdown="1">

Breaking Changes:
- The singleton list asset has been renamed to `Auto Singleton List` and moved from `Assets/Auto Singleton/Resources/` to `Assets/Resources/`. Existing projects must move it manually, or delete it and let it be recreated on the next refresh.
- `Singleton<T>.HasInstance` now throws outside of play mode, consistent with `Instance`. Previously it silently returned `false`.
- `Singleton<T>.SelectInstance(Predicate<T>)` now correctly returns `false` when no instance matches the predicate, instead of returning `true` and silently clearing the selected instance.

New:
- Added `Singleton<T>.TryGetInstance(out T instance)`: a non-throwing alternative to `Instance` that returns `false` when no instance is available, safe in both editor and builds.
- `SelectInstance` overloads now log a warning in the editor when returning `false`, making misconfigured or missing setup easier to spot.
- The `Instance` error message when no instance was selected now includes the count of available instances and a hint to call `SelectInstance()`.
- Newly created singleton assets are pinged in the Project window after a refresh.
- The `Auto Singleton List` asset is automatically recreated if accidentally deleted.
- The `Auto Singleton` root GameObject is now created lazily on the first MonoBehaviour singleton instantiation.
- The singleton list ordering is now deterministic, preventing spurious VCS diffs on the `Auto Singleton List` asset.

Bug Fixes:
- MonoBehaviour singleton components were not being saved to their prefab file correctly; they now are.
- Open generic MonoBehaviour subclasses (e.g. `class Foo<T> : MonoBehaviour`) are no longer mistakenly treated as instantiable.
- Singletons registered via `Singleton.Add` no longer appear as stale entries in the inspector after re-entering play mode.
- `SelectInstance` with a numeric priority no longer incorrectly reports a tie when a singleton's priority value equals `int.MinValue` or `float.MinValue`.
- Singleton assets are now deleted through Unity's asset pipeline, preventing stale references.
- The singleton icon now scales correctly with the Project window's zoom level.
- Fixed path issues on Windows that could cause asset operations and the Documentation menu item to fail.

</div>
</details>

<details class="patch-note">
<summary><strong>v1.1.0</strong> <span class="patch-date">January 23, 2026</span></summary>
<div class="patch-note-body" markdown="1">

- The tool now fully works with no reload on play mode enabled
- Can now add and remove singletons at runtime using new methods, Add and Remove, in the Singleton class
- Removed the Find method from the Singleton class (it still exists in the `Singleton<T>` class)
- Fixed a bug where singleton icons would not appear without an assembly reload
- Fixed a bug happening if you launched the project with compilation errors
- Demo and documentation modified to reflect those changes

</div>
</details>

<details class="patch-note">
<summary><strong>v1.0.0</strong> <span class="patch-date">October 19, 2023</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
