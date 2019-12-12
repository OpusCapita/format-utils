"use strict";

exports.__esModule = true;
exports.formatFXRate = exports.formatFloatToFixedDecimals = exports.formatDateToISO = exports.formatDate = exports.formatCurrencyAmount = exports.formatNumber = exports.getLocalDateTime = exports.getFXRateDecimals = exports.getCurrencyDecimals = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _formatUtils = require("./format-utils.constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
  };

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

exports.formatFXRate = formatFXRate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbImdldEN1cnJlbmN5RGVjaW1hbHMiLCJjdXJyZW5jeSIsIm51bWJlck9wdGlvbnMiLCJERUZBVUxUX0NVUlJFTkNZIiwic3R5bGUiLCJjdXJyZW5jeURpc3BsYXkiLCJ1c2VHcm91cGluZyIsInRlc3QiLCJJbnRsIiwiTnVtYmVyRm9ybWF0IiwiZm9ybWF0IiwicmVwbGFjZSIsImZvdW5kU2VwYXJhdG9yIiwic2VhcmNoIiwibGVuZ3RoIiwiZSIsImdldEZYUmF0ZURlY2ltYWxzIiwidmFsdWUiLCJ2YWx1ZVN0cmluZyIsIlN0cmluZyIsInBhcnNlRmxvYXQiLCJkZWNpbWFsU2VwYXJhdG9yIiwiaW5kZXhPZiIsImRlY2ltYWxOdW1iZXIiLCJGWFJBVEVfREVDSU1BTFMiLCJnZXRMb2NhbERhdGVUaW1lIiwidGltZXN0YW1wIiwiaXNvVGltZXN0YW1wIiwic2xpY2UiLCJsb2NhbFRpbWUiLCJEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ0aW1lVG9Db252ZXJ0IiwiZm9ybWF0TnVtYmVyIiwib3B0aW9ucyIsImRlY2ltYWxzIiwiaXNUcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiaXNEcyIsImZpeGVkTnVtYmVyIiwiTnVtYmVyIiwidG9GaXhlZCIsInNwbGl0Iiwiam9pbiIsImZvcm1hdEN1cnJlbmN5QW1vdW50IiwiYW1vdW50IiwiYW1vdW50U3RyIiwicmVwbGFjZVZhbHVlIiwibXVsdGlwbGllciIsImFtb3VudEZsb2F0IiwidW5kZWZpbmVkIiwiaXNOYU4iLCJmb3JtYXREYXRlIiwiZGF0ZUZvcm1hdCIsIm1vbWVudCIsInV0YyIsIlNLSVBQRURfREFURV9GT1JNQVQiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJmb3JtYXREYXRlVG9JU08iLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJmb3Jt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QkFBaUIsS0FBSyxJQUF0QixJQUE4QlIsbUJBQU9DLEdBQVAsQ0FBV3RDLEtBQVgsRUFBa0I2QyxpQkFBbEIsRUFBcUNGLFFBQXJDLEVBQStDSCxPQUEvQyxFQUFsQyxFQUE0RjtBQUMxRixXQUFPSCxtQkFBT0MsR0FBUCxDQUFXdEMsS0FBWCxFQUFrQjZDLGlCQUFsQixFQUFxQ0YsUUFBckMsRUFBK0NHLFdBQS9DLEVBQVA7QUFDRDs7QUFDRCxTQUFPRixZQUFQO0FBQ0QsQ0FwQk07QUFzQlA7Ozs7Ozs7Ozs7QUFNTyxJQUFNRywwQkFBMEIsR0FBRyxTQUE3QkEsMEJBQTZCLENBQUMvQyxLQUFELEVBQVFrQixRQUFSLEVBQXFCO0FBQzdEO0FBQ0EsTUFBSThCLFVBQVUsR0FBRzlDLE1BQU0sQ0FBQ0YsS0FBRCxDQUFOLENBQ2ROLE9BRGMsQ0FDTixXQURNLEVBQ08sRUFEUCxFQUVkQSxPQUZjLENBRU4sR0FGTSxFQUVELEdBRkMsQ0FBakI7QUFHQXNELEVBQUFBLFVBQVUsR0FBR2QsS0FBSyxDQUFDWCxNQUFNLENBQUN5QixVQUFELENBQVAsQ0FBTCxHQUE0QixDQUE1QixHQUFnQ3pCLE1BQU0sQ0FBQ3lCLFVBQUQsQ0FBbkQ7QUFDQSxTQUFPQSxVQUFVLENBQUN4QixPQUFYLENBQW1CTixRQUFuQixDQUFQO0FBQ0QsQ0FQTTtBQVNQOzs7Ozs7Ozs7OztBQU9PLElBQU0rQixZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBakQsS0FBSztBQUFBLFNBQUl1QixNQUFNLENBQUN2QixLQUFELENBQU4sQ0FBY3dCLE9BQWQsQ0FBc0J6QixpQkFBaUIsQ0FBQ0MsS0FBRCxDQUF2QyxDQUFKO0FBQUEsQ0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7IERFRkFVTFRfQ1VSUkVOQ1ksIEZYUkFURV9ERUNJTUFMUywgU0tJUFBFRF9EQVRFX0ZPUk1BVCB9IGZyb20gJy4vZm9ybWF0LXV0aWxzLmNvbnN0YW50cyc7XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIGN1cnJlbmN5LlxuICogSW5wdXQ6IGN1cnJlbmN5IGNvZGUgOjogc3RyaW5nLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDAuXG4gKiBEZWZhdWx0cyB0byAyLlxuICovXG5leHBvcnQgY29uc3QgZ2V0Q3VycmVuY3lEZWNpbWFscyA9IChjdXJyZW5jeSkgPT4ge1xuICBjb25zdCBudW1iZXJPcHRpb25zID0ge1xuICAgIGN1cnJlbmN5OiBjdXJyZW5jeSB8fCBERUZBVUxUX0NVUlJFTkNZLFxuICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgIGN1cnJlbmN5RGlzcGxheTogJ2NvZGUnLFxuICAgIHVzZUdyb3VwaW5nOiBmYWxzZSxcbiAgfTtcbiAgdHJ5IHtcbiAgICBjb25zdCB0ZXN0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1HQicsIG51bWJlck9wdGlvbnMpXG4gICAgICAuZm9ybWF0KDEuMTExMTExKVxuICAgICAgLnJlcGxhY2UoL1teXFxkLixdL2csICcnKTtcbiAgICBjb25zdCBmb3VuZFNlcGFyYXRvciA9IHRlc3Quc2VhcmNoKC9bLixdL2cpO1xuICAgIGlmIChmb3VuZFNlcGFyYXRvciA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGVzdC5sZW5ndGggLSBmb3VuZFNlcGFyYXRvciAtIDE7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBJbiBhbnkgZXJyb3IgY2FzZSwgcmV0dXJuIDIgZGVjaW1hbHMuXG4gICAgcmV0dXJuIDI7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogNi5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiA4LlxuICovXG5leHBvcnQgY29uc3QgZ2V0RlhSYXRlRGVjaW1hbHMgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgdmFsdWVTdHJpbmcgPSBTdHJpbmcocGFyc2VGbG9hdChTdHJpbmcodmFsdWUpKSk7XG4gIGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgPSB2YWx1ZVN0cmluZy5pbmRleE9mKCcuJyk7XG4gIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkZWNpbWFsU2VwYXJhdG9yIC0gMTtcbiAgcmV0dXJuIGRlY2ltYWxTZXBhcmF0b3IgPT09IC0xIHx8IGRlY2ltYWxOdW1iZXIgPD0gRlhSQVRFX0RFQ0lNQUxTXG4gICAgPyBGWFJBVEVfREVDSU1BTFNcbiAgICA6IGRlY2ltYWxOdW1iZXI7XG59O1xuXG4vKipcbiAqIEdldCBsb2NhbCBkYXRlIGFuZCB0aW1lIGZyb20gSVNPIDg2MDEgdGltZXN0YW1wLiBJdCdzIGNyb3NzLWJyb3dzZXIgKElFIGVzcGVjaWFsbHkhKS5cbiAqIElucHV0OiBVVEMgdGltZXN0YW1wIDo6IHN0cmluZy5cbiAqIE91dHB1dDogdGltZXN0YW1wIDo6IGRhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRMb2NhbERhdGVUaW1lID0gKHRpbWVzdGFtcCkgPT4ge1xuICBjb25zdCBpc29UaW1lc3RhbXAgPSB0aW1lc3RhbXAgIT09IG51bGwgJiYgdGltZXN0YW1wLnNsaWNlKC0xKSAhPT0gJ1onXG4gICAgPyBgJHt0aW1lc3RhbXB9WmBcbiAgICA6IHRpbWVzdGFtcDtcbiAgY29uc3QgbG9jYWxUaW1lID0gbmV3IERhdGUoaXNvVGltZXN0YW1wKSAtIG5ldyBEYXRlKHRpbWVzdGFtcCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgY29uc3QgdGltZVRvQ29udmVydCA9IGxvY2FsVGltZSA+PSAwID8gbG9jYWxUaW1lIDogMDtcbiAgcmV0dXJuIG5ldyBEYXRlKHRpbWVUb0NvbnZlcnQpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgbnVtYmVyIHdpdGggc2VwYXJhdG9ycyBhbmQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICogSW5wdXQ6IHZhbHVlIDo6IFtudW1iZXIsIGZsb2F0LCBzdHJpbmddXG4gKiBvcHRpb25zIDo6IG9iamVjdCAob3B0aW9uYWwpXG4gKiAgICBkZWNpbWFscyA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gb3ZlcnJpZGVzIG51bWJlciBvZiBkZWNpbWFsc1xuICogICAgdGhvdXNhbmRTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgIC8vIGRlZmF1bHRzIHRvIG5vbmVcbiAqICAgIGRlY2ltYWxTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgICAvLyBkZWZhdWx0cyB0byAnLidcbiAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMywgeyBkZWNpbWFsczogMiB9LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTInLlxuICogRXhhbXBsZSBvZiBpbnB1dDpcbiAqICA1MDAwLCB7IGRlY2ltYWxzOiAyLCB0aG91c2FuZFNlcGFyYXRvcjogJywnLCBkZWNpbWFsU2VwYXJhdG9yOiAnLicgfVxuICogIG91dHB1dDogJzUsMDAwLjAwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdE51bWJlciA9ICh2YWx1ZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyB8fCAwO1xuICBjb25zdCBpc1RzID0gdHlwZW9mIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IubGVuZ3RoO1xuICBjb25zdCBpc0RzID0gdHlwZW9mIG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yLmxlbmd0aDtcbiAgY29uc3QgZml4ZWROdW1iZXIgPSBOdW1iZXIodmFsdWUpLnRvRml4ZWQoZGVjaW1hbHMpO1xuICBpZiAoaXNUcyB8fCBpc0RzKSB7XG4gICAgaWYgKGRlY2ltYWxzID4gMCkge1xuICAgICAgY29uc3Qgc3BsaXQgPSBmaXhlZE51bWJlci5zcGxpdCgnLicpO1xuICAgICAgaWYgKGlzVHMpIHtcbiAgICAgICAgc3BsaXRbMF0gPSBzcGxpdFswXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0RzKSB7XG4gICAgICAgIHJldHVybiBzcGxpdC5qb2luKG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3BsaXQuam9pbignLicpO1xuICAgIH1cbiAgICBpZiAoaXNUcykge1xuICAgICAgcmV0dXJuIGZpeGVkTnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZml4ZWROdW1iZXI7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhbW91bnQgYWNjb3JkaW5nIHRvIGl0cyBjdXJyZW5jeS5cbiAqIElucHV0OiBhbW91bnQgOjogW251bWJlciwgc3RyaW5nXVxuICogb3B0aW9ucyA6OiBvYmplY3QgKG9wdGlvbmFsKVxuICogICAgY3VycmVuY3kgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG51bWJlciBvZiBkZWNpbWFscyBieSBjdXJyZW5jeVxuICogICAgZGVjaW1hbHMgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG92ZXJyaWRlcyBudW1iZXIgb2YgZGVjaW1hbHNcbiAqICAgIHRob3VzYW5kU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAvLyBkZWZhdWx0cyB0byBub25lXG4gKiAgICBkZWNpbWFsU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAgLy8gZGVmYXVsdHMgdG8gJy4nXG4gKiAgICBtdWx0aXBsaWVyIDo6IG51bWJlciAob3B0aW9uYWwpICAgICAgICAgLy8gYW1vdW50IGlzIG11bHRpcGxpZWQgYnkgbXVsdGlwbGllclxuICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMSwgJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4wMCcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMywgJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gKiBFeGFtcGxlIG9mIGlucHV0OlxuICogIDUwMDAsIHsgY3VycmVuY3k6ICdFVVInLCB0aG91c2FuZFNlcGFyYXRvcjogJywnLCBkZWNpbWFsU2VwYXJhdG9yOiAnLicgfVxuICogIG91dHB1dDogJzUsMDAwLjAwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEN1cnJlbmN5QW1vdW50ID0gKGFtb3VudCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGxldCBhbW91bnRTdHIgPSBTdHJpbmcoYW1vdW50KS5yZXBsYWNlKC9cXHMvZywgJycpO1xuXG4gIC8vIFN0cmlwcyBhbGwgY29tbWFzIE9SIHJlcGxhY2VzIGFsbCBjb21tYXMgd2l0aCBkb3RzLCBpZiBjb21tYSBpc24ndCB1c2VkIGFzIGEgdGhvdXNhbmQgc2VwYXJhdG9yXG4gIGNvbnN0IHJlcGxhY2VWYWx1ZSA9IChvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yICE9PSAnLCcpID8gJy4nIDogJyc7XG4gIGFtb3VudFN0ciA9IGFtb3VudFN0ci5yZXBsYWNlKC8sL2csIHJlcGxhY2VWYWx1ZSk7XG4gIGNvbnN0IHsgbXVsdGlwbGllciB9ID0gb3B0aW9ucztcbiAgY29uc3QgYW1vdW50RmxvYXQgPSBtdWx0aXBsaWVyID8gbXVsdGlwbGllciAqIHBhcnNlRmxvYXQoYW1vdW50U3RyKSA6IHBhcnNlRmxvYXQoYW1vdW50U3RyKTtcblxuICBjb25zdCBkZWNpbWFscyA9IG9wdGlvbnMuZGVjaW1hbHMgPT09IHVuZGVmaW5lZFxuICAgID8gZ2V0Q3VycmVuY3lEZWNpbWFscyhvcHRpb25zLmN1cnJlbmN5KVxuICAgIDogb3B0aW9ucy5kZWNpbWFscztcbiAgcmV0dXJuIE51bWJlci5pc05hTihhbW91bnRGbG9hdClcbiAgICA/IGFtb3VudEZsb2F0XG4gICAgOiBmb3JtYXROdW1iZXIoYW1vdW50RmxvYXQsIHsgLi4ub3B0aW9ucywgZGVjaW1hbHMgfSk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBkYXRlIHRvIGEgY2hvc2VuIGZvcm1hdC5cbiAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nLlxuICogT3V0cHV0OiBkYXRlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMDEuMDEuMjAxNycuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXREYXRlID0gKHZhbHVlLCBkYXRlRm9ybWF0KSA9PiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgU0tJUFBFRF9EQVRFX0ZPUk1BVCwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmZvcm1hdChkYXRlRm9ybWF0KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBsb2NhbGl6ZWQgZGF0ZSBzdHJpbmcgdG8gSVNPIHRpbWVzdGFtcC5cbiAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nIChvcHRpb25hbCksIHNpZ24gb2Ygc3RyaWN0IGRhdGUgZm9ybWF0IDo6XG4gKiBib29sZWFuIChvcHRpb25hbCksIGRlZmF1bHQgdmFsdWUgOjogc3RyaW5nIChvcHRpb25hbCksIGRlZmF1bHQgZGF0ZSBmb3JtYXQgOjpcbiAqIHN0cmluZyAob3B0aW9uYWwpLlxuICogT3V0cHV0OiBJU08gdGltZXN0YW1wIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcwMS4wMScsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RGF0ZVRvSVNPID0gKFxuICB2YWx1ZSxcbiAgZGF0ZUZvcm1hdCA9IG51bGwsXG4gIGlzU3RyaWN0ID0gZmFsc2UsXG4gIGRlZmF1bHRWYWx1ZSA9ICcnLFxuICBkZWZhdWx0RGF0ZUZvcm1hdCA9IG51bGwsXG4pID0+IHtcbiAgaWYgKGlzU3RyaWN0ICYmIG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIGlmIChkYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgaWYgKGRlZmF1bHREYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgYW4gaW5wdXQgdG8gYSBmbG9hdCB3aXRoIGZpeGVkIG51bWJlciBvZiBkZWNpbWFscy5cbiAqIElucHV0OiB2YWx1ZSB0byBmb3JtYXQgOjogW251bWJlciwgc3RyaW5nXSwgZGVjaW1hbHMgOjogbnVtYmVyLlxuICogT3V0cHV0OiBmb3JtYXR0ZWQgdmFsdWUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzIzIDAwMC4xYWJjJywgJzInLiBFeGFtcGxlIG9mIG91dHB1dDogJzIzMDAwLjEwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEZsb2F0VG9GaXhlZERlY2ltYWxzID0gKHZhbHVlLCBkZWNpbWFscykgPT4ge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cbiAgbGV0IGZsb2F0VmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgLnJlcGxhY2UoL1teXFxkLiwtXS9nLCAnJylcbiAgICAucmVwbGFjZSgnLCcsICcuJyk7XG4gIGZsb2F0VmFsdWUgPSBpc05hTihOdW1iZXIoZmxvYXRWYWx1ZSkpID8gMCA6IE51bWJlcihmbG9hdFZhbHVlKTtcbiAgcmV0dXJuIGZsb2F0VmFsdWUudG9GaXhlZChkZWNpbWFscyk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBGWCByYXRlLlxuICogSW5wdXQ6IHJhdGUuXG4gKiBPdXRwdXQ6IHJhdGUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjExMDAwMCcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTIzNDU2NzgnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RlhSYXRlID0gdmFsdWUgPT4gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKGdldEZYUmF0ZURlY2ltYWxzKHZhbHVlKSk7XG4iXX0=