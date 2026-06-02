---
layout: page
title: Generic Arithmetic
permalink: /generic-arithmetic/
---

<img src="/assets/images/generic-arithmetic.jpg" alt="Generic Arithmetic" class="package-image">

Arithmetic and comparison operations in generic C# classes. Works with any numeric or operator-enabled type, with no additional setup required.  
Built-in computators cover all Unity numeric and vector types; a Roslyn source generator adds AOT-safe support for custom types.

## Features

- **Full operator coverage**: all C# arithmetic (`+`, `-`, `*`, `/`, `%`), bitwise (`&`, `|`, `^`), unary, shift, and comparison operators, plus boolean evaluation (`operator true` / `operator false`)
- **Any numeric or operator-enabled type**: built-in computators cover `int`, `float`, `double`, `long`, `Vector2`, `Vector3`, and all other Unity numeric and vector types; custom types are supported via source generator or manual computators
- **Two usage styles**: wrap values in `Computable<T>` to use standard C# operator syntax inline, or call `Calculate<TResult>` and `Evaluate` static methods directly for explicit result-type control and cross-type operations
- **Source generator**: the `[GenerateComputators]` assembly-level attribute generates AOT-safe computators at compile time; the recommended approach for IL2CPP builds
- **Manual computators**: extend `BinaryCalculator`, `UnaryCalculator`, `BinaryEvaluator`, or `UnaryEvaluator` for full control over how each operation is implemented; discovered automatically at startup, no registration required
- **Try methods**: non-throwing variants of every `Calculate<T>` and `Evaluate` method return `false` instead of throwing when an operation is not supported for the given types
- **Configurable fallback**: choose `Throw`, `Dynamic`, or `Expression` behavior for types without a registered computator, set per-project in the Configuration inspector
- **Editor tooling**: bulk tests window to run all registered computators against a predefined value set and review color-coded results; creator tool to generate manual computator scripts from a window

## Content

- **`Computable<T>` struct**: lightweight value wrapper exposing all operators directly; implicit conversions to/from `T` and cross-type `From` / `To` casting
- **`Calculate<TResult>` and `Evaluate` static classes**: method-call API for binary and unary operations with explicit result types; each has a nested `Try` class for non-throwing access
- **Computator system**: built-in computators for all Unity numeric and vector types; `[GenerateComputators]` Roslyn source generator; four abstract base classes (`BinaryCalculator`, `UnaryCalculator`, `BinaryEvaluator`, `UnaryEvaluator`) for manual implementation
- **Configuration inspector**: per-project fallback strategy and view of all registered built-in and user computators
- **Tests**: NUnit test suite and a bulk tests window covering all computator type combinations
- **Demo**: a benchmark scene comparing non-generic, naive generic, `Computable<T>`, and `Calculate<T>` approaches

## Requirements

Unity 6.0 or later

## Documentation

<a href="/generic-arithmetic/documentation/" class="asset-store-btn">Documentation</a>
<a href="/generic-arithmetic/public-api/" class="asset-store-btn">Public API</a>

## Get It

<a href="https://assetstore.unity.com/packages/tools/utilities/generic-arithmetic-c-template-extension-265011" class="asset-store-btn">View on Unity Asset Store (Free)</a>

## Patch Notes

**v1.1.0** (January 2, 2024)
- Added Try versions of all methods in Calculate and Evaluate
- Added a new overload to `Computable<T>.From` that takes a T as a parameter (same behaviour as the constructor)
- Small improvements to the documentation

**v1.0.0** - Initial release
