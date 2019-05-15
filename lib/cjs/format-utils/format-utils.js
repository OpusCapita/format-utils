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

  var decimals = options.decimals === undefined ? getCurrencyDecimals(options.currency) : options.decimals;
  return formatNumber(amount, _extends({}, options, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbImdldEN1cnJlbmN5RGVjaW1hbHMiLCJjdXJyZW5jeSIsIm51bWJlck9wdGlvbnMiLCJERUZBVUxUX0NVUlJFTkNZIiwic3R5bGUiLCJjdXJyZW5jeURpc3BsYXkiLCJ1c2VHcm91cGluZyIsInRlc3QiLCJJbnRsIiwiTnVtYmVyRm9ybWF0IiwiZm9ybWF0IiwicmVwbGFjZSIsImZvdW5kU2VwYXJhdG9yIiwic2VhcmNoIiwibGVuZ3RoIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsImdldEZYUmF0ZURlY2ltYWxzIiwidmFsdWUiLCJ2YWx1ZVN0cmluZyIsIlN0cmluZyIsInBhcnNlRmxvYXQiLCJkZWNpbWFsU2VwYXJhdG9yIiwiaW5kZXhPZiIsImRlY2ltYWxOdW1iZXIiLCJGWFJBVEVfREVDSU1BTFMiLCJnZXRMb2NhbERhdGVUaW1lIiwidGltZXN0YW1wIiwiaXNvVGltZXN0YW1wIiwic2xpY2UiLCJsb2NhbFRpbWUiLCJEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ0aW1lVG9Db252ZXJ0IiwiZm9ybWF0TnVtYmVyIiwib3B0aW9ucyIsImRlY2ltYWxzIiwiaXNUcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiaXNEcyIsImZpeGVkTnVtYmVyIiwiTnVtYmVyIiwidG9GaXhlZCIsInNwbGl0Iiwiam9pbiIsImZvcm1hdEN1cnJlbmN5QW1vdW50IiwiYW1vdW50IiwidW5kZWZpbmVkIiwiZm9ybWF0RGF0ZSIsImRhdGVGb3JtYXQiLCJtb21lbnQiLCJ1dGMiLCJTS0lQUEVEX0RBVEVfRk9STUFUIiwiaXNWYWxpZCIsIklTT184NjAxIiwiZm9ybWF0RGF0ZVRvSVNPIiwiaXNTdHJpY3QiLCJkZWZhdWx0VmFsdWUiLCJkZWZhdWx0RGF0ZUZvcm1hdCIsInRvSVNPU3RyaW5nIiwiZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMiLCJmbG9hdFZhbHVlIiwiaXNOYU4i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LEtBQUssQ0FBQ3JCLE1BQU0sQ0FBQ29CLFVBQUQsQ0FBUCxDQUFMLEdBQTRCLENBQTVCLEdBQWdDcEIsTUFBTSxDQUFDb0IsVUFBRCxDQUFuRDtBQUNBLFNBQU9BLFVBQVUsQ0FBQ25CLE9BQVgsQ0FBbUJOLFFBQW5CLENBQVA7QUFDRCxDQVBNO0FBU1A7Ozs7Ozs7Ozs7O0FBT08sSUFBTTJCLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUE3QyxLQUFLO0FBQUEsU0FBSXVCLE1BQU0sQ0FBQ3ZCLEtBQUQsQ0FBTixDQUFjd0IsT0FBZCxDQUFzQnpCLGlCQUFpQixDQUFDQyxLQUFELENBQXZDLENBQUo7QUFBQSxDQUExQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IHsgREVGQVVMVF9DVVJSRU5DWSwgRlhSQVRFX0RFQ0lNQUxTLCBTS0lQUEVEX0RBVEVfRk9STUFUIH0gZnJvbSAnLi9mb3JtYXQtdXRpbHMuY29uc3RhbnRzJztcblxuLyoqXG4gKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgY3VycmVuY3kuXG4gKiBJbnB1dDogY3VycmVuY3kgY29kZSA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogMi5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogMC5cbiAqIERlZmF1bHRzIHRvIDIuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDdXJyZW5jeURlY2ltYWxzID0gKGN1cnJlbmN5KSA9PiB7XG4gIGNvbnN0IG51bWJlck9wdGlvbnMgPSB7XG4gICAgY3VycmVuY3k6IGN1cnJlbmN5IHx8IERFRkFVTFRfQ1VSUkVOQ1ksXG4gICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgY3VycmVuY3lEaXNwbGF5OiAnY29kZScsXG4gICAgdXNlR3JvdXBpbmc6IGZhbHNlLFxuICB9O1xuICB0cnkge1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUdCJywgbnVtYmVyT3B0aW9ucylcbiAgICAgIC5mb3JtYXQoMS4xMTExMTEpXG4gICAgICAucmVwbGFjZSgvW15cXGQuLF0vZywgJycpO1xuICAgIGNvbnN0IGZvdW5kU2VwYXJhdG9yID0gdGVzdC5zZWFyY2goL1suLF0vZyk7XG4gICAgaWYgKGZvdW5kU2VwYXJhdG9yID09PSAtMSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB0ZXN0Lmxlbmd0aCAtIGZvdW5kU2VwYXJhdG9yIC0gMTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICByZXR1cm4gMjtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlIDo6IFtudW1iZXIsIHN0cmluZ10uXG4gKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiA2LlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6IDguXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGWFJhdGVEZWNpbWFscyA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCB2YWx1ZVN0cmluZyA9IFN0cmluZyhwYXJzZUZsb2F0KFN0cmluZyh2YWx1ZSkpKTtcbiAgY29uc3QgZGVjaW1hbFNlcGFyYXRvciA9IHZhbHVlU3RyaW5nLmluZGV4T2YoJy4nKTtcbiAgY29uc3QgZGVjaW1hbE51bWJlciA9IHZhbHVlU3RyaW5nLmxlbmd0aCAtIGRlY2ltYWxTZXBhcmF0b3IgLSAxO1xuICByZXR1cm4gZGVjaW1hbFNlcGFyYXRvciA9PT0gLTEgfHwgZGVjaW1hbE51bWJlciA8PSBGWFJBVEVfREVDSU1BTFNcbiAgICA/IEZYUkFURV9ERUNJTUFMU1xuICAgIDogZGVjaW1hbE51bWJlcjtcbn07XG5cbi8qKlxuICogR2V0IGxvY2FsIGRhdGUgYW5kIHRpbWUgZnJvbSBJU08gODYwMSB0aW1lc3RhbXAuIEl0J3MgY3Jvc3MtYnJvd3NlciAoSUUgZXNwZWNpYWxseSEpLlxuICogSW5wdXQ6IFVUQyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogT3V0cHV0OiB0aW1lc3RhbXAgOjogZGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldExvY2FsRGF0ZVRpbWUgPSAodGltZXN0YW1wKSA9PiB7XG4gIGNvbnN0IGlzb1RpbWVzdGFtcCA9IHRpbWVzdGFtcCAhPT0gbnVsbCAmJiB0aW1lc3RhbXAuc2xpY2UoLTEpICE9PSAnWidcbiAgICA/IGAke3RpbWVzdGFtcH1aYFxuICAgIDogdGltZXN0YW1wO1xuICBjb25zdCBsb2NhbFRpbWUgPSBuZXcgRGF0ZShpc29UaW1lc3RhbXApIC0gbmV3IERhdGUodGltZXN0YW1wKS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICBjb25zdCB0aW1lVG9Db252ZXJ0ID0gbG9jYWxUaW1lID49IDAgPyBsb2NhbFRpbWUgOiAwO1xuICByZXR1cm4gbmV3IERhdGUodGltZVRvQ29udmVydCk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBudW1iZXIgd2l0aCBzZXBhcmF0b3JzIGFuZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgOjogW251bWJlciwgZmxvYXQsIHN0cmluZ11cbiAqIG9wdGlvbnMgOjogb2JqZWN0IChvcHRpb25hbClcbiAqICAgIGRlY2ltYWxzIDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBvdmVycmlkZXMgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiAgICB0aG91c2FuZFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgLy8gZGVmYXVsdHMgdG8gbm9uZVxuICogICAgZGVjaW1hbFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgIC8vIGRlZmF1bHRzIHRvICcuJ1xuICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCB7IGRlY2ltYWxzOiAyIH0uIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMicuXG4gKiBFeGFtcGxlIG9mIGlucHV0OlxuICogIDUwMDAsIHsgZGVjaW1hbHM6IDIsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0TnVtYmVyID0gKHZhbHVlLCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzIHx8IDA7XG4gIGNvbnN0IGlzVHMgPSB0eXBlb2Ygb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvci5sZW5ndGg7XG4gIGNvbnN0IGlzRHMgPSB0eXBlb2Ygb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IubGVuZ3RoO1xuICBjb25zdCBmaXhlZE51bWJlciA9IE51bWJlcih2YWx1ZSkudG9GaXhlZChkZWNpbWFscyk7XG4gIGlmIChpc1RzIHx8IGlzRHMpIHtcbiAgICBpZiAoZGVjaW1hbHMgPiAwKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IGZpeGVkTnVtYmVyLnNwbGl0KCcuJyk7XG4gICAgICBpZiAoaXNUcykge1xuICAgICAgICBzcGxpdFswXSA9IHNwbGl0WzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKGlzRHMpIHtcbiAgICAgICAgcmV0dXJuIHNwbGl0LmpvaW4ob3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzcGxpdC5qb2luKCcuJyk7XG4gICAgfVxuICAgIGlmIChpc1RzKSB7XG4gICAgICByZXR1cm4gZml4ZWROdW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgfVxuICB9XG4gIHJldHVybiBmaXhlZE51bWJlcjtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFtb3VudCBhY2NvcmRpbmcgdG8gaXRzIGN1cnJlbmN5LlxuICogSW5wdXQ6IGFtb3VudCA6OiBbbnVtYmVyLCBzdHJpbmddXG4gKiBvcHRpb25zIDo6IG9iamVjdCAob3B0aW9uYWwpXG4gKiAgICBjdXJyZW5jeSA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gbnVtYmVyIG9mIGRlY2ltYWxzIGJ5IGN1cnJlbmN5XG4gKiAgICBkZWNpbWFscyA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gb3ZlcnJpZGVzIG51bWJlciBvZiBkZWNpbWFsc1xuICogICAgdGhvdXNhbmRTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgIC8vIGRlZmF1bHRzIHRvIG5vbmVcbiAqICAgIGRlY2ltYWxTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgICAvLyBkZWZhdWx0cyB0byAnLidcbiAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEsICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICogRXhhbXBsZSBvZiBpbnB1dDpcbiAqICA1MDAwLCB7IGN1cnJlbmN5OiAnRVVSJywgdGhvdXNhbmRTZXBhcmF0b3I6ICcsJywgZGVjaW1hbFNlcGFyYXRvcjogJy4nIH1cbiAqICBvdXRwdXQ6ICc1LDAwMC4wMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRDdXJyZW5jeUFtb3VudCA9IChhbW91bnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCBkZWNpbWFscyA9IG9wdGlvbnMuZGVjaW1hbHMgPT09IHVuZGVmaW5lZFxuICAgID8gZ2V0Q3VycmVuY3lEZWNpbWFscyhvcHRpb25zLmN1cnJlbmN5KVxuICAgIDogb3B0aW9ucy5kZWNpbWFscztcbiAgcmV0dXJuIGZvcm1hdE51bWJlcihhbW91bnQsIHsgLi4ub3B0aW9ucywgZGVjaW1hbHMgfSk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBkYXRlIHRvIGEgY2hvc2VuIGZvcm1hdC5cbiAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nLlxuICogT3V0cHV0OiBkYXRlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMDEuMDEuMjAxNycuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXREYXRlID0gKHZhbHVlLCBkYXRlRm9ybWF0KSA9PiB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgU0tJUFBFRF9EQVRFX0ZPUk1BVCwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmZvcm1hdChkYXRlRm9ybWF0KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBsb2NhbGl6ZWQgZGF0ZSBzdHJpbmcgdG8gSVNPIHRpbWVzdGFtcC5cbiAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nIChvcHRpb25hbCksIHNpZ24gb2Ygc3RyaWN0IGRhdGUgZm9ybWF0IDo6XG4gKiBib29sZWFuIChvcHRpb25hbCksIGRlZmF1bHQgdmFsdWUgOjogc3RyaW5nIChvcHRpb25hbCksIGRlZmF1bHQgZGF0ZSBmb3JtYXQgOjpcbiAqIHN0cmluZyAob3B0aW9uYWwpLlxuICogT3V0cHV0OiBJU08gdGltZXN0YW1wIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcwMS4wMScsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RGF0ZVRvSVNPID0gKFxuICB2YWx1ZSxcbiAgZGF0ZUZvcm1hdCA9IG51bGwsXG4gIGlzU3RyaWN0ID0gZmFsc2UsXG4gIGRlZmF1bHRWYWx1ZSA9ICcnLFxuICBkZWZhdWx0RGF0ZUZvcm1hdCA9IG51bGwsXG4pID0+IHtcbiAgaWYgKGlzU3RyaWN0ICYmIG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIGlmIChkYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgaWYgKGRlZmF1bHREYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgYW4gaW5wdXQgdG8gYSBmbG9hdCB3aXRoIGZpeGVkIG51bWJlciBvZiBkZWNpbWFscy5cbiAqIElucHV0OiB2YWx1ZSB0byBmb3JtYXQgOjogW251bWJlciwgc3RyaW5nXSwgZGVjaW1hbHMgOjogbnVtYmVyLlxuICogT3V0cHV0OiBmb3JtYXR0ZWQgdmFsdWUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzIzIDAwMC4xYWJjJywgJzInLiBFeGFtcGxlIG9mIG91dHB1dDogJzIzMDAwLjEwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEZsb2F0VG9GaXhlZERlY2ltYWxzID0gKHZhbHVlLCBkZWNpbWFscykgPT4ge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cbiAgbGV0IGZsb2F0VmFsdWUgPSBTdHJpbmcodmFsdWUpXG4gICAgLnJlcGxhY2UoL1teXFxkLiwtXS9nLCAnJylcbiAgICAucmVwbGFjZSgnLCcsICcuJyk7XG4gIGZsb2F0VmFsdWUgPSBpc05hTihOdW1iZXIoZmxvYXRWYWx1ZSkpID8gMCA6IE51bWJlcihmbG9hdFZhbHVlKTtcbiAgcmV0dXJuIGZsb2F0VmFsdWUudG9GaXhlZChkZWNpbWFscyk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBGWCByYXRlLlxuICogSW5wdXQ6IHJhdGUuXG4gKiBPdXRwdXQ6IHJhdGUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjExMDAwMCcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTIzNDU2NzgnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RlhSYXRlID0gdmFsdWUgPT4gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKGdldEZYUmF0ZURlY2ltYWxzKHZhbHVlKSk7XG4iXX0=