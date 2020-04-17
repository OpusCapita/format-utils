"use strict";

exports.__esModule = true;
exports.escapeSpecialCharacters = exports.formatFXRate = exports.formatFloatToFixedDecimals = exports.formatDateToISO = exports.formatDate = exports.formatCurrencyAmount = exports.formatNumber = exports.getLocalDateTime = exports.getFXRateDecimals = exports.getCurrencyDecimals = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _formatUtils = require("./format-utils.constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Hard coded currencies that has two decimal places
// Fix bug in Chrome that fails to count decimals for these currencies
var DEC_COUNT_2 = ['AFN', 'ALL', 'IRR', 'KPW', 'LAK', 'LBP', 'MGA', 'MMK', 'RSD', 'SLL', 'SOS', 'SYP']; // eslint-disable-line

var DEC_COUNT_3 = ['IQD'];
/**
 * Get a number of decimal digits for a currency.
 * Input: currency code :: string.
 * Output: decimals :: number.
 * Example of input: 'EUR'. Example of output: 2.
 * Example of input: 'JPY'. Example of output: 0.
 * Defaults to 2.
 */

var getCurrencyDecimals = function getCurrencyDecimals(currency) {
  var numberOptions = {
    currency: currency || _formatUtils.DEFAULT_CURRENCY,
    style: 'currency',
    currencyDisplay: 'code',
    useGrouping: false
  }; // Hard codes decimal counts

  if (DEC_COUNT_2.includes(currency)) {
    return 2;
  }

  if (DEC_COUNT_3.includes(currency)) {
    return 3;
  }

  try {
    var test = new Intl.NumberFormat('en-GB', numberOptions).format(1.111111).replace(/[^\d.,]/g, '');
    var foundSeparator = test.search(/[.,]/g);

    if (foundSeparator === -1) {
      return 0;
    }

    return test.length - foundSeparator - 1;
  } catch (e) {
    // In any error case, return 2 decimals.
    return 2;
  }
};
/**
 * Get a number of decimal digits for a FX rate.
 * Input: rate :: [number, string].
 * Output: decimals :: number.
 * Example of input: 1.11. Example of output: 6.
 * Example of input: 1.12345678. Example of output: 8.
 */


exports.getCurrencyDecimals = getCurrencyDecimals;

var getFXRateDecimals = function getFXRateDecimals(value) {
  var valueString = String(parseFloat(String(value)));
  var decimalSeparator = valueString.indexOf('.');
  var decimalNumber = valueString.length - decimalSeparator - 1;
  return decimalSeparator === -1 || decimalNumber <= _formatUtils.FXRATE_DECIMALS ? _formatUtils.FXRATE_DECIMALS : decimalNumber;
};
/**
 * Get local date and time from ISO 8601 timestamp. It's cross-browser (IE especially!).
 * Input: UTC timestamp :: string.
 * Output: timestamp :: date.
 */


exports.getFXRateDecimals = getFXRateDecimals;

var getLocalDateTime = function getLocalDateTime(timestamp) {
  var isoTimestamp = timestamp !== null && timestamp.slice(-1) !== 'Z' ? timestamp + "Z" : timestamp;
  var localTime = new Date(isoTimestamp) - new Date(timestamp).getTimezoneOffset();
  var timeToConvert = localTime >= 0 ? localTime : 0;
  return new Date(timeToConvert);
};
/**
 * Format number with separators and number of decimals.
 * Input: value :: [number, float, string]
 * options :: object (optional)
 *    decimals :: string (optional)           // overrides number of decimals
 *    thousandSeparator :: string (optional)  // defaults to none
 *    decimalSeparator :: string (optional)   // defaults to '.'
 * Output: amount :: string.
 * Example of input: 1. Example of output: '1'.
 * Example of input: 1.123, { decimals: 2 }. Example of output: '1.12'.
 * Example of input:
 *  5000, { decimals: 2, thousandSeparator: ',', decimalSeparator: '.' }
 *  output: '5,000.00'.
 */


exports.getLocalDateTime = getLocalDateTime;

var formatNumber = function formatNumber(value, options) {
  if (options === void 0) {
    options = {};
  }

  var decimals = options.decimals || 0;
  var isTs = typeof options.thousandSeparator === 'string' && options.thousandSeparator.length;
  var isDs = typeof options.decimalSeparator === 'string' && options.decimalSeparator.length;
  var fixedNumber = Number(value).toFixed(decimals);

  if (isTs || isDs) {
    if (decimals > 0) {
      var split = fixedNumber.split('.');

      if (isTs) {
        split[0] = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, options.thousandSeparator);
      }

      if (isDs) {
        return split.join(options.decimalSeparator);
      }

      return split.join('.');
    }

    if (isTs) {
      return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, options.thousandSeparator);
    }
  }

  return fixedNumber;
};
/**
 * Format amount according to its currency.
 * Input: amount :: [number, string]
 * options :: object (optional)
 *    currency :: string (optional)           // number of decimals by currency
 *    decimals :: string (optional)           // overrides number of decimals
 *    thousandSeparator :: string (optional)  // defaults to none
 *    decimalSeparator :: string (optional)   // defaults to '.'
 *    multiplier :: number (optional)         // amount is multiplied by multiplier
 * Output: amount :: string.
 * Example of input: 1, 'EUR'. Example of output: '1.00'.
 * Example of input: 1.123, 'JPY'. Example of output: '1'.
 * Example of input:
 *  5000, { currency: 'EUR', thousandSeparator: ',', decimalSeparator: '.' }
 *  output: '5,000.00'.
 */


exports.formatNumber = formatNumber;

var formatCurrencyAmount = function formatCurrencyAmount(amount, options) {
  if (options === void 0) {
    options = {};
  }

  var amountStr = String(amount).replace(/\s/g, ''); // Strips all commas OR replaces all commas with dots, if comma isn't used as a thousand separator

  var replaceValue = options.thousandSeparator !== ',' ? '.' : '';
  amountStr = amountStr.replace(/,/g, replaceValue);
  var _options = options,
      multiplier = _options.multiplier;
  var amountFloat = multiplier ? multiplier * parseFloat(amountStr) : parseFloat(amountStr);
  var decimals = options.decimals === undefined ? getCurrencyDecimals(options.currency) : options.decimals;
  return Number.isNaN(amountFloat) ? amountFloat : formatNumber(amountFloat, _extends({}, options, {
    decimals: decimals
  }));
};
/**
 * Format date to a chosen format.
 * Input: date :: string, date format :: string.
 * Output: date :: string.
 * Example of input: '2017-01-01T00:00:00.000Z', 'DD.MM.YYYY'. Example of output: '01.01.2017'.
 */


exports.formatCurrencyAmount = formatCurrencyAmount;

var formatDate = function formatDate(value, dateFormat) {
  if (value === null) {
    return '';
  }

  if (_moment["default"].utc(value, _formatUtils.SKIPPED_DATE_FORMAT, true).isValid()) {
    return value;
  }

  if (_moment["default"].utc(value, _moment["default"].ISO_8601, true).isValid()) {
    return _moment["default"].utc(value, _moment["default"].ISO_8601, true).format(dateFormat);
  }

  return value;
};
/**
 * Format localized date string to ISO timestamp.
 * Input: date :: string, date format :: string (optional), sign of strict date format ::
 * boolean (optional), default value :: string (optional), default date format ::
 * string (optional).
 * Output: ISO timestamp :: string.
 * Example of input: '01.01', 'DD.MM.YYYY'. Example of output: '2017-01-01T00:00:00.000Z'.
 */


exports.formatDate = formatDate;

var formatDateToISO = function formatDateToISO(value, dateFormat, isStrict, defaultValue, defaultDateFormat) {
  if (dateFormat === void 0) {
    dateFormat = null;
  }

  if (isStrict === void 0) {
    isStrict = false;
  }

  if (defaultValue === void 0) {
    defaultValue = '';
  }

  if (defaultDateFormat === void 0) {
    defaultDateFormat = null;
  }

  if (isStrict && _moment["default"].utc(value, _formatUtils.SKIPPED_DATE_FORMAT, isStrict).isValid()) {
    return value;
  }

  if (_moment["default"].utc(value, _moment["default"].ISO_8601, isStrict).isValid()) {
    return _moment["default"].utc(value, _moment["default"].ISO_8601, isStrict).toISOString();
  }

  if (dateFormat !== null && _moment["default"].utc(value, dateFormat, isStrict).isValid()) {
    return _moment["default"].utc(value, dateFormat, isStrict).toISOString();
  }

  if (defaultDateFormat !== null && _moment["default"].utc(value, defaultDateFormat, isStrict).isValid()) {
    return _moment["default"].utc(value, defaultDateFormat, isStrict).toISOString();
  }

  return defaultValue;
};
/**
 * Format an input to a float with fixed number of decimals.
 * Input: value to format :: [number, string], decimals :: number.
 * Output: formatted value :: string.
 * Example of input: '23 000.1abc', '2'. Example of output: '23000.10'.
 */


exports.formatDateToISO = formatDateToISO;

var formatFloatToFixedDecimals = function formatFloatToFixedDecimals(value, decimals) {
  /* eslint-disable no-restricted-globals */
  var floatValue = String(value).replace(/[^\d.,-]/g, '').replace(',', '.');
  floatValue = isNaN(Number(floatValue)) ? 0 : Number(floatValue);
  return floatValue.toFixed(decimals);
};
/**
 * Format FX rate.
 * Input: rate.
 * Output: rate :: string.
 * Example of input: 1.11. Example of output: '1.110000'.
 * Example of input: 1.12345678. Example of output: '1.12345678'.
 */


exports.formatFloatToFixedDecimals = formatFloatToFixedDecimals;

var formatFXRate = function formatFXRate(value) {
  return Number(value).toFixed(getFXRateDecimals(value));
};
/**
 * Escape special characters from string
 * Input: string
 * Output: escapedString :: string
 * Example of input: '(reboot)'
 * Example of output: '\(reboot\)'
 */


exports.formatFXRate = formatFXRate;

var escapeSpecialCharacters = function escapeSpecialCharacters(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

exports.escapeSpecialCharacters = escapeSpecialCharacters;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIkRFQ19DT1VOVF8yIiwiREVDX0NPVU5UXzMiLCJnZXRDdXJyZW5jeURlY2ltYWxzIiwiY3VycmVuY3kiLCJudW1iZXJPcHRpb25zIiwiREVGQVVMVF9DVVJSRU5DWSIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJpbmNsdWRlcyIsInRlc3QiLCJJbnRsIiwiTnVtYmVyRm9ybWF0IiwiZm9ybWF0IiwicmVwbGFjZSIsImZvdW5kU2VwYXJhdG9yIiwic2VhcmNoIiwibGVuZ3RoIiwiZSIsImdldEZYUmF0ZURlY2ltYWxzIiwidmFsdWUiLCJ2YWx1ZVN0cmluZyIsIlN0cmluZyIsInBhcnNlRmxvYXQiLCJkZWNpbWFsU2VwYXJhdG9yIiwiaW5kZXhPZiIsImRlY2ltYWxOdW1iZXIiLCJGWFJBVEVfREVDSU1BTFMiLCJnZXRMb2NhbERhdGVUaW1lIiwidGltZXN0YW1wIiwiaXNvVGltZXN0YW1wIiwic2xpY2UiLCJsb2NhbFRpbWUiLCJEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ0aW1lVG9Db252ZXJ0IiwiZm9ybWF0TnVtYmVyIiwib3B0aW9ucyIsImRlY2ltYWxzIiwiaXNUcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiaXNEcyIsImZpeGVkTnVtYmVyIiwiTnVtYmVyIiwidG9GaXhlZCIsInNwbGl0Iiwiam9pbiIsImZvcm1hdEN1cnJlbmN5QW1vdW50IiwiYW1vdW50IiwiYW1vdW50U3RyIiwicmVwbGFjZVZhbHVlIiwibXVsdGlwbGllciIsImFtb3VudEZsb2F0IiwidW5kZWZpbmVkIiwiaXNOYU4iLCJmb3JtYXREYXRlIiwiZGF0ZUZvcm1hdCIsIm1vbWVudCIsInV0YyIsIlNLSVBQRURfREFURV9GT1JNQVQiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJmb3JtYXREYXRlVG9JU08iLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyIsImZsb2F0VmFsdWUiLCJmb3JtYXRGWFJhdGUiLCJlc2NhcGVTcGVjaWFsQ2hhcmFjdGVycyIsInN0ciJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7QUFFQTs7Ozs7O0FBRUE7QUFDQTtBQUNBLElBQU1BLFdBQVcsR0FBRyxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsS0FBZixFQUFzQixLQUF0QixFQUE2QixLQUE3QixFQUFvQyxLQUFwQyxFQUEyQyxLQUEzQyxFQUFrRCxLQUFsRCxFQUF5RCxLQUF6RCxFQUFnRSxLQUFoRSxFQUF1RSxLQUF2RSxFQUE4RSxLQUE5RSxDQUFwQixDLENBQTBHOztBQUMxRyxJQUFNQyxXQUFXLEdBQUcsQ0FBQyxLQUFELENBQXBCO0FBRUE7Ozs7Ozs7OztBQVFPLElBQU1DLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsUUFBRCxFQUFjO0FBQy9DLE1BQU1DLGFBQWEsR0FBRztBQUNwQkQsSUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUlFLDZCQURGO0FBRXBCQyxJQUFBQSxLQUFLLEVBQUUsVUFGYTtBQUdwQkMsSUFBQUEsZUFBZSxFQUFFLE1BSEc7QUFJcEJDLElBQUFBLFdBQVcsRUFBRTtBQUpPLEdBQXRCLENBRCtDLENBTy9DOztBQUNBLE1BQUlSLFdBQVcsQ0FBQ1MsUUFBWixDQUFxQk4sUUFBckIsQ0FBSixFQUFvQztBQUNsQyxXQUFPLENBQVA7QUFDRDs7QUFDRCxNQUFJRixXQUFXLENBQUNRLFFBQVosQ0FBcUJOLFFBQXJCLENBQUosRUFBb0M7QUFDbEMsV0FBTyxDQUFQO0FBQ0Q7O0FBQ0QsTUFBSTtBQUNGLFFBQU1PLElBQUksR0FBRyxJQUFJQyxJQUFJLENBQUNDLFlBQVQsQ0FBc0IsT0FBdEIsRUFBK0JSLGFBQS9CLEVBQ1ZTLE1BRFUsQ0FDSCxRQURHLEVBRVZDLE9BRlUsQ0FFRixVQUZFLEVBRVUsRUFGVixDQUFiO0FBR0EsUUFB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QUFDWCxNQUFNLENBQUN5QixVQUFELENBQVAsQ0FBTCxHQUE0QixDQUE1QixHQUFnQ3pCLE1BQU0sQ0FBQ3lCLFVBQUQsQ0FBbkQ7QUFDQSxTQUFPQSxVQUFVLENBQUN4QixPQUFYLENBQW1CTixRQUFuQixDQUFQO0FBQ0QsQ0FQTTtBQVNQOzs7Ozs7Ozs7OztBQU9PLElBQU0rQixZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDakQsS0FBRDtBQUFBLFNBQVd1QixNQUFNLENBQUN2QixLQUFELENBQU4sQ0FBY3dCLE9BQWQsQ0FBc0J6QixpQkFBaUIsQ0FBQ0MsS0FBRCxDQUF2QyxDQUFYO0FBQUEsQ0FBckI7QUFFUDs7Ozs7Ozs7Ozs7QUFPTyxJQUFNa0QsdUJBQXVCLEdBQUcsU0FBMUJBLHVCQUEwQixDQUFDQyxHQUFEO0FBQUEsU0FBU0EsR0FBRyxDQUFDekQsT0FBSixDQUFZLDBCQUFaLEVBQXdDLE1BQXhDLENBQVQ7QUFBQSxDQUFoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IHsgREVGQVVMVF9DVVJSRU5DWSwgRlhSQVRFX0RFQ0lNQUxTLCBTS0lQUEVEX0RBVEVfRk9STUFUIH0gZnJvbSAnLi9mb3JtYXQtdXRpbHMuY29uc3RhbnRzJztcblxuLy8gSGFyZCBjb2RlZCBjdXJyZW5jaWVzIHRoYXQgaGFzIHR3byBkZWNpbWFsIHBsYWNlc1xuLy8gRml4IGJ1ZyBpbiBDaHJvbWUgdGhhdCBmYWlscyB0byBjb3VudCBkZWNpbWFscyBmb3IgdGhlc2UgY3VycmVuY2llc1xuY29uc3QgREVDX0NPVU5UXzIgPSBbJ0FGTicsICdBTEwnLCAnSVJSJywgJ0tQVycsICdMQUsnLCAnTEJQJywgJ01HQScsICdNTUsnLCAnUlNEJywgJ1NMTCcsICdTT1MnLCAnU1lQJ107IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbmNvbnN0IERFQ19DT1VOVF8zID0gWydJUUQnXTtcblxuLyoqXG4gKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgY3VycmVuY3kuXG4gKiBJbnB1dDogY3VycmVuY3kgY29kZSA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogMi5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogMC5cbiAqIERlZmF1bHRzIHRvIDIuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDdXJyZW5jeURlY2ltYWxzID0gKGN1cnJlbmN5KSA9PiB7XG4gIGNvbnN0IG51bWJlck9wdGlvbnMgPSB7XG4gICAgY3VycmVuY3k6IGN1cnJlbmN5IHx8IERFRkFVTFRfQ1VSUkVOQ1ksXG4gICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgY3VycmVuY3lEaXNwbGF5OiAnY29kZScsXG4gICAgdXNlR3JvdXBpbmc6IGZhbHNlLFxuICB9O1xuICAvLyBIYXJkIGNvZGVzIGRlY2ltYWwgY291bnRzXG4gIGlmIChERUNfQ09VTlRfMi5pbmNsdWRlcyhjdXJyZW5jeSkpIHtcbiAgICByZXR1cm4gMjtcbiAgfVxuICBpZiAoREVDX0NPVU5UXzMuaW5jbHVkZXMoY3VycmVuY3kpKSB7XG4gICAgcmV0dXJuIDM7XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCB0ZXN0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1HQicsIG51bWJlck9wdGlvbnMpXG4gICAgICAuZm9ybWF0KDEuMTExMTExKVxuICAgICAgLnJlcGxhY2UoL1teXFxkLixdL2csICcnKTtcbiAgICBjb25zdCBmb3VuZFNlcGFyYXRvciA9IHRlc3Quc2VhcmNoKC9bLixdL2cpO1xuICAgIGlmIChmb3VuZFNlcGFyYXRvciA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGVzdC5sZW5ndGggLSBmb3VuZFNlcGFyYXRvciAtIDE7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBJbiBhbnkgZXJyb3IgY2FzZSwgcmV0dXJuIDIgZGVjaW1hbHMuXG4gICAgcmV0dXJuIDI7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogNi5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiA4LlxuICovXG5leHBvcnQgY29uc3QgZ2V0RlhSYXRlRGVjaW1hbHMgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgdmFsdWVTdHJpbmcgPSBTdHJpbmcocGFyc2VGbG9hdChTdHJpbmcodmFsdWUpKSk7XG4gIGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgPSB2YWx1ZVN0cmluZy5pbmRleE9mKCcuJyk7XG4gIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkZWNpbWFsU2VwYXJhdG9yIC0gMTtcbiAgcmV0dXJuIGRlY2ltYWxTZXBhcmF0b3IgPT09IC0xIHx8IGRlY2ltYWxOdW1iZXIgPD0gRlhSQVRFX0RFQ0lNQUxTXG4gICAgPyBGWFJBVEVfREVDSU1BTFNcbiAgICA6IGRlY2ltYWxOdW1iZXI7XG59O1xuXG4vKipcbiAqIEdldCBsb2NhbCBkYXRlIGFuZCB0aW1lIGZyb20gSVNPIDg2MDEgdGltZXN0YW1wLiBJdCdzIGNyb3NzLWJyb3dzZXIgKElFIGVzcGVjaWFsbHkhKS5cbiAqIElucHV0OiBVVEMgdGltZXN0YW1wIDo6IHN0cmluZy5cbiAqIE91dHB1dDogdGltZXN0YW1wIDo6IGRhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRMb2NhbERhdGVUaW1lID0gKHRpbWVzdGFtcCkgPT4ge1xuICBjb25zdCBpc29UaW1lc3RhbXAgPSB0aW1lc3RhbXAgIT09IG51bGwgJiYgdGltZXN0YW1wLnNsaWNlKC0xKSAhPT0gJ1onXG4gICAgPyBgJHt0aW1lc3RhbXB9WmBcbiAgICA6IHRpbWVzdGFtcDtcbiAgY29uc3QgbG9jYWxUaW1lID0gbmV3IERhdGUoaXNvVGltZXN0YW1wKSAtIG5ldyBEYXRlKHRpbWVzdGFtcCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgY29uc3QgdGltZVRvQ29udmVydCA9IGxvY2FsVGltZSA+PSAwID8gbG9jYWxUaW1lIDogMDtcbiAgcmV0dXJuIG5ldyBEYXRlKHRpbWVUb0NvbnZlcnQpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgbnVtYmVyIHdpdGggc2VwYXJhdG9ycyBhbmQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICogSW5wdXQ6IHZhbHVlIDo6IFtudW1iZXIsIGZsb2F0LCBzdHJpbmddXG4gKiBvcHRpb25zIDo6IG9iamVjdCAob3B0aW9uYWwpXG4gKiAgICBkZWNpbWFscyA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gb3ZlcnJpZGVzIG51bWJlciBvZiBkZWNpbWFsc1xuICogICAgdGhvdXNhbmRTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgIC8vIGRlZmF1bHRzIHRvIG5vbmVcbiAqICAgIGRlY2ltYWxTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgICAvLyBkZWZhdWx0cyB0byAnLidcbiAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMywgeyBkZWNpbWFsczogMiB9LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTInLlxuICogRXhhbXBsZSBvZiBpbnB1dDpcbiAqICA1MDAwLCB7IGRlY2ltYWxzOiAyLCB0aG91c2FuZFNlcGFyYXRvcjogJywnLCBkZWNpbWFsU2VwYXJhdG9yOiAnLicgfVxuICogIG91dHB1dDogJzUsMDAwLjAwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdE51bWJlciA9ICh2YWx1ZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyB8fCAwO1xuICBjb25zdCBpc1RzID0gdHlwZW9mIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IubGVuZ3RoO1xuICBjb25zdCBpc0RzID0gdHlwZW9mIG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yLmxlbmd0aDtcbiAgY29uc3QgZml4ZWROdW1iZXIgPSBOdW1iZXIodmFsdWUpLnRvRml4ZWQoZGVjaW1hbHMpO1xuICBpZiAoaXNUcyB8fCBpc0RzKSB7XG4gICAgaWYgKGRlY2ltYWxzID4gMCkge1xuICAgICAgY29uc3Qgc3BsaXQgPSBmaXhlZE51bWJlci5zcGxpdCgnLicpO1xuICAgICAgaWYgKGlzVHMpIHtcbiAgICAgICAgc3BsaXRbMF0gPSBzcGxpdFswXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0RzKSB7XG4gICAgICAgIHJldHVybiBzcGxpdC5qb2luKG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3BsaXQuam9pbignLicpO1xuICAgIH1cbiAgICBpZiAoaXNUcykge1xuICAgICAgcmV0dXJuIGZpeGVkTnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZml4ZWROdW1iZXI7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhbW91bnQgYWNjb3JkaW5nIHRvIGl0cyBjdXJyZW5jeS5cbiAqIElucHV0OiBhbW91bnQgOjogW251bWJlciwgc3RyaW5nXVxuICogb3B0aW9ucyA6OiBvYmplY3QgKG9wdGlvbmFsKVxuICogICAgY3VycmVuY3kgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG51bWJlciBvZiBkZWNpbWFscyBieSBjdXJyZW5jeVxuICogICAgZGVjaW1hbHMgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG92ZXJyaWRlcyBudW1iZXIgb2YgZGVjaW1hbHNcbiAqICAgIHRob3VzYW5kU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAvLyBkZWZhdWx0cyB0byBub25lXG4gKiAgICBkZWNpbWFsU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAgLy8gZGVmYXVsdHMgdG8gJy4nXG4gKiAgICBtdWx0aXBsaWVyIDo6IG51bWJlciAob3B0aW9uYWwpICAgICAgICAgLy8gYW1vdW50IGlzIG11bHRpcGxpZWQgYnkgbXVsdGlwbGllclxuICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMSwgJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4wMCcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMywgJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gKiBFeGFtcGxlIG9mIGlucHV0OlxuICogIDUwMDAsIHsgY3VycmVuY3k6ICdFVVInLCB0aG91c2FuZFNlcGFyYXRvcjogJywnLCBkZWNpbWFsU2VwYXJhdG9yOiAnLicgfVxuICogIG91dHB1dDogJzUsMDAwLjAwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEN1cnJlbmN5QW1vdW50ID0gKGFtb3VudCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCBhbW91bnRTdHIgPSBTdHJpbmcoYW1vdW50KS5yZXBsYWNlKC9cXHMvZywgJycpO1xuXG4gIC8vIFN0cmlwcyBhbGwgY29tbWFzIE9SIHJlcGxhY2VzIGFsbCBjb21tYXMgd2l0aCBkb3RzLCBpZiBjb21tYSBpc24ndCB1c2VkIGFzIGEgdGhvdXNhbmQgc2VwYXJhdG9yXG4gIGNvbnN0IHJlcGxhY2VWYWx1ZSA9IChvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yICE9PSAnLCcpID8gJy4nIDogJyc7XG4gIGFtb3VudFN0ciA9IGFtb3VudFN0ci5yZXBsYWNlKC8sL2csIHJlcGxhY2VWYWx1ZSk7XG5cbiAgY29uc3QgeyBtdWx0aXBsaWVyIH0gPSBvcHRpb25zO1xuICBjb25zdCBhbW91bnRGbG9hdCA9IG11bHRpcGxpZXIgPyBtdWx0aXBsaWVyICogcGFyc2VGbG9hdChhbW91bnRTdHIpIDogcGFyc2VGbG9hdChhbW91bnRTdHIpO1xuXG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyA9PT0gdW5kZWZpbmVkXG4gICAgPyBnZXRDdXJyZW5jeURlY2ltYWxzKG9wdGlvbnMuY3VycmVuY3kpXG4gICAgOiBvcHRpb25zLmRlY2ltYWxzO1xuICByZXR1cm4gTnVtYmVyLmlzTmFOKGFtb3VudEZsb2F0KVxuICAgID8gYW1vdW50RmxvYXRcbiAgICA6IGZvcm1hdE51bWJlcihhbW91bnRGbG9hdCwgeyAuLi5vcHRpb25zLCBkZWNpbWFscyB9KTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGRhdGUgdG8gYSBjaG9zZW4gZm9ybWF0LlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IGRhdGUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcwMS4wMS4yMDE3Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQpID0+IHtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuZm9ybWF0KGRhdGVGb3JtYXQpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGxvY2FsaXplZCBkYXRlIHN0cmluZyB0byBJU08gdGltZXN0YW1wLlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgc2lnbiBvZiBzdHJpY3QgZGF0ZSBmb3JtYXQgOjpcbiAqIGJvb2xlYW4gKG9wdGlvbmFsKSwgZGVmYXVsdCB2YWx1ZSA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgZGVmYXVsdCBkYXRlIGZvcm1hdCA6OlxuICogc3RyaW5nIChvcHRpb25hbCkuXG4gKiBPdXRwdXQ6IElTTyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXREYXRlVG9JU08gPSAoXG4gIHZhbHVlLFxuICBkYXRlRm9ybWF0ID0gbnVsbCxcbiAgaXNTdHJpY3QgPSBmYWxzZSxcbiAgZGVmYXVsdFZhbHVlID0gJycsXG4gIGRlZmF1bHREYXRlRm9ybWF0ID0gbnVsbCxcbikgPT4ge1xuICBpZiAoaXNTdHJpY3QgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgU0tJUFBFRF9EQVRFX0ZPUk1BVCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgaWYgKGRhdGVGb3JtYXQgIT09IG51bGwgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGVmYXVsdERhdGVGb3JtYXQgIT09IG51bGwgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhbiBpbnB1dCB0byBhIGZsb2F0IHdpdGggZml4ZWQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICogSW5wdXQ6IHZhbHVlIHRvIGZvcm1hdCA6OiBbbnVtYmVyLCBzdHJpbmddLCBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBPdXRwdXQ6IGZvcm1hdHRlZCB2YWx1ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMjMgMDAwLjFhYmMnLCAnMicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjMwMDAuMTAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMgPSAodmFsdWUsIGRlY2ltYWxzKSA9PiB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xuICBsZXQgZmxvYXRWYWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICAucmVwbGFjZSgvW15cXGQuLC1dL2csICcnKVxuICAgIC5yZXBsYWNlKCcsJywgJy4nKTtcbiAgZmxvYXRWYWx1ZSA9IGlzTmFOKE51bWJlcihmbG9hdFZhbHVlKSkgPyAwIDogTnVtYmVyKGZsb2F0VmFsdWUpO1xuICByZXR1cm4gZmxvYXRWYWx1ZS50b0ZpeGVkKGRlY2ltYWxzKTtcbn07XG5cbi8qKlxuICogRm9ybWF0IEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZS5cbiAqIE91dHB1dDogcmF0ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTEwMDAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMjM0NTY3OCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGWFJhdGUgPSAodmFsdWUpID0+IE51bWJlcih2YWx1ZSkudG9GaXhlZChnZXRGWFJhdGVEZWNpbWFscyh2YWx1ZSkpO1xuXG4vKipcbiAqIEVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgZnJvbSBzdHJpbmdcbiAqIElucHV0OiBzdHJpbmdcbiAqIE91dHB1dDogZXNjYXBlZFN0cmluZyA6OiBzdHJpbmdcbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcocmVib290KSdcbiAqIEV4YW1wbGUgb2Ygb3V0cHV0OiAnXFwocmVib290XFwpJ1xuICovXG5leHBvcnQgY29uc3QgZXNjYXBlU3BlY2lhbENoYXJhY3RlcnMgPSAoc3RyKSA9PiBzdHIucmVwbGFjZSgvWy1bXFxde30oKSorPy4sXFxcXF4kfCNcXHNdL2csICdcXFxcJCYnKTtcbiJdfQ==