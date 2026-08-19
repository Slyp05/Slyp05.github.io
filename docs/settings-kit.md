---
layout: page
title: Settings Kit
permalink: /settings-kit/
image: /assets/images/settings-kit.jpg
sitemap: false
description: "Declare Project Settings and Preferences pages in Unity from a small class, read them anywhere including at runtime in a built player, with no editor boilerplate and nothing under Resources/."
software:
  price: "0"
  store_url: ""
---

<img src="/assets/images/settings-kit.jpg" alt="Settings Kit" class="package-image" width="1200" height="800" decoding="async">

Adding a settings page to a Unity project usually means editor boilerplate, a `Resources/` asset to read at runtime, and serialization wired up by hand. Settings Kit removes all of it: you write one small **page** class and one or more serializable **entry** classes, and from that alone your settings appear in the right window, are stored in the right place, ship into builds when appropriate, and are read through a tiny static API.

No registration step, no `Resources/` folder, no runtime plumbing.

## Built for package makers

Settings Kit suits any project that wants clean, version-control-friendly settings: declare a page and your settings surface in the editor and travel with the build. It is a good fit too when you maintain tools or systems shared across your projects and each one needs its own configuration.

- **A small surface by design**: only a handful of public types, so there is little to learn and your settings code stays stable as the package grows.
- **No boilerplate, no Resources**: entry types are discovered automatically, stored once, and kept in sync as you add or remove them.
- **Readable at runtime**: build settings are injected into the player automatically, so `Settings<T>.Instance` returns the same values in a built game, optimized to a plain field read.

## Four kinds of settings

The base class an entry inherits decides where it appears, how it is stored, and whether it ships into the build.

- **Build settings** (`SettingsEntry<TPage>`): Project Settings window, committed, shipped into the build, and readable at runtime.
- **Per-platform settings** (`PlatformSettingsEntry<TPage>`): a build setting whose whole set of values can differ per build target, baked to the target at build time.
- **Editor-project settings** (`EditorSettingsEntry<TPage>`): edited under Project Settings, committed for the team, but never shipped.
- **User settings** (`UserSettingsEntry<TPage>`): per-developer, edited under Preferences, never shipped.

## What's Included

- **Declare once, read anywhere**: one `SettingsPage` class plus serializable entries; read them through `Settings<T>.Instance`, in the editor or at runtime.
- **The right window automatically**: build and editor-project entries land under Project Settings, user entries under Preferences, each window showing only its own.
- **Sections, ordering, and tooltips**: an optional `[SettingsDisplay]` attribute sets titles, tooltips, and ordering for pages and sections.
- **Custom rendering**: style any section with an ordinary `PropertyDrawer` on your settings type.
- **Validation**: implement `IValidatedSettings` for an inline help box in the window and a build-time gate that fails the build on invalid build settings.
- **Migration**: `IVersionedSettings` transforms an entry's values forward across schema versions, and `ISettingsMigrator` rescues data from types you deleted.
- **Testing seam**: `Settings.OverrideForTests<T>()` substitutes what `Settings<T>.Instance` returns for the life of a disposable, with no permanent "for tests" setters in the shipped API.
- **Navigation**: `Settings.OpenPage<TPage>()` jumps straight to a page from your own tooling.
- **A Showcase sample**: every feature in one place, imported from the Package Manager.

## Requirements

Unity 6.0 or later (tested up to 6.6)

## Documentation

<a href="/settings-kit/documentation/" class="asset-store-btn" target="_blank" rel="noopener">Documentation</a>
<a href="/settings-kit/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>

## Get It

<!-- TODO: unreleased; replace href="#" with the Unity Asset Store URL on release, then set store_url in the front matter above and remove `sitemap: false` (here and the settings-kit scope in _config.yml). -->
<a href="#" class="asset-store-btn">View on Unity Asset Store (Free)</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v1.0.0</strong> <span class="patch-date">Initial release</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
