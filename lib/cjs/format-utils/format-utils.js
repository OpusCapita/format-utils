'use strict';

exports.__esModule = true;
exports.formatFXRate = exports.formatFloatToFixedDecimals = exports.formatDateToISO = exports.formatDate = exports.formatCurrencyAmount = exports.getLocalDateTime = exports.getFXRateDecimals = exports.getCurrencyDecimals = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _formatUtils = require('./format-utils.constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a number of decimal digits for a currency.
 * Input: currency code :: string.
 * Output: decimals :: number.
 * Example of input: 'EUR'. Example of output: 2.
 * Example of input: 'JPY'. Example of output: 0.
 * Defaults to 2.
 */
var getCurrencyDecimals = exports.getCurrencyDecimals = function getCurrencyDecimals(currency) {
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
var getFXRateDecimals = exports.getFXRateDecimals = function getFXRateDecimals(value) {
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
var getLocalDateTime = exports.getLocalDateTime = function getLocalDateTime(timestamp) {
  var isoTimestamp = timestamp !== null && timestamp.slice(-1) !== 'Z' ? timestamp + 'Z' : timestamp;
  var localTime = new Date(isoTimestamp) - new Date(timestamp).getTimezoneOffset();
  var timeToConvert = localTime >= 0 ? localTime : 0;
  return new Date(timeToConvert);
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
 *  output: '5.000,00'.
 */
var formatCurrencyAmount = exports.formatCurrencyAmount = function formatCurrencyAmount(amount) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var decimals = options.decimals || getCurrencyDecimals(options.currency);
  var isTs = typeof options.thousandSeparator === 'string' && options.thousandSeparator.length;
  var isDs = typeof options.decimalSeparator === 'string' && options.decimalSeparator.length;
  var fixedNumber = Number(amount).toFixed(decimals);
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
    } else if (isTs) {
      return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, options.thousandSeparator);
    }
  }
  return fixedNumber;
};

/**
 * Format date to a chosen format.
 * Input: date :: string, date format :: string.
 * Output: date :: string.
 * Example of input: '2017-01-01T00:00:00.000Z', 'DD.MM.YYYY'. Example of output: '01.01.2017'.
 */
var formatDate = exports.formatDate = function formatDate(value, dateFormat) {
  if (value === null) {
    return '';
  }
  if (_moment2.default.utc(value, _formatUtils.SKIPPED_DATE_FORMAT, true).isValid()) {
    return value;
  }
  if (_moment2.default.utc(value, _moment2.default.ISO_8601, true).isValid()) {
    return _moment2.default.utc(value, _moment2.default.ISO_8601, true).format(dateFormat);
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
var formatDateToISO = exports.formatDateToISO = function formatDateToISO(value) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var isStrict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var defaultValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var defaultDateFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  if (isStrict && _moment2.default.utc(value, _formatUtils.SKIPPED_DATE_FORMAT, isStrict).isValid()) {
    return value;
  }
  if (_moment2.default.utc(value, _moment2.default.ISO_8601, isStrict).isValid()) {
    return _moment2.default.utc(value, _moment2.default.ISO_8601, isStrict).toISOString();
  }
  if (dateFormat !== null && _moment2.default.utc(value, dateFormat, isStrict).isValid()) {
    return _moment2.default.utc(value, dateFormat, isStrict).toISOString();
  }
  if (defaultDateFormat !== null && _moment2.default.utc(value, defaultDateFormat, isStrict).isValid()) {
    return _moment2.default.utc(value, defaultDateFormat, isStrict).toISOString();
  }
  return defaultValue;
};

/**
 * Format an input to a float with fixed number of decimals.
 * Input: value to format :: [number, string], decimals :: number.
 * Output: formatted value :: string.
 * Example of input: '23 000.1abc', '2'. Example of output: '23000.10'.
 */
var formatFloatToFixedDecimals = exports.formatFloatToFixedDecimals = function formatFloatToFixedDecimals(value, decimals) {
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
var formatFXRate = exports.formatFXRate = function formatFXRate(value) {
  return Number(value).toFixed(getFXRateDecimals(value));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbImdldEN1cnJlbmN5RGVjaW1hbHMiLCJjdXJyZW5jeSIsIm51bWJlck9wdGlvbnMiLCJzdHlsZSIsImN1cnJlbmN5RGlzcGxheSIsInVzZUdyb3VwaW5nIiwidGVzdCIsIkludGwiLCJOdW1iZXJGb3JtYXQiLCJmb3JtYXQiLCJyZXBsYWNlIiwiZm91bmRTZXBhcmF0b3IiLCJzZWFyY2giLCJsZW5ndGgiLCJlIiwiY29uc29sZSIsImVycm9yIiwiZ2V0RlhSYXRlRGVjaW1hbHMiLCJ2YWx1ZSIsInZhbHVlU3RyaW5nIiwiU3RyaW5nIiwicGFyc2VGbG9hdCIsImRlY2ltYWxTZXBhcmF0b3IiLCJpbmRleE9mIiwiZGVjaW1hbE51bWJlciIsImdldExvY2FsRGF0ZVRpbWUiLCJ0aW1lc3RhbXAiLCJpc29UaW1lc3RhbXAiLCJzbGljZSIsImxvY2FsVGltZSIsIkRhdGUiLCJnZXRUaW1lem9uZU9mZnNldCIsInRpbWVUb0NvbnZlcnQiLCJmb3JtYXRDdXJyZW5jeUFtb3VudCIsImFtb3VudCIsIm9wdGlvbnMiLCJkZWNpbWFscyIsImlzVHMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImlzRHMiLCJmaXhlZE51bWJlciIsIk51bWJlciIsInRvRml4ZWQiLCJzcGxpdCIsImpvaW4iLCJmb3JtYXREYXRlIiwiZGF0ZUZvcm1hdCIsInV0YyIsImlzVmFsaWQiLCJJU09fODYwMSIsImZvcm1hdERhdGVUb0lTTyIsImlzU3RyaWN0IiwiZGVmYXVsdFZhbHVlIiwiZGVmYXVsdERhdGVGb3JtYXQiLCJ0b0lTT1N0cmluZyIsImZvcm1hdEZsb2F0VG9GaXhlZERlY2ltYWxzIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwiZm9ybWF0RlhSYXRlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7O0FBRUE7Ozs7QUFNQTs7Ozs7Ozs7QUFRTyxJQUFNQSxvREFBc0IsU0FBdEJBLG1CQUFzQixD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Ozs7Ozs7QUFPTyxJQUFNc0Isc0NBQWUsU0FBZkEsWUFBZTtBQUFBLFNBQVNqQixPQUFPdkIsS0FBUCxFQUFjd0IsT0FBZCxDQUFzQnpCLGtCQUFrQkMsS0FBbEIsQ0FBdEIsQ0FBVDtBQUFBLENBQXJCIiwiZmlsZSI6ImZvcm1hdC11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IHtcbiAgREVGQVVMVF9DVVJSRU5DWSxcbiAgRlhSQVRFX0RFQ0lNQUxTLFxuICBTS0lQUEVEX0RBVEVfRk9STUFULFxufSBmcm9tICcuL2Zvcm1hdC11dGlscy5jb25zdGFudHMnO1xuXG4vKipcbiAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBjdXJyZW5jeS5cbiAqIElucHV0OiBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAwLlxuICogRGVmYXVsdHMgdG8gMi5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEN1cnJlbmN5RGVjaW1hbHMgPSAoY3VycmVuY3kpID0+IHtcbiAgY29uc3QgbnVtYmVyT3B0aW9ucyA9IHtcbiAgICBjdXJyZW5jeTogY3VycmVuY3kgfHwgREVGQVVMVF9DVVJSRU5DWSxcbiAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICBjdXJyZW5jeURpc3BsYXk6ICdjb2RlJyxcbiAgICB1c2VHcm91cGluZzogZmFsc2UsXG4gIH07XG4gIHRyeSB7XG4gICAgY29uc3QgdGVzdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCgnZW4tR0InLCBudW1iZXJPcHRpb25zKS5mb3JtYXQoMS4xMTExMTEpLnJlcGxhY2UoL1teXFxkLixdL2csICcnKTtcbiAgICBjb25zdCBmb3VuZFNlcGFyYXRvciA9IHRlc3Quc2VhcmNoKC9bLixdL2cpO1xuICAgIGlmIChmb3VuZFNlcGFyYXRvciA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGVzdC5sZW5ndGggLSBmb3VuZFNlcGFyYXRvciAtIDE7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgcmV0dXJuIDI7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogNi5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiA4LlxuICovXG5leHBvcnQgY29uc3QgZ2V0RlhSYXRlRGVjaW1hbHMgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgdmFsdWVTdHJpbmcgPSBTdHJpbmcocGFyc2VGbG9hdChTdHJpbmcodmFsdWUpKSk7XG4gIGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgPSB2YWx1ZVN0cmluZy5pbmRleE9mKCcuJyk7XG4gIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkZWNpbWFsU2VwYXJhdG9yIC0gMTtcbiAgcmV0dXJuIChkZWNpbWFsU2VwYXJhdG9yID09PSAtMSB8fCBkZWNpbWFsTnVtYmVyIDw9IEZYUkFURV9ERUNJTUFMUykgP1xuICAgIEZYUkFURV9ERUNJTUFMUyA6IGRlY2ltYWxOdW1iZXI7XG59O1xuXG4vKipcbiAqIEdldCBsb2NhbCBkYXRlIGFuZCB0aW1lIGZyb20gSVNPIDg2MDEgdGltZXN0YW1wLiBJdCdzIGNyb3NzLWJyb3dzZXIgKElFIGVzcGVjaWFsbHkhKS5cbiAqIElucHV0OiBVVEMgdGltZXN0YW1wIDo6IHN0cmluZy5cbiAqIE91dHB1dDogdGltZXN0YW1wIDo6IGRhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRMb2NhbERhdGVUaW1lID0gKHRpbWVzdGFtcCkgPT4ge1xuICBjb25zdCBpc29UaW1lc3RhbXAgPSAodGltZXN0YW1wICE9PSBudWxsICYmIHRpbWVzdGFtcC5zbGljZSgtMSkgIT09ICdaJykgP1xuICAgIGAke3RpbWVzdGFtcH1aYCA6IHRpbWVzdGFtcDtcbiAgY29uc3QgbG9jYWxUaW1lID0gbmV3IERhdGUoaXNvVGltZXN0YW1wKSAtIG5ldyBEYXRlKHRpbWVzdGFtcCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgY29uc3QgdGltZVRvQ29udmVydCA9IGxvY2FsVGltZSA+PSAwID8gbG9jYWxUaW1lIDogMDtcbiAgcmV0dXJuIG5ldyBEYXRlKHRpbWVUb0NvbnZlcnQpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgYW1vdW50IGFjY29yZGluZyB0byBpdHMgY3VycmVuY3kuXG4gKiBJbnB1dDogYW1vdW50IDo6IFtudW1iZXIsIHN0cmluZ11cbiAqIG9wdGlvbnMgOjogb2JqZWN0IChvcHRpb25hbClcbiAqICAgIGN1cnJlbmN5IDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBudW1iZXIgb2YgZGVjaW1hbHMgYnkgY3VycmVuY3lcbiAqICAgIGRlY2ltYWxzIDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBvdmVycmlkZXMgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiAgICB0aG91c2FuZFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgLy8gZGVmYXVsdHMgdG8gbm9uZVxuICogICAgZGVjaW1hbFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgIC8vIGRlZmF1bHRzIHRvICcuJ1xuICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMSwgJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4wMCcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMywgJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gKiBFeGFtcGxlIG9mIGlucHV0OlxuICogIDUwMDAsIHsgY3VycmVuY3k6ICdFVVInLCB0aG91c2FuZFNlcGFyYXRvcjogJywnLCBkZWNpbWFsU2VwYXJhdG9yOiAnLicgfVxuICogIG91dHB1dDogJzUuMDAwLDAwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEN1cnJlbmN5QW1vdW50ID0gKGFtb3VudCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyB8fCBnZXRDdXJyZW5jeURlY2ltYWxzKG9wdGlvbnMuY3VycmVuY3kpO1xuICBjb25zdCBpc1RzID0gKHR5cGVvZiBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yLmxlbmd0aCk7XG4gIGNvbnN0IGlzRHMgPSAodHlwZW9mIG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yLmxlbmd0aCk7XG4gIGNvbnN0IGZpeGVkTnVtYmVyID0gTnVtYmVyKGFtb3VudCkudG9GaXhlZChkZWNpbWFscyk7XG4gIGlmIChpc1RzIHx8IGlzRHMpIHtcbiAgICBpZiAoZGVjaW1hbHMgPiAwKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IGZpeGVkTnVtYmVyLnNwbGl0KCcuJyk7XG4gICAgICBpZiAoaXNUcykge1xuICAgICAgICBzcGxpdFswXSA9IHNwbGl0WzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKGlzRHMpIHtcbiAgICAgICAgcmV0dXJuIHNwbGl0LmpvaW4ob3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzcGxpdC5qb2luKCcuJyk7XG4gICAgfSBlbHNlIGlmIChpc1RzKSB7XG4gICAgICByZXR1cm4gZml4ZWROdW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgfVxuICB9XG4gIHJldHVybiBmaXhlZE51bWJlcjtcbn07XG5cbi8qKlxuICogRm9ybWF0IGRhdGUgdG8gYSBjaG9zZW4gZm9ybWF0LlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IGRhdGUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcwMS4wMS4yMDE3Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQpID0+IHtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuZm9ybWF0KGRhdGVGb3JtYXQpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGxvY2FsaXplZCBkYXRlIHN0cmluZyB0byBJU08gdGltZXN0YW1wLlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgc2lnbiBvZiBzdHJpY3QgZGF0ZSBmb3JtYXQgOjpcbiAqIGJvb2xlYW4gKG9wdGlvbmFsKSwgZGVmYXVsdCB2YWx1ZSA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgZGVmYXVsdCBkYXRlIGZvcm1hdCA6OlxuICogc3RyaW5nIChvcHRpb25hbCkuXG4gKiBPdXRwdXQ6IElTTyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXREYXRlVG9JU08gPSAodmFsdWUsIGRhdGVGb3JtYXQgPSBudWxsLCBpc1N0cmljdCA9IGZhbHNlLCBkZWZhdWx0VmFsdWUgPSAnJywgZGVmYXVsdERhdGVGb3JtYXQgPSBudWxsKSA9PiB7XG4gIGlmIChpc1N0cmljdCAmJiBtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIGlmIChkZWZhdWx0RGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFuIGlucHV0IHRvIGEgZmxvYXQgd2l0aCBmaXhlZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgdG8gZm9ybWF0IDo6IFtudW1iZXIsIHN0cmluZ10sIGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIE91dHB1dDogZm9ybWF0dGVkIHZhbHVlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMyAwMDAuMWFiYycsICcyJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMzAwMC4xMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyA9ICh2YWx1ZSwgZGVjaW1hbHMpID0+IHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4gIGxldCBmbG9hdFZhbHVlID0gU3RyaW5nKHZhbHVlKS5yZXBsYWNlKC9bXlxcZC4sLV0vZywgJycpLnJlcGxhY2UoJywnLCAnLicpO1xuICBmbG9hdFZhbHVlID0gaXNOYU4oTnVtYmVyKGZsb2F0VmFsdWUpKSA/IDAgOiBOdW1iZXIoZmxvYXRWYWx1ZSk7XG4gIHJldHVybiBmbG9hdFZhbHVlLnRvRml4ZWQoZGVjaW1hbHMpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlLlxuICogT3V0cHV0OiByYXRlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMTAwMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyMzQ1Njc4Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEZYUmF0ZSA9IHZhbHVlID0+IE51bWJlcih2YWx1ZSkudG9GaXhlZChnZXRGWFJhdGVEZWNpbWFscyh2YWx1ZSkpO1xuIl19