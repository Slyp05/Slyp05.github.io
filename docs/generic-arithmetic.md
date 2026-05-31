---
layout: page
title: Generic Arithmetic
permalink: /generic-arithmetic/
---

<img src="/assets/images/generic-arithmetic.jpg" alt="Generic Arithmetic" class="package-image">

Arithmetic and comparison operations in generic C# classes. Works with any value type (system primitives, Unity primitives, custom classes or structs, and nullables) with no additional setup required.

## Features

- **All operators**: handles all C# arithmetic operators and functions, in the editor and at runtime
- **Any value type**: system primitives, Unity primitives, custom classes, structs, and nullables
- **Two usage styles**: instantiate a `Computable` or use static classes directly
- **Optimized**: uses reflection and `Linq.Expressions` to compile optimized delegates at runtime; more efficient than raw DLR
- **No setup**: drop in and use immediately
- **Full sources**: 50+ scripts included
- **Unit test window**: included to verify correctness

## Documentation

<a href="/generic-arithmetic/documentation/" class="asset-store-btn">Documentation</a>

## Requirements

- Unity 2021.3.31 or later

## Get It

<a href="https://assetstore.unity.com/packages/tools/utilities/generic-arithmetic-c-template-extension-265011" class="asset-store-btn">View on Unity Asset Store (Free)</a>

## Patch Notes

**v1.1.0** (January 2, 2024)
- Added Try versions of all methods in Calculate and Evaluate
- Added a new overload to `Computable<T>.From` that takes a T as a parameter (same behaviour as the constructor)
- Small improvements to the documentation

**v1.0.0** - Initial release

---

*Questions or issues? Contact us at [justetools@gmail.com](mailto:justetools@gmail.com)*
