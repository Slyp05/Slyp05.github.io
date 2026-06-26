---
layout: page
title: Generic Arithmetic
permalink: /generic-arithmetic/
image: /assets/images/generic-arithmetic.jpg
software:
  description: "Arithmetic and comparison operations in generic C# classes for Unity. Works with any value type, with a Roslyn source generator for AOT-safe custom types."
  price: "0"
  store_url: https://assetstore.unity.com/packages/tools/utilities/generic-arithmetic-c-template-extension-265011
---

<img src="/assets/images/generic-arithmetic.jpg" alt="Generic Arithmetic" class="package-image" width="1950" height="1300" decoding="async">

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

Unity 6.0 or later (tested up to 6.5)

## Documentation

<a href="/generic-arithmetic/documentation/" class="asset-store-btn" target="_blank" rel="noopener">Documentation</a>
<a href="/generic-arithmetic/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>

## Get It

<a href="https://assetstore.unity.com/packages/tools/utilities/generic-arithmetic-c-template-extension-265011" class="asset-store-btn">View on Unity Asset Store (Free)</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v2.0.0</strong> <span class="patch-date">June 2, 2026</span></summary>
<div class="patch-note-body" markdown="1">

New Features:
- **Source generator**: add `[assembly: GenerateComputators(typeof(T))]` to any script to generate all four computator classes at compile time, with no runtime reflection or expression compilation. AOT/IL2CPP-safe. A three-type form is also available for cross-type operations.
- **Create Manual Computator Script**: new editor window under `Tools > Generic Arithmetic > Create Manual Computator Script`. Enter a type name, pick an output folder, and click Create; the file opens automatically.
- **`Math<T>` utility class**: generic equivalents of `Mathf` and `System.Math`, built on `Calculate<T>` and `Evaluate`. Includes typed constants (`Zero`, `One`, `PI`, `E`, `Deg2Rad`, `Rad2Deg`) and methods spanning basic math (`Abs`, `Sign`, `Min`, `Max`, `Clamp`, `Approximately`), interpolation (`Lerp`, `LerpUnclamped`, `InverseLerp`, `LerpAngle`, `MoveTowards`, `MoveTowardsAngle`, `SmoothStep`), periodic utilities (`Repeat`, `PingPong`, `DeltaAngle`), rounding (`Floor`, `Ceiling`, `Round`, `Truncate`), powers and roots (`Sqrt`, `Cbrt`, `Pow`, `Exp`), logarithms (`Log`, `Log2`, `Log10`), and trigonometry including hyperbolic functions. A nested `Math<T>.Try` class provides non-throwing versions of every method.
- Added unit tests covering `Computable<T>`, `Calculate<T>.Try`, `Evaluate.Try`, `Math<T>`, and `Math<T>.Try`.

Breaking Changes:
- The four computator base classes have been renamed for consistency: `DuoCalculator` → `UnaryCalculator`, `TrioCalculator` → `BinaryCalculator`, `DuoEvaluator` → `BinaryEvaluator`, `SoloEvaluator` → `UnaryEvaluator`.
- `BinaryCalculator.Addition` and `Calculate<TResult>.Addition` renamed to `Add`.
- `Calculate<TResult>.Try` and `Evaluate.Try` changed from nested structs to nested static classes (call syntax is unchanged).

Changes:
- Error messages when a computator is missing now include the exact base class to derive from.
- The "Unit Tests" window has been renamed to "Bulk Tests" and expanded with more values per type and a filter dropdown.
- `Computable<T>.ToString()` now forwards to the underlying value.

Bug Fixes:
- `Computable<T>.GetHashCode()` no longer throws when `T` is a reference type and the value is `null`.
- `operator true` / `operator false` now produce correct results with the Dynamic computator for types that define those operators without an implicit cast to `bool`.
- Unary `+` and `-` operator lookup was using wrong reflection names, causing expression fallback to fail for custom types.

</div>
</details>

<details class="patch-note">
<summary><strong>v1.1.0</strong> <span class="patch-date">January 2, 2024</span></summary>
<div class="patch-note-body" markdown="1">

- Added Try versions of all methods in Calculate and Evaluate
- Added a new overload to `Computable<T>.From` that takes a T as a parameter (same behaviour as the constructor)
- Small improvements to the documentation

</div>
</details>

<details class="patch-note">
<summary><strong>v1.0.0</strong> <span class="patch-date">October 23, 2023</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
