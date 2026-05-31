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

<a href="/assets/docs/infinite-value.pdf" class="asset-store-btn">Documentation</a>

## Content

The `InfVal` structure handles any value and supports arithmetic operations, serialization, parsing, and more. A complete demo is also included as a starting point for a clicker game.

## Requirements

- Unity 6.0 or later

## Get It

<a href="https://assetstore.unity.com/packages/tools/integration/infinite-value-bigdecimal-194963" class="asset-store-btn">View on Unity Asset Store ($29.99)</a>

## Patch Notes

**v2.0** (June 1, 2026)

New Features:
- **Formatter system**: format and parse behavior is now driven by `IInfValFormatter` implementations, wrapped in a `FormatterAsset` (`ScriptableObject`). Assign a `FormatterAsset` to `Configuration` or `InfValInputField` in the Inspector. Create one via `Assets > Create > Infinite Value > Formatter`. Four built-in formatters are provided:
  - `ManualFormatter`: fully explicit; configure unit list, separators, exponent marker, digit count, and display flags.
  - `ScientificFormatter`: always formats as scientific notation (e.g. `1.23e+6`); configurable decimal separator, exponent marker, digit count, and trailing zeros.
  - `AlphabeticFormatter`: idle-game style with letter suffixes (`1.23a`, `4.56b`, ..., `1.00aa`); configurable alphabet, separators, digit count, and trailing zeros.
  - `CultureFormatter`: derives separators from a `Culture`; uses native East Asian units (`万/億...`, `만/억...`, `万/亿...`) with 4-digit stepping for `ja-*`, `ko-*`, and `zh-*` locales, and Western units (`k/M/G...`) for all others.
- `IInfValFormatter`: implement this interface to create a fully custom formatter. Requires `Format(in InfVal)`, `TryParse(string, out InfVal)`, and `IsValidPartialInput(string)`.
- `InfValFormatHelper`: static utility class for use when implementing `IInfValFormatter`. Provides `Format`, `TryParse`, `Parse`, `IsValidPartialInput`, `GetDecimalSeparator`, `GetGroupSeparator`, `AreUnitsValid`, and `defaultExponentMarkers`.
- `InfValInputField.activeFormatter`: read-only property returning the component's assigned formatter, falling back to `Configuration.defaultFormatter`.

Breaking Changes:
- **Formatter system replaces format settings**: all per-formatter options previously scattered across `Configuration` and `InfValInputField` have been removed. Assign a `FormatterAsset` to the `Default Formatter` field on `Configuration`, or to the `Formatter` field on `InfValInputField`. Fields removed:
  - `Configuration`: `maxDisplayedDigits`, `unitsList`, `displayOptions`, and all decimal/separator/exponent/culture format settings.
  - `InfValInputField`: `useCustomUnits`, `unitsList`, `useCustomCulture`, `culture`, `useCustomMaxDisplayedDigits`, `maxDisplayedDigits`, `useCustomDisplayOptions`, `displayOptions`.
- **`InfVal.ToString` overloads removed**: `ToString(int, string[], DisplayOption, ...)` and all related overloads are gone. Use `ToString(IInfValFormatter)` or the no-arg `ToString()` which uses `Configuration.defaultFormatter`.
- **Parse API simplified**: `Parse`, `TryParse` overloads taking `string[]` or `IFormatProvider` are gone. `ParseOrDefault` is fully removed.
- **`DisplayOption` enum removed**.
- **Integer constructors**: when no `precision` argument is provided, the resulting `InfVal` now has its precision set to the maximum digit count of the source type (e.g. 10 for `int`) instead of the actual digit count of the value. Pass an explicit `precision` to restore the old behavior.
- **`MathInfVal.Approximately`**: parameter renamed from `precision` to `significantDigits`. Only affects code using named arguments.
- **`Configuration` asset moved**: from `<Infinite Value package folder>/Resources/Configuration.asset` to `Assets/Resources/Infinite Value Configuration.asset`. Re-apply your settings to the new asset, which is created automatically on the first domain reload after upgrading.
- **`operator ++` and `operator --` removed**: use `value + 1` / `value - 1` instead.

Bug Fixes:
- Comparison operators (`<`, `>`, `<=`, `>=`) and `CompareTo` now correctly order negative values of different magnitudes (e.g. `-10 < -1` previously returned `false`).
- `MathInfVal.MaxExponent`, `MinExponent`, `MaxPrecision`, and `MinPrecision` (`params` overloads): the accumulation loop read back `.exponent`/`.precision` of `InfVal` representations of the loop indices instead of the original integers, producing incorrect results.
- `MathInfVal.Approximately`: did not account for the magnitude of the values; values with identical significant digits but different exponents (e.g. `1.23e5` vs. `1.23e6`) were incorrectly considered approximately equal.
- `MathInfVal.RandomRange`: now throws `ArgumentException` if `min > max` (previously silently swapped them); calling this repeatedly in the same frame no longer returns the same value every time.
- `MathInfVal.Repeat` and `PingPong`: now throw `ArgumentException` if `length` is zero (previously threw `DivideByZeroException`).
- `InterpolateInfVal.InverseLinear`: now throws `ArgumentException` if `min == max` (previously returned `NaN` or infinity).

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
