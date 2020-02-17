# Changelog
* In general follow (https://docs.npmjs.com/getting-started/semantic-versioning) versioning.

## <next>

## 2.2.4
* Bug fix in `formatCurrencyAmount` function: if region is for example Dansk or German and thousand separator is dot, first instance of thousand separator in the input is twisted to decimal separator.

## 2.2.3
* Hard code some currency decimal counts that were wrong in Chrome

## 2.2.2
* Suppress invalid currency code console error output when getting number of decimals

## 2.2.1
* Fixed `formatCurrencyAmount` returns NaN instead of 'NaN'

## 2.2.0
* Added multiplier support for currency formatter

## 2.1.2
* Bug fix in `formatCurrencyAmount` function

## 2.1.1
* Enhanced decimal/thousand separator handling in `formatCurrencyAmount` function

## 2.1.0
* Add `formatNumber` function to format number with separators and decimals
* Fix `formatCurrencyAmount` to allow 0 decimals
* Upgrade all dependencies along with Webpack 4 and Babel 8

## 2.0.0
* Change exports so that functions can be imported separately or whole library
* Change formatCurrencyAmount optional parameters to object
* Add formatCurrencyAmount support for thousand and decimal separator and number of decimals override
* Fix bug, handle unknown currency code so that javascript doesn't crash

## 1.0.0
* Initial release
