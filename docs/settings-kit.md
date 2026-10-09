---
layout: page
title: Settings Kit
permalink: /settings-kit/
image: /assets/images/settings-kit-social.jpg
sitemap: false
description: "Project Settings & Preferences pages from one small class. No boilerplate, no Resources folder, and readable at runtime."
software:
  store_url: ""
---

<img src="/assets/images/settings-kit.jpg" alt="Settings Kit" class="package-image" width="1200" height="800" decoding="async">

**Project Settings & Preferences pages from one small class. No boilerplate, no Resources folder, and readable at runtime.**

## Description

Adding a settings page to a Unity project usually means editor boilerplate, a `Resources/` asset to read at runtime, and serialization wired up by hand.

Settings Kit removes all of it: you write one small **page** class and one or more serializable **settings** classes, and your settings appear in the right window, are saved in the right place, reach your builds when they should, and are read with one line of code.

No asset to create, nothing to register, no `Resources/` folder.

- **Little to learn**: a handful of public types cover every feature.
- **Nothing to set up**: settings classes are found automatically, saved in `ProjectSettings/` or `UserSettings/`, and kept in sync as you add or remove them.
- **Readable at runtime**: build settings are loaded into the player before the first scene, so `Settings<T>.Instance` returns the same values in a built game as in the editor.

## Four kinds of settings

The base class an entry inherits decides where it appears, how it is stored, and whether it ships into the build.

- **Build settings** (`BuildSettingsEntry<TPage>`): Project Settings window, committed, shipped into the build, and readable at runtime.
- **Per-platform settings** (`PlatformSettingsEntry<TPage>`): a build setting whose whole set of values can differ per build target, baked to the target at build time.
- **Editor-project settings** (`EditorSettingsEntry<TPage>`): edited under Project Settings, committed for the team, but never shipped.
- **User settings** (`UserSettingsEntry<TPage>`): per-developer, edited under Preferences, never shipped.

## What's Included

- **Declare once, read anywhere**: one `SettingsPage` class plus serializable entries; read them through `Settings<T>.Instance`, in the editor or at runtime.
- **The right window automatically**: build and editor-project entries land under Project Settings, user entries under Preferences, each window showing only its own.
- **Sections, ordering, and tooltips**: an optional `[SettingsDisplay]` attribute sets titles, tooltips, and ordering for pages and sections.
- **Custom rendering**: style any section with an ordinary `PropertyDrawer` on your settings type.
- **Validation**: implement `IValidatedSettings` for an inline help box in the window and a build-time gate that fails the build on invalid build settings.
- **Migration**: `IVersionedSettings` transforms an entry's values forward across schema versions, and a `[SettingsMigrator]` method rescues data from types you deleted.
- **Testing seam**: `Settings.OverrideForTests<T>()` substitutes what `Settings<T>.Instance` returns for the life of a disposable, with no permanent "for tests" setters in the shipped API.
- **Navigation**: `Settings.OpenPage<TPage>()` jumps straight to a page from your own tooling.
- **A Demo folder**: every feature in one place, with a **Tools > Settings Kit > Demo** menu.

## Requirements

Unity 6.0 or later (tested up to 6.6)

## Documentation

<a href="/settings-kit/user-manual/" class="asset-store-btn">User Manual</a>
<a href="/settings-kit/public-api/" class="asset-store-btn">Public API</a>

## Get It

<!-- TODO: unreleased; replace href="#" with the Unity Asset Store URL on release, then set store_url in the front matter above and remove `sitemap: false` (here and the settings-kit scope in _config.yml). -->
<a href="#" class="asset-store-btn">View on Unity Asset Store</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v1.0.0</strong> <span class="patch-date">Initial release</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
