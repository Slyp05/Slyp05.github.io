---
layout: page
title: Selvage
permalink: /selvage/
image: /assets/images/selvage-social.jpg
sitemap: false
description: "Selvage adapts to your project, not the other way around: it injects from your scenes, assets and code, checks every dependency before Play, and handles async loading, pooling, live updates and more."
software:
  name: "Selvage - Native Dependency Injection for Unity"
  store_url: ""
---

<img src="/assets/images/selvage.jpg" alt="Selvage" class="package-image" width="1200" height="800" decoding="async">

**Selvage adapts to your project, not the other way around: it injects from your scenes, assets and code, checks every dependency before Play, and handles async loading, pooling, live updates and more.**

## Description

Selvage gives your scripts everything they need, from your scenes, assets and code, with no wiring to write. Declare what a script needs, and Selvage finds it and hands it over before `Start` runs.

Selvage isn't another container ported from .NET. It's dependency injection designed around how Unity works, so it adapts to your project instead of asking you to restructure it.

## Fits Your Project

Selvage works with the scripts you already have.

Fields and properties stay plain: no base class to inherit, no special method to write, in MonoBehaviours, ScriptableObjects, plain C# classes and even static classes.

`Instantiate` and `new()` work as they always did, and a reference you set in the Inspector is kept.

Prefer no attribute at all? One setting injects your whole project.

No more `GetComponent` calls, `FindAnyObjectByType` searches or singletons wiring in `Awake`.

## Dependencies From Where They Already Live

Selvage takes each dependency from where it already is.

Components come from your scenes, closest first.

Assets come from your folders, Resources and Addressables included, with one small asset per folder, like an assembly definition.

Your own classes need a single attribute, and objects your code creates can be registered container style.

One priority list in Project Settings decides where everything comes from, so changing a source never means changing a script.

## Checked Before You Press Play

Selvage checks every dependency in the Editor.

The Inspector shows whether each one is guaranteed, may be supplied or missing, and one click shows where it comes from.

A missing dependency blocks the build by default, code analysis catches mistakes as you type, and a live view shows what every field holds while your game runs.

No more hunting NullReferenceExceptions.

## Made for How Unity Runs

Unity loads assets in the background, creates and destroys objects all the time, and runs code in Edit mode, and Selvage follows it.

Wait for an Addressables asset with `await`, a coroutine or a callback.

When a dependency is replaced or destroyed, your fields can follow it.

Pass data to what you `Instantiate`, reuse objects from pools, and let what Selvage creates live exactly as long as your scenes and objects need it.

## More Features

- **Lifetimes:** permanent, shared, separate or pooled, for any source.
- **Cleanup:** what Selvage creates is destroyed or disposed once unused. Your own objects are never touched.
- **Several candidates:** the right one is picked from names, classes, tags, scenes and more, without keys.
- **Per-field options:** optional, injected on demand, or a default that steps aside when a dependency arrives.
- **Ready now, better later:** use what's available at once, while the better one loads in the background.
- **Runtime copies:** Play mode never changes your ScriptableObject assets.
- **Edit mode:** inject `[ExecuteAlways]` scripts and editor tools.
- **Swaps without #if:** a replacement class in an Editor or test assembly takes over there.
- **Test doubles:** removed automatically when the test ends.
- **Strict validation:** prove every required dependency in the Editor.
- **Circular dependencies:** shared ones simply work, unlike with constructor injection, and the others are caught and named.
- **Any source:** extend one small class to inject from anywhere.
- **Setups:** save your configuration and apply it to new projects in a click.

## Built to Ship

- **Compiled in:** no reflection, and no link.xml for your scripts under IL2CPP.
- **Fast:** about 2 µs to inject an object with one dependency, with no allocation per injection.
- **Every Unity 6 build target:** Mono and IL2CPP.
- **Fast iteration:** works with Enter Play Mode without Domain Reload.
- **Tested:** on every Unity version from 6.0 to 6.6, with over 1,800 automated tests.

## For Beginners...

Easy to learn and well documented, with a [Quick Usage Guide](/selvage/quick-usage-guide/), a step-by-step tutorial and a playable demo.

## For Experts...

Don't let the ease of use fool you: everything you expect from a DI framework is here, rethought for Unity.

- **Field and property injection:** in any object, static members included.
- **Lifetimes:** singleton, transient and pooled, with scopes that follow your scenes and objects.
- **Type matching:** interfaces, base classes, open generics and decorators.
- **Conditional injection:** by the receiving class, its namespace, its assembly and more.
- **Keyed injection:** as a hint, with keys that can be read at runtime.
- **Collections:** every match, in an array or a list.
- **Factories:** runtime arguments through `new()` and `Instantiate`.
- **Lazy injection:** a field injected only when you ask for it.
- **Async and reactive dependencies:** wait for one, or follow it as it changes.
- **Validation:** the whole graph checked in the Editor, before Play and before every build.
- **Compile-time weaving:** no reflection, IL2CPP safe.
- **Events:** track every dependency created and released.
- **Extensibility:** a small API to inject from any source.

## Compatible With

- **Addressables:** addressable assets load in the background, the first time a field waits for one.
- **Zenject and VContainer:** Selvage runs beside both, so you can migrate one script at a time.

## Included

- **Full documentation:** Quick Usage Guide, User Manual and API reference.
- A playable demo game, built with Unity UI.
- Source code.

## Requirements

- Unity 6.0 or newer.
- Unity's Mono Cecil package, added with the import.

## Learn More

<a href="/selvage/quick-usage-guide/" class="asset-store-btn">Quick Usage Guide</a>
<a href="/selvage/user-manual/" class="asset-store-btn">User Manual</a>
<a href="/selvage/public-api/" class="asset-store-btn">Public API</a>

## Get It

<!-- TODO: unreleased; replace href="#" with the Unity Asset Store URL on release, then set store_url in the front matter above and remove `sitemap: false` (here and the selvage scope in _config.yml). -->
<a href="#" class="asset-store-btn">View on Unity Asset Store</a>

## Support

<a href="/contact/?package=selvage&amp;category=bug" class="asset-store-btn">Report a bug</a>
<a href="/contact/?package=selvage&amp;category=question" class="asset-store-btn">Ask a question</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v1.0.0</strong> <span class="patch-date">Initial release</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
