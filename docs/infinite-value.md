---
layout: page
title: Infinite Value
permalink: /infinite-value/
image: /assets/images/infinite-value.png
software:
  description: "Arbitrary-precision number type for Unity that behaves like a primitive, works in real-time, and is fully configurable. Perfect for incremental games, RPGs, and monetary systems."
  price: "29.99"
  store_url: https://assetstore.unity.com/packages/tools/integration/infinite-value-bigdecimal-194963
---

<img src="/assets/images/infinite-value.png" alt="Infinite Value" class="package-image" width="1950" height="1300" decoding="async">

`InfVal` is an arbitrary-precision number type for Unity.  
It stores any integer or decimal value and behaves like a primitive: full arithmetic, comparison, and bitwise operators, implicit casts from all numeric types, and direct inspector support.  
Designed for real-time use and fully serializable.  
Perfect for incremental games, RPGs, or any system where standard numeric types overflow or lose precision.

## Features

- **Arbitrary precision**: integer or decimal with any digit count; values up to ~±10^4,294,967,295 with precision down to 10^−2,147,483,648
- **Primitive-like API**: arithmetic (`+`, `-`, `*`, `/`, `%`), bitwise, and comparison operators; implicit casts from all numeric primitives
- **Formatter system**: 4 built-in formatters (Manual, Scientific, Alphabetic, Culture-aware with native East Asian units) and a custom formatter interface; assign formatters project-wide or per component
- **Inspector drawer**: edit values directly, access raw digits and exponent, call transform methods with one click, and view all read-only properties, all sections configurable
- **Input field component**: `InfValInputField` turns any `InputField` or `TMP_InputField` into an `InfVal` field with validation modes, sign constraints, and per-component formatter override
- **Math & interpolation**: 30+ methods in `MathInfVal` (Abs, Pow, Sqrt, Log, Clamp, RandomRange, ...) and 10+ interpolation modes in `InterpolateInfVal` including ease in/out and angle variants
- **Performant**: explicit precision control, `in`-parameter passing, and `ToString()` caching keep real-time use efficient
- **Full sources**: all scripts included with comments and summaries

## Content

- **Infinite value type**: the `InfVal` struct separated in multiple files
- **Formatter system**: `IInfValFormatter`, `FormatterAsset`, 4 built-in formatters
- **Support classes**: `MathInfVal`, `InterpolateInfVal`, `InfValInputField` UI component
- **Tests**: NUnit test suite and custom randomized bulk tests
- **Demo**: a complete clicker-game demo with a save system, a scriptable-object database, and reusable UI scripts

## Requirements

Unity 6.0 or later

## Documentation

<a href="/infinite-value/documentation/" class="asset-store-btn" target="_blank" rel="noopener">Documentation</a>
<a href="/infinite-value/public-api/" class="asset-store-btn" target="_blank" rel="noopener">Public API</a>

## Get It

<a href="https://assetstore.unity.com/packages/tools/integration/infinite-value-bigdecimal-194963" class="asset-store-btn">View on Unity Asset Store ($29.99)</a>
<a href="https://justetools.itch.io/infinite-value" class="asset-store-btn">Play Demo</a>

## Patch Notes

**v2.1.0** (June 21, 2026)

Breaking Changes:
- Casting an `InfVal` to `float`, `double`, or `decimal` now throws when the value is too big to fit, instead of silently returning 0. Values that fit are unaffected.

Bug Fixes:
- Fixed `Sqrt` returning wrong results for some values.
- Improved `NthRoot`: more accurate, much faster, and now handles roots of negative numbers correctly.
- Equal values (like `5` and `5.0`) now work reliably as `Dictionary` and `HashSet` keys.
- `ToString`, `Parse`, and `TryParse` no longer fail when given no formatter; they now use the one set in `Configuration`.
- Saved values are no longer affected by the computer's language settings, preventing corruption when sharing a project.
- Fixed `InfValInputField` registering its callbacks multiple times and not cleaning them up.
- An invalid or unavailable `Culture` no longer causes an error; it falls back to a default.

**v2.0.0** (June 1, 2026)

New Features:
- **Formatter system**: format and parse behavior is now driven by `IInfValFormatter` implementations, wrapped in a `FormatterAsset` (`ScriptableObject`). Assign a `FormatterAsset` to `Configuration` or `InfValInputField` in the Inspector. Create one via `Assets > Create > Infinite Value > Formatter`. Four built-in formatters are provided:
  - `ManualFormatter`: fully explicit; configure unit list, separators, exponent marker, digit count, and display flags.
  - `ScientificFormatter`: always formats as scientific notation (e.g. `1.23e+6`); configurable decimal separator, exponent marker, digit count, and trailing zeros.
  - `AlphabeticFormatter`: idle-game style with letter suffixes (`1.23a`, `4.56b`, ..., `1.00aa`); configurable alphabet, separators, digit count, and trailing zeros.
  - `CultureFormatter`: derives separators from a `Culture`; uses native East Asian units (`万/億...`, `만/억...`, `万/亿...`) with 4-digit stepping for `ja-*`, `ko-*`, and `zh-*` locales, and Western units (`k/M/G...`) for all others.
- **`IInfValFormatter`**: implement this interface to create a fully custom formatter. Requires `Format(in InfVal)`, `TryParse(string, out InfVal)`, and `IsValidPartialInput(string)`.
- **`InfValFormatHelper`**: static utility class for use when implementing `IInfValFormatter`. Provides `Format`, `TryParse`, `Parse`, `IsValidPartialInput`, `GetDecimalSeparator`, `GetGroupSeparator`, `AreUnitsValid`, and `defaultExponentMarkers`.
- **`InfValInputField.activeFormatter`**: read-only property returning the component's assigned formatter, falling back to `Configuration.defaultFormatter`.

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

**v1.2.0** (June 15, 2023)

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

**v1.1.0** (May 26, 2021)

This update makes the InfVal structure conserve precision instead of exponent, which is similar to what primitive value types do and simpler to use in most cases. Old usage can still be done using the ToExponent method. It makes the easiest way to use the structure also the most optimized way, allowing you to work with gigantic numbers.

- Constructors and casts now take a precision instead of an exponent as a second parameter. Also added a new constructor and cast taking an InfVal as a first parameter
- Arithmetic operations now conserve the highest precision instead of the lowest exponent
- The CalcType enum no longer exists. The Add, Sub, Mul and Div methods have been deleted because they are no longer required, and the Pow, Sqrt and NthRoot methods now take a bool argument instead of a CalcType
- The ToExp method is renamed to ToExponent; it now accepts an optional bool as a second argument that lets you edit the exponent without changing the digits
- Changing the exponent property has been optimized
- The inspector drawer now has a maximum count of digits displayed and can be used to call the ToPrecision method
- Updated the demo, unit tests window, documentation and API to reflect these changes

**v1.0.0** - Initial release
