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
    console.error(e); // eslint-disable-line

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
  return formatNumber(amountFloat, _extends({}, options, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbImdldEN1cnJlbmN5RGVjaW1hbHMiLCJjdXJyZW5jeSIsIm51bWJlck9wdGlvbnMiLCJERUZBVUxUX0NVUlJFTkNZIiwic3R5bGUiLCJjdXJyZW5jeURpc3BsYXkiLCJ1c2VHcm91cGluZyIsInRlc3QiLCJJbnRsIiwiTnVtYmVyRm9ybWF0IiwiZm9ybWF0IiwicmVwbGFjZSIsImZvdW5kU2VwYXJhdG9yIiwic2VhcmNoIiwibGVuZ3RoIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsImdldEZYUmF0ZURlY2ltYWxzIiwidmFsdWUiLCJ2YWx1ZVN0cmluZyIsIlN0cmluZyIsInBhcnNlRmxvYXQiLCJkZWNpbWFsU2VwYXJhdG9yIiwiaW5kZXhPZiIsImRlY2ltYWxOdW1iZXIiLCJGWFJBVEVfREVDSU1BTFMiLCJnZXRMb2NhbERhdGVUaW1lIiwidGltZXN0YW1wIiwiaXNvVGltZXN0YW1wIiwic2xpY2UiLCJsb2NhbFRpbWUiLCJEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ0aW1lVG9Db252ZXJ0IiwiZm9ybWF0TnVtYmVyIiwib3B0aW9ucyIsImRlY2ltYWxzIiwiaXNUcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiaXNEcyIsImZpeGVkTnVtYmVyIiwiTnVtYmVyIiwidG9GaXhlZCIsInNwbGl0Iiwiam9pbiIsImZvcm1hdEN1cnJlbmN5QW1vdW50IiwiYW1vdW50IiwiYW1vdW50U3RyIiwicmVwbGFjZVZhbHVlIiwibXVsdGlwbGllciIsImFtb3VudEZsb2F0IiwidW5kZWZpbmVkIiwiZm9ybWF0RGF0ZSIsImRhdGVGb3JtYXQiLCJtb21lbnQiLCJ1dGMiLCJTS0lQUEVEX0RBVEVfRk9STUFUIiwiaXNWYWxpZCIsIklTT184NjAxIiwiZm9ybWF0RGF0ZVRvSVNPIiwiaXNTdHJpY3QiLCJkZWZhdWx0VmFsdWUiLCJkZWZhdWx0RGF0ZUZvcm1hdCIsInRvSVNPU3RyaW5nIiwiZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMiLCJmbG9hdFZhbHVlIiwiaXNOYU4iLCJmb3JtYXRGWFJhdGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0FBRUE7Ozs7OztBQUVBOzs7Ozs7OztBQVFPLElBQU1BLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsUUFBRCxFQUFjO0FBQy9DLE1BQU1DLGFBQWEsR0FBRztBQUNwQkQsSUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUlFLDZCQURGO0FBRXBCQyxJQUFBQSxLQUFLLEVBQUUsVUFGYTtBQUdwQkMsSUFBQUEsZUFBZSxFQUFFLE1BSEc7QUFJcEJDLElBQUFBLFdBQVcsRUFBRTtBQUpPLEdBQXRCOztBQU1BLE1BQUk7QUFDRixRQUFNQyxJQUFJLEdBQUcsSUFBSUMsSUFBSSxDQUFDQyxZQUFULENBQXNCLE9BQXRCLEVBQStCUCxhQUEvQixFQUNWUSxNQURVLENBQ0gsUUFERyxFQUVWQyxPQUZVLENBRUYsVUFGRSxFQUVVLEVBRlYsQ0FBYjtBQUdBLFFBQU1DLGNBQWMsR0FBR0wsSUFBSSxDQUFDTSxNQUFMLENBQVksT0FBWixDQUF2Qjs7QUFDQSxRQUFJRCxjQUFjLEtBQUssQ0FBQyxDQUF4QixFQUEyQjtBQUN6QixhQUFPLENBQVA7QUFDRDs7QUFDRCxXQUFPTCxJQUFJLENBQUNPLE1BQUwsR0FBY0YsY0FBZCxHQUErQixDQUF0QztBQUNELEdBVEQsQ0FTRSxPQUFPRyxDQUFQLEVBQVU7QUFDVkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFEVSxDQUNROztBQUNsQixXQUFPLENBQVA7QUFDRDtBQUNGLENBcEJNO0FBc0JQOzs7Ozs7Ozs7OztBQU9PLElBQU1HLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBb0IsQ0FBQ0MsS0FBRCxFQUFXO0FBQzFDLE1BQU1DLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxVQUFVLENBQUNELE1BQU0sQ0FBQ0YsS0FBRCxDQUFQLENBQVgsQ0FBMUI7QUFDQSxNQUFNSSxnQkFBZ0Is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QUFDRDs7QUFDRCxNQUFJRCxpQkFBaUIsS0FBSyxJQUF0QixJQUE4QlIsbUJBQU9DLEdBQVAsQ0FBV3JDLEtBQVgsRUFBa0I0QyxpQkFBbEIsRUFBcUNGLFFBQXJDLEVBQStDSCxPQUEvQyxFQUFsQyxFQUE0RjtBQUMxRixXQUFPSCxtQkFBT0MsR0FBUCxDQUFXckMsS0FBWCxFQUFrQjRDLGlCQUFsQixFQUFxQ0YsUUFBckMsRUFBK0NHLFdBQS9DLEVBQVA7QUFDRDs7QUFDRCxTQUFPRixZQUFQO0FBQ0QsQ0FwQk07QUFzQlA7Ozs7Ozs7Ozs7QUFNTyxJQUFNRywwQkFBMEIsR0FBRyxTQUE3QkEsMEJBQTZCLENBQUM5QyxLQUFELEVBQVFrQixRQUFSLEVBQXFCO0FBQzdEO0FBQ0EsTUFBSTZCLFVBQVUsR0FBRzdDLE1BQU0sQ0FBQ0YsS0FBRCxDQUFOLENBQ2RSLE9BRGMsQ0FDTixXQURNLEVBQ08sRUFEUCxFQUVkQSxPQUZjLENBRU4sR0FGTSxFQUVELEdBRkMsQ0FBakI7QUFHQXVELEVBQUFBLFVBQVUsR0FBR0MsS0FBSyxDQUFDekIsTUFBTSxDQUFDd0IsVUFBRCxDQUFQLENBQUwsR0FBNEIsQ0FBNUIsR0FBZ0N4QixNQUFNLENBQUN3QixVQUFELENBQW5EO0FBQ0EsU0FBT0EsVUFBVSxDQUFDdkIsT0FBWCxDQUFtQk4sUUFBbkIsQ0FBUDtBQUNELENBUE07QUFTUDs7Ozs7Ozs7Ozs7QUFPTyxJQUFNK0IsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQWpELEtBQUs7QUFBQSxTQUFJdUIsTUFBTSxDQUFDdkIsS0FBRCxDQUFOLENBQWN3QixPQUFkLENBQXNCekIsaUJBQWlCLENBQUNDLEtBQUQsQ0FBdkMsQ0FBSjtBQUFBLENBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQgeyBERUZBVUxUX0NVUlJFTkNZLCBGWFJBVEVfREVDSU1BTFMsIFNLSVBQRURfREFURV9GT1JNQVQgfSBmcm9tICcuL2Zvcm1hdC11dGlscy5jb25zdGFudHMnO1xuXG4vKipcbiAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBjdXJyZW5jeS5cbiAqIElucHV0OiBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAwLlxuICogRGVmYXVsdHMgdG8gMi5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEN1cnJlbmN5RGVjaW1hbHMgPSAoY3VycmVuY3kpID0+IHtcbiAgY29uc3QgbnVtYmVyT3B0aW9ucyA9IHtcbiAgICBjdXJyZW5jeTogY3VycmVuY3kgfHwgREVGQVVMVF9DVVJSRU5DWSxcbiAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICBjdXJyZW5jeURpc3BsYXk6ICdjb2RlJyxcbiAgICB1c2VHcm91cGluZzogZmFsc2UsXG4gIH07XG4gIHRyeSB7XG4gICAgY29uc3QgdGVzdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCgnZW4tR0InLCBudW1iZXJPcHRpb25zKVxuICAgICAgLmZvcm1hdCgxLjExMTExMSlcbiAgICAgIC5yZXBsYWNlKC9bXlxcZC4sXS9nLCAnJyk7XG4gICAgY29uc3QgZm91bmRTZXBhcmF0b3IgPSB0ZXN0LnNlYXJjaCgvWy4sXS9nKTtcbiAgICBpZiAoZm91bmRTZXBhcmF0b3IgPT09IC0xKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRlc3QubGVuZ3RoIC0gZm91bmRTZXBhcmF0b3IgLSAxO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIHJldHVybiAyO1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBGWCByYXRlLlxuICogSW5wdXQ6IHJhdGUgOjogW251bWJlciwgc3RyaW5nXS5cbiAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6IDYuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogOC5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEZYUmF0ZURlY2ltYWxzID0gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IHZhbHVlU3RyaW5nID0gU3RyaW5nKHBhcnNlRmxvYXQoU3RyaW5nKHZhbHVlKSkpO1xuICBjb25zdCBkZWNpbWFsU2VwYXJhdG9yID0gdmFsdWVTdHJpbmcuaW5kZXhPZignLicpO1xuICBjb25zdCBkZWNpbWFsTnVtYmVyID0gdmFsdWVTdHJpbmcubGVuZ3RoIC0gZGVjaW1hbFNlcGFyYXRvciAtIDE7XG4gIHJldHVybiBkZWNpbWFsU2VwYXJhdG9yID09PSAtMSB8fCBkZWNpbWFsTnVtYmVyIDw9IEZYUkFURV9ERUNJTUFMU1xuICAgID8gRlhSQVRFX0RFQ0lNQUxTXG4gICAgOiBkZWNpbWFsTnVtYmVyO1xufTtcblxuLyoqXG4gKiBHZXQgbG9jYWwgZGF0ZSBhbmQgdGltZSBmcm9tIElTTyA4NjAxIHRpbWVzdGFtcC4gSXQncyBjcm9zcy1icm93c2VyIChJRSBlc3BlY2lhbGx5ISkuXG4gKiBJbnB1dDogVVRDIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IHRpbWVzdGFtcCA6OiBkYXRlLlxuICovXG5leHBvcnQgY29uc3QgZ2V0TG9jYWxEYXRlVGltZSA9ICh0aW1lc3RhbXApID0+IHtcbiAgY29uc3QgaXNvVGltZXN0YW1wID0gdGltZXN0YW1wICE9PSBudWxsICYmIHRpbWVzdGFtcC5zbGljZSgtMSkgIT09ICdaJ1xuICAgID8gYCR7dGltZXN0YW1wfVpgXG4gICAgOiB0aW1lc3RhbXA7XG4gIGNvbnN0IGxvY2FsVGltZSA9IG5ldyBEYXRlKGlzb1RpbWVzdGFtcCkgLSBuZXcgRGF0ZSh0aW1lc3RhbXApLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gIGNvbnN0IHRpbWVUb0NvbnZlcnQgPSBsb2NhbFRpbWUgPj0gMCA/IGxvY2FsVGltZSA6IDA7XG4gIHJldHVybiBuZXcgRGF0ZSh0aW1lVG9Db252ZXJ0KTtcbn07XG5cbi8qKlxuICogRm9ybWF0IG51bWJlciB3aXRoIHNlcGFyYXRvcnMgYW5kIG51bWJlciBvZiBkZWNpbWFscy5cbiAqIElucHV0OiB2YWx1ZSA6OiBbbnVtYmVyLCBmbG9hdCwgc3RyaW5nXVxuICogb3B0aW9ucyA6OiBvYmplY3QgKG9wdGlvbmFsKVxuICogICAgZGVjaW1hbHMgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG92ZXJyaWRlcyBudW1iZXIgb2YgZGVjaW1hbHNcbiAqICAgIHRob3VzYW5kU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAvLyBkZWZhdWx0cyB0byBub25lXG4gKiAgICBkZWNpbWFsU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAgLy8gZGVmYXVsdHMgdG8gJy4nXG4gKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsIHsgZGVjaW1hbHM6IDIgfS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6XG4gKiAgNTAwMCwgeyBkZWNpbWFsczogMiwgdGhvdXNhbmRTZXBhcmF0b3I6ICcsJywgZGVjaW1hbFNlcGFyYXRvcjogJy4nIH1cbiAqICBvdXRwdXQ6ICc1LDAwMC4wMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXROdW1iZXIgPSAodmFsdWUsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCBkZWNpbWFscyA9IG9wdGlvbnMuZGVjaW1hbHMgfHwgMDtcbiAgY29uc3QgaXNUcyA9IHR5cGVvZiBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yLmxlbmd0aDtcbiAgY29uc3QgaXNEcyA9IHR5cGVvZiBvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvci5sZW5ndGg7XG4gIGNvbnN0IGZpeGVkTnVtYmVyID0gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKGRlY2ltYWxzKTtcbiAgaWYgKGlzVHMgfHwgaXNEcykge1xuICAgIGlmIChkZWNpbWFscyA+IDApIHtcbiAgICAgIGNvbnN0IHNwbGl0ID0gZml4ZWROdW1iZXIuc3BsaXQoJy4nKTtcbiAgICAgIGlmIChpc1RzKSB7XG4gICAgICAgIHNwbGl0WzBdID0gc3BsaXRbMF0ucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgICB9XG4gICAgICBpZiAoaXNEcykge1xuICAgICAgICByZXR1cm4gc3BsaXQuam9pbihvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNwbGl0LmpvaW4oJy4nKTtcbiAgICB9XG4gICAgaWYgKGlzVHMpIHtcbiAgICAgIHJldHVybiBmaXhlZE51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpeGVkTnVtYmVyO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgYW1vdW50IGFjY29yZGluZyB0byBpdHMgY3VycmVuY3kuXG4gKiBJbnB1dDogYW1vdW50IDo6IFtudW1iZXIsIHN0cmluZ11cbiAqIG9wdGlvbnMgOjogb2JqZWN0IChvcHRpb25hbClcbiAqICAgIGN1cnJlbmN5IDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBudW1iZXIgb2YgZGVjaW1hbHMgYnkgY3VycmVuY3lcbiAqICAgIGRlY2ltYWxzIDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBvdmVycmlkZXMgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiAgICB0aG91c2FuZFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgLy8gZGVmYXVsdHMgdG8gbm9uZVxuICogICAgZGVjaW1hbFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgIC8vIGRlZmF1bHRzIHRvICcuJ1xuICogICAgbXVsdGlwbGllciA6OiBudW1iZXIgKG9wdGlvbmFsKSAgICAgICAgIC8vIGFtb3VudCBpcyBtdWx0aXBsaWVkIGJ5IG11bHRpcGxpZXJcbiAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEsICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICogRXhhbXBsZSBvZiBpbnB1dDpcbiAqICA1MDAwLCB7IGN1cnJlbmN5OiAnRVVSJywgdGhvdXNhbmRTZXBhcmF0b3I6ICcsJywgZGVjaW1hbFNlcGFyYXRvcjogJy4nIH1cbiAqICBvdXRwdXQ6ICc1LDAwMC4wMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRDdXJyZW5jeUFtb3VudCA9IChhbW91bnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgYW1vdW50U3RyID0gU3RyaW5nKGFtb3VudCkucmVwbGFjZSgvXFxzL2csICcnKTtcblxuICAvLyBTdHJpcHMgYWxsIGNvbW1hcyBPUiByZXBsYWNlcyBhbGwgY29tbWFzIHdpdGggZG90cywgaWYgY29tbWEgaXNuJ3QgdXNlZCBhcyBhIHRob3VzYW5kIHNlcGFyYXRvclxuICBjb25zdCByZXBsYWNlVmFsdWUgPSAob3B0aW9ucy50aG91c2FuZFNlcGFyYXRvciAhPT0gJywnKSA/ICcuJyA6ICcnO1xuICBhbW91bnRTdHIgPSBhbW91bnRTdHIucmVwbGFjZSgvLC9nLCByZXBsYWNlVmFsdWUpO1xuICBjb25zdCB7IG11bHRpcGxpZXIgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGFtb3VudEZsb2F0ID0gbXVsdGlwbGllciA/IG11bHRpcGxpZXIgKiBwYXJzZUZsb2F0KGFtb3VudFN0cikgOiBwYXJzZUZsb2F0KGFtb3VudFN0cik7XG5cbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzID09PSB1bmRlZmluZWRcbiAgICA/IGdldEN1cnJlbmN5RGVjaW1hbHMob3B0aW9ucy5jdXJyZW5jeSlcbiAgICA6IG9wdGlvbnMuZGVjaW1hbHM7XG4gIHJldHVybiBmb3JtYXROdW1iZXIoYW1vdW50RmxvYXQsIHsgLi4ub3B0aW9ucywgZGVjaW1hbHMgfSk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBkYXRlIHRvIGEgY2hvc2VuIGZvcm1hdC5cbiAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nLlxuICogT3V0cHV0OiBkYXRlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMDEuMDEuMjAxNycuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXREYXRlID0gKHZhbHVlLCBkYXRlRm9ybWF0KSA9PiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgU0tJUFBFRF9EQVRFX0ZPUk1BVCwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmZvcm1hdChkYXRlRm9ybWF0KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBsb2NhbGl6ZWQgZGF0ZSBzdHJpbmcgdG8gSVNPIHRpbWVzdGFtcC5cbiAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nIChvcHRpb25hbCksIHNpZ24gb2Ygc3RyaWN0IGRhdGUgZm9ybWF0IDo6XG4gKiBib29sZWFuIChvcHRpb25hbCksIGRlZmF1bHQgdmFsdWUgOjogc3RyaW5nIChvcHRpb25hbCksIGRlZmF1bHQgZGF0ZSBmb3JtYXQgOjpcbiAqIHN0cmluZyAob3B0aW9uYWwpLlxuICogT3V0cHV0OiBJU08gdGltZXN0YW1wIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcwMS4wMScsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RGF0ZVRvSVNPID0gKFxuICB2YWx1ZSxcbiAgZGF0ZUZvcm1hdCA9IG51bGwsXG4gIGlzU3RyaWN0ID0gZmFsc2UsXG4gIGRlZmF1bHRWYWx1ZSA9ICcnLFxuICBkZWZhdWx0RGF0ZUZvcm1hdCA9IG51bGwsXG4pID0+IHtcbiAgaWYgKGlzU3RyaWN0ICYmIG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIGlmIChkYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgaWYgKGRlZmF1bHREYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgYW4gaW5wdXQgdG8gYSBmbG9hdCB3aXRoIGZpeGVkIG51bWJlciBvZiBkZWNpbWFscy5cbiAqIElucHV0OiB2YWx1ZSB0byBmb3JtYXQgOjogW251bWJlciwgc3RyaW5nXSwgZGVjaW1hbHMgOjogbnVtYmVyLlxuICogT3V0cHV0OiBmb3JtYXR0ZWQgdmFsdWUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzIzIDAwMC4xYWJjJywgJzInLiBFeGFtcGxlIG9mIG91dHB1dDogJzIzMDAwLjEwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEZsb2F0VG9GaXhlZERlY2ltYWxzID0gKHZhbHVlLCBkZWNpbWFscykgPT4ge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cbiAgbGV0IGZsb2F0VmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgLnJlcGxhY2UoL1teXFxkLiwtXS9nLCAnJylcbiAgICAucmVwbGFjZSgnLCcsICcuJyk7XG4gIGZsb2F0VmFsdWUgPSBpc05hTihOdW1iZXIoZmxvYXRWYWx1ZSkpID8gMCA6IE51bWJlcihmbG9hdFZhbHVlKTtcbiAgcmV0dXJuIGZsb2F0VmFsdWUudG9GaXhlZChkZWNpbWFscyk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBGWCByYXRlLlxuICogSW5wdXQ6IHJhdGUuXG4gKiBPdXRwdXQ6IHJhdGUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjExMDAwMCcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTIzNDU2NzgnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RlhSYXRlID0gdmFsdWUgPT4gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKGdldEZYUmF0ZURlY2ltYWxzKHZhbHVlKSk7XG4iXX0=