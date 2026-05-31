---
layout: page
title: Auto Singleton
permalink: /auto-singleton/
---

<img src="/assets/images/auto-singleton.jpg" alt="Auto Singleton" class="package-image">

The simplest singleton tool on the Asset Store. Add the `[Singleton]` attribute to any class and the asset handles everything: automatic asset generation, cleanup, and polymorphic access at runtime.

Works with both `MonoBehaviour` and `ScriptableObject`.

## Features

- **Attribute-based**: decorate any class with `[Singleton]` to make it a singleton, no boilerplate required
- **Automatic asset generation**: MonoBehaviour singletons are added to a new prefab; ScriptableObjects are instantiated automatically
- **Auto-cleanup**: deleting a singleton script also deletes its associated asset
- **Polymorphism support**: access a singleton instance through a parent class or interface at runtime
- **Dependency injection friendly**: does not tightly couple your code; can replace or complement a DI system
- **No reload on play mode**: works seamlessly without domain reload
- **Inspector integration**: view all singletons in a list and enable/disable them with a single click
- **Inheritable or not**: choose per attribute whether it applies to subclasses

## Documentation

<a href="/auto-singleton/documentation/" class="asset-store-btn" target="_blank">Documentation</a>

## Requirements

- Unity 2021.3.31 or later

## Get It

<a href="https://assetstore.unity.com/packages/tools/utilities/auto-singleton-264895" class="asset-store-btn" target="_blank">View on Unity Asset Store (Free)</a>

---

*Questions or issues? Contact us at [justetools@gmail.com](mailto:justetools@gmail.com)*
