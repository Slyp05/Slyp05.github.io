---
layout: page
title: Understudy
permalink: /understudy/
image: /assets/images/understudy-social.jpg
sitemap: false
description: "Stop rearchitecting your game to test it. Stub Time.deltaTime, Random, physics, singletons and constructors in your unit tests, with no interfaces or wrappers, and catch tests that leak real state."
software:
  name: "Understudy - Mocking for Unity"
  store_url: ""
---

<img src="/assets/images/understudy.jpg" alt="Understudy" class="package-image" width="1200" height="800" decoding="async">

**Stop rearchitecting your game to test it. Stub Time.deltaTime, Random, physics, singletons and constructors in your unit tests, with no interfaces or wrappers, and catch tests that leak real state.**

## Description

Understudy lets a unit test take control of anything the code under test reaches: the frame time, random numbers, raycasts, the main camera, your singletons, constructors, fields and events. The code under test stays exactly as you wrote it.

For example, a test fixes the frame time at 0.5 in one line, and every read of `Time.deltaTime` in the code under test returns 0.5 until the test ends. Nothing else changes.

A mocking framework for Unity developers who write unit tests, who want to start, or who come from NSubstitute and Moq and hit their limits on Unity code.

## Why Unity Code Is Hard to Test

Each script works in the game, and resists a test the moment it reaches something outside it:

- It reads `Time.deltaTime` or `Random.Range`, so its result changes on every run.
- It calls `GameManager.Instance`, so the test needs the whole game set up first.
- It creates its own `SaveSystem` with `new`, or casts a ray with `Physics.Raycast`, so the test writes real files or needs a real scene.

Mocking libraries like NSubstitute and Moq only replace interfaces and virtual methods, so the usual answer is to rewrite all of this behind interfaces before the first test.

## No Rearchitecting

Understudy skips that step: a test decides how anything behaves, right where the code under test calls it.

No interface to extract, no wrapper to write, no dependency injection to set up. The only change a test may ask for is making a private member internal, so the test can reach it.

## Spies, Stubs and Fakes

A test controls a method, field, property or event with one of three stand-ins, each recording what the code under test does with it:

- A **stub** replaces it with the answer the test sets: `Random.Range` always returns 3.
- A **fake** gives a field or property a value of its own: the code under test pauses the game, and the real `Time.timeScale` never changes.
- A **spy** lets the real one run, and records each call.

They work on what game code touches most:

- Unity's statics: `Time`, `Random`, `Physics`, `Input`, `SceneManager`, `PlayerPrefs`.
- The scene, with no scene loaded: `GetComponent`, `Camera.main`, and engine types a test can't build, such as `Collision`.
- Your own classes: methods, constructors, fields, properties, events and singletons.
- One object or all of them: the boss, or every enemy.
- Only some calls: downward raycasts miss, every other raycast is real.
- Objects that read as destroyed, without destroying them.
- Events raised from the test, such as `SceneManager.sceneLoaded`.
- Errors the code under test catches and hides.

Check what was recorded with the NUnit assertions you already know. When one fails, it lists each call the way the code reads, with its result and its line.

## Leak Detection

A test that reads the real clock passes or fails depending on when it runs. A test that writes a static changes the next one. These are the tests that pass on your machine and fail on the build server.

Understudy warns when a test reaches a random value, a clock, input or global state it didn't declare, and names the line. It works on the tests you already have, from the first run after import. One setting turns leaks into test failures for your CI.

## Built on the Unity Test Framework

Tests stay ordinary NUnit tests in the Test Runner, in Edit mode and Play mode, and run headless from the command line. Play mode tests run in players too, Mono and IL2CPP, WebGL included.

Every test starts its spies, stubs and fakes fresh, and they end with their test or fixture, with no cleanup to write. Code analysis catches mistakes as you type, with quick fixes, in Visual Studio, Rider and VS Code.

## New to Unit Testing?

The User Manual's [Write your first test](/understudy/user-manual/pages/Write%20your%20first%20test.html) tutorial walks you through a first passing test, step by step, from creating the test assembly to reading a leak warning. No testing experience needed.

## Coming from NSubstitute or Moq?

The ideas are the ones you know: fixed and computed results, argument matchers, recorded calls, raised events. The User Manual translates each NSubstitute and Moq call into Understudy, and lists the few differences to expect.

## For Experts...

- Indexers, array elements, operators, `out` and `ref` parameters, sequences and computed results.
- A separate stub or fake for each object, with the object passed to computed results.
- Virtual and interface members matched by the method that runs, whatever type the call goes through.
- Generic methods, extension methods, structs changed in place.
- Calls from the engine recorded too: Unity messages, Inspector-wired UnityEvents, `SendMessage`, reflection.
- One call order shared by every spy, stub and fake, for ordering assertions.
- Reuse spies, stubs and fakes across tests: group them in a plain C# class of your own.
- Async tests, `UnityTest` coroutines, spies, stubs and fakes shared by a whole fixture.
- Declare your own non-deterministic members, such as a server clock, for leak detection.

## Your Released Game Is Unchanged

Understudy only works inside your tests. Outside them, in the Editor and in the game you ship, your scripts run exactly as you wrote them, and the game you ship contains none of Understudy.

## Included

- **Full documentation:** Quick Usage Guide, User Manual with a beginner tutorial, and API reference.
- Source code.
- Over 1,700 automated tests.

## Requirements

- Unity 6.0 or newer.
- The Unity Test Framework package, installed by default.
- Unity's Mono Cecil package, added with the import.

## Learn More

<a href="/understudy/quick-usage-guide/" class="asset-store-btn">Quick Usage Guide</a>
<a href="/understudy/user-manual/" class="asset-store-btn">User Manual</a>
<a href="/understudy/public-api/" class="asset-store-btn">Public API</a>

## Get It

<!-- TODO: unreleased; on release set store_url in the front matter above (the button below switches to the store link) and remove `sitemap: false` (here and the understudy scope in _config.yml). -->
{% include store-button.html %}

## Support

<a href="/contact/?package=understudy&amp;category=bug" class="asset-store-btn">Report a bug</a>
<a href="/contact/?package=understudy&amp;category=question" class="asset-store-btn">Ask a question</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v1.0.0</strong> <span class="patch-date">Initial release</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
