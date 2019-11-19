# Changelog
* In general follow (https://docs.npmjs.com/getting-started/semantic-versioning) versioning.

## <next>
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
