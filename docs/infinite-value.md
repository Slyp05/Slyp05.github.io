---
layout: page
title: Infinite Value
permalink: /infinite-value/
---

<img src="/assets/images/infinite-value.png" alt="Infinite Value" class="package-image">

A complete solution for working with numbers of any size and precision in Unity. Perfect for incremental games, RPGs, or any mathematical or monetary application where standard numeric types fall short.

## Features

- **Complete**: define integer or decimal numbers as large or as small as you want, with the sharpest precision
- **Easy to use**: behaves like any other primitive type (`int`, `float`, etc.) and converts to/from them naturally
- **Performant**: designed for real-time use, with specific optimizations for gigantic numbers
- **Configurable**: a configuration file lets you control how values are displayed and customize the inspector drawer
- **Full sources**: all scripts are included with comments and summaries

## Documentation

<a href="/infinite-value/documentation/" class="asset-store-btn">Documentation</a>

## Content

The `InfVal` structure handles any value and supports arithmetic operations, serialization, parsing, and more. A complete demo is also included as a starting point for a clicker game.

## Requirements

- Unity 2020.3.48 or later

## Get It

<a href="https://assetstore.unity.com/packages/tools/integration/infinite-value-bigdecimal-194963" class="asset-store-btn">View on Unity Asset Store (€27.59)</a>

## Patch Notes

**v1.2.1** (September 12, 2023)
- Fixed the Pow method, which could provide wrong results in some cases
- Greatly improved the precision of Pow and NthRoot methods when used with a negative second parameter

**v1.2** (June 15, 2023)

Potentially breaking changes:
- Addition of assembly assets (runtime and editor)
- Explicit implementations for IConvertible and ISerializationCallbackReceiver interfaces
- Casting from string to InfVal is now explicit only
- Removal of the #define based configuration

Major:
- Fixed browser demo
- Optimized Log methods for both large and small values, resulting in improved performance across all cases
- Significantly enhanced Pow method performance in edge cases (up to 10,000 times faster!)

Minor:
- Modified folder hierarchy
- Improved existing comments and added summaries
- Unit test window: adjusted success color to match the pro skin, replaced nested classes with private classes
- Introduced MathBigInteger internal class
- Implemented various small optimizations

Other:
- Updated documentation and API to reflect the aforementioned changes

**v1.1** (May 26, 2021)

This update makes the InfVal structure conserve precision instead of exponent, which is similar to what primitive value types do and simpler to use in most cases. Old usage can still be done using the ToExponent method. It makes the easiest way to use the structure also the most optimized way, allowing you to work with gigantic numbers.

- Constructors and casts now take a precision instead of an exponent as a second parameter. Also added a new constructor and cast taking an InfVal as a first parameter
- Arithmetic operations now conserve the highest precision instead of the lowest exponent
- The CalcType enum no longer exists. The Add, Sub, Mul and Div methods have been deleted because they are no longer required, and the Pow, Sqrt and NthRoot methods now take a bool argument instead of a CalcType
- The ToExp method is renamed to ToExponent; it now accepts an optional bool as a second argument that lets you edit the exponent without changing the digits
- Changing the exponent property has been optimized
- The inspector drawer now has a maximum count of digits displayed and can be used to call the ToPrecision method
- Updated the demo, unit tests window, documentation and API to reflect these changes

**v1.0.0** - Initial release

---

*Questions or issues? Contact us at [justetools@gmail.com](mailto:justetools@gmail.com)*
