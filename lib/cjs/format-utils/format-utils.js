'use strict';

exports.__esModule = true;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _formatUtils = require('./format-utils.constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormatUtils = function FormatUtils() {
  var _this = this;

  _classCallCheck(this, FormatUtils);

  this.getCurrencyDecimals = function (currency) {
    var numberOptions = {
      currency: currency,
      style: 'currency',
      currencyDisplay: 'code',
      useGrouping: false
    };
    var test = new Intl.NumberFormat('en-GB', numberOptions).format(1.111111).replace(/[^\d.,]/g, '');
    var foundSeparator = test.search(/[.,]/g);
    if (foundSeparator === -1) {
      return 0;
    }
    return test.length - foundSeparator - 1;
  };

  this.getFXRateDecimals = function (value) {
    var valueString = String(parseFloat(String(value)));
    var decimalSeparator = valueString.indexOf('.');
    var decimalNumber = valueString.length - decimalSeparator - 1;
    return decimalSeparator === -1 || decimalNumber <= _formatUtils.FXRATE_DECIMALS ? _formatUtils.FXRATE_DECIMALS : decimalNumber;
  };

  this.getLocalDateTime = function (timestamp) {
    var isoTimestamp = timestamp !== null && timestamp.slice(-1) !== 'Z' ? timestamp + 'Z' : timestamp;
    var localTime = new Date(isoTimestamp) - new Date(timestamp).getTimezoneOffset();
    var timeToConvert = localTime >= 0 ? localTime : 0;
    return new Date(timeToConvert);
  };

  this.formatCurrencyAmount = function (value, currency) {
    return Number(value).toFixed(_this.getCurrencyDecimals(currency));
  };

  this.formatFXRate = function (value) {
    return Number(value).toFixed(_this.getFXRateDecimals(value));
  };

  this.formatFloatToFixedDecimals = function (value, decimals) {
    /* eslint-disable no-restricted-globals */
    var floatValue = String(value).replace(/[^\d.,-]/g, '').replace(',', '.');
    floatValue = isNaN(Number(floatValue)) ? 0 : Number(floatValue);
    return floatValue.toFixed(decimals);
  };

  this.formatDate = function (value, dateFormat) {
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

  this.formatDateToISO = function (value) {
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

  this.parseDate = function (value, dateFormat) {
    var newFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (_moment2.default.utc(value, dateFormat).isValid()) {
      return newFormat === null ? _moment2.default.utc(value, dateFormat).toISOString() : _moment2.default.utc(value, dateFormat).format(newFormat);
    } else if (_moment2.default.utc(value, _moment2.default.ISO_8601).isValid()) {
      return newFormat === null ? _moment2.default.utc(value, _moment2.default.ISO_8601).toISOString() : _moment2.default.utc(value, _moment2.default.ISO_8601).format(newFormat);
    }
    return null;
  };

  this.parseFloat = function (value, decimalSeparator) {
    if (!value || String(value).length === 0) {
      return value;
    }
    return String(value).replace(decimalSeparator, '.');
  };

  this.parseNumber = function (value) {
    return String(value).replace(/[^\d-]/g, '') || '';
  };
}
/**
 * Get a number of decimal digits for a currency.
 * Input: currency code :: string.
 * Output: decimals :: number.
 * Example of input: 'EUR'. Example of output: 2.
 * Example of input: 'JPY'. Example of output: 0.
 */


/**
 * Get a number of decimal digits for a FX rate.
 * Input: rate :: [number, string].
 * Output: decimals :: number.
 * Example of input: 1.11. Example of output: 6.
 * Example of input: 1.12345678. Example of output: 8.
 */


/**
 * Get local date and time from ISO 8601 timestamp. It's cross-browser (IE especially!).
  * Input: UTC timestamp :: string.
  * Output: timestamp :: date.
  */


/**
 * Format amount according to its currency.
 * Input: amount :: [number, string], currency code :: string.
 * Output: amount :: string.
 * Example of input: 1, 'EUR'. Example of output: '1.00'.
 * Example of input: 1.123, 'JPY'. Example of output: '1'.
 */


/**
 * Format FX rate.
 * Input: rate.
 * Output: rate :: string.
 * Example of input: 1.11. Example of output: '1.110000'.
 * Example of input: 1.12345678. Example of output: '1.12345678'.
 */


/**
 * Format an input to a float with fixed number of decimals.
 * Input: value to format :: [number, string], decimals :: number.
 * Output: formatted value :: string.
 * Example of input: '23 000.1abc', '2'. Example of output: '23000.10'.
 */


/**
 * Format date to a chosen format.
 * Input: date :: string, date format :: string.
 * Output: date :: string.
 * Example of input: '2017-01-01T00:00:00.000Z', 'DD.MM.YYYY'. Example of output: '01.01.2017'.
 */


/**
 * Format localized date string to ISO timestamp.
 * Input: date :: string, date format :: string (optional), sign of strict date format ::
 * boolean (optional), default value :: string (optional), default date format ::
 * string (optional).
 * Output: ISO timestamp :: string.
 * Example of input: '01.01', 'DD.MM.YYYY'. Example of output: '2017-01-01T00:00:00.000Z'.
 */


/**
 * Parse date string to ISO string or a new format.
 * Input: date :: string, date format :: string, new date format :: string (optional).
 * Output: date :: string.
 * Example of input: '01.01.2017', 'DD.MM.YYYY'. Example of output: '2017-01-01T00:00:00.000Z'.
 * Example of input: '01.01.2017', 'DD.MM.YYYY', 'YYYY-MM-DD'. Example of output: '2017-01-01'.
 */


/**
 * Parse float.
 * Input: value :: [number, string], decimal separator :: string.
 * Output: value :: string.
 * Example of input: '1,1', ','. Example of output: '1.1'.
 */


/**
 * Parse number.
 * Input: value :: [number, string].
 * Output: value :: string.
 * Example of input: '1ab'. Example of output: '1'.
 */
;

exports.default = new FormatUtils();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIkZvcm1hdFV0aWxzIiwiZ2V0Q3VycmVuY3lEZWNpbWFscyIsImN1cnJlbmN5IiwibnVtYmVyT3B0aW9ucyIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsImdldEZYUmF0ZURlY2ltYWxzIiwidmFsdWUiLCJ2YWx1ZVN0cmluZyIsIlN0cmluZyIsInBhcnNlRmxvYXQiLCJkZWNpbWFsU2VwYXJhdG9yIiwiaW5kZXhPZiIsImRlY2ltYWxOdW1iZXIiLCJnZXRMb2NhbERhdGVUaW1lIiwidGltZXN0YW1wIiwiaXNvVGltZXN0YW1wIiwic2xpY2UiLCJsb2NhbFRpbWUiLCJEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ0aW1lVG9Db252ZXJ0IiwiZm9ybWF0Q3VycmVuY3lBbW91bnQiLCJOdW1iZXIiLCJ0b0ZpeGVkIiwiZm9ybWF0RlhSYXRlIiwiZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMiLCJkZWNpbWFscyIsImZsb2F0VmFsdWUiLCJpc05hTiIsImZvcm1hdERhdGUiLCJkYXRlRm9ybWF0IiwidXRjIiwiaXNWYWxpZCIsIklTT184NjAxIiwiZm9ybWF0RGF0ZVRvSVNPIiwiaXNTdHJpY3QiLCJkZWZhdWx0VmFsdWUiLCJkZWZhdWx0RGF0ZUZvcm1hdCIsInRvSVNPU3RyaW5nIiwicGFyc2VEYXRlIiwibmV3Rm9ybWF0IiwicGFyc2VOdW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUVBOzs7Ozs7SUFLTUEsVzs7Ozs7T0FRSkMsbUIsR0FBc0IsVUFBQ0MsUUFBRCxFQUFjO0FBQ2xDLFFBQU1DLGdCQUFnQjtBQUNwQkQsd0JBRG9CO0FBRXBCRSxhQUFPLFVBRmE7QUFH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Ozs7O0FBVUE7Ozs7Ozs7OztBQVNBOzs7Ozs7OztBQWFBOzs7Ozs7OztBQW1CQTs7Ozs7Ozs7OztBQXdCQTs7Ozs7Ozs7O0FBa0JBOzs7Ozs7OztBQWFBOzs7Ozs7OztrQkFTYSxJQUFJWCxXQUFKLEUiLCJmaWxlIjoiZm9ybWF0LXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQge1xuICBGWFJBVEVfREVDSU1BTFMsXG4gIFNLSVBQRURfREFURV9GT1JNQVQsXG59IGZyb20gJy4vZm9ybWF0LXV0aWxzLmNvbnN0YW50cyc7XG5cbmNsYXNzIEZvcm1hdFV0aWxzIHtcbiAgLyoqXG4gICAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBjdXJyZW5jeS5cbiAgICogSW5wdXQ6IGN1cnJlbmN5IGNvZGUgOjogc3RyaW5nLlxuICAgKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAyLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDAuXG4gICAqL1xuICBnZXRDdXJyZW5jeURlY2ltYWxzID0gKGN1cnJlbmN5KSA9PiB7XG4gICAgY29uc3QgbnVtYmVyT3B0aW9ucyA9IHtcbiAgICAgIGN1cnJlbmN5LFxuICAgICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgICBjdXJyZW5jeURpc3BsYXk6ICdjb2RlJyxcbiAgICAgIHVzZUdyb3VwaW5nOiBmYWxzZSxcbiAgICB9O1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUdCJywgbnVtYmVyT3B0aW9ucykuZm9ybWF0KDEuMTExMTExKS5yZXBsYWNlKC9bXlxcZC4sXS9nLCAnJyk7XG4gICAgY29uc3QgZm91bmRTZXBhcmF0b3IgPSB0ZXN0LnNlYXJjaCgvWy4sXS9nKTtcbiAgICBpZiAoZm91bmRTZXBhcmF0b3IgPT09IC0xKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRlc3QubGVuZ3RoIC0gZm91bmRTZXBhcmF0b3IgLSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBGWCByYXRlLlxuICAgKiBJbnB1dDogcmF0ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICAgKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6IDYuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiA4LlxuICAgKi9cbiAgZ2V0RlhSYXRlRGVjaW1hbHMgPSAodmFsdWUpID0+IHtcbiAgICBjb25zdCB2YWx1ZVN0cmluZyA9IFN0cmluZyhwYXJzZUZsb2F0KFN0cmluZyh2YWx1ZSkpKTtcbiAgICBjb25zdCBkZWNpbWFsU2VwYXJhdG9yID0gdmFsdWVTdHJpbmcuaW5kZXhPZignLicpO1xuICAgIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkZWNpbWFsU2VwYXJhdG9yIC0gMTtcbiAgICByZXR1cm4gKGRlY2ltYWxTZXBhcmF0b3IgPT09IC0xIHx8IGRlY2ltYWxOdW1iZXIgPD0gRlhSQVRFX0RFQ0lNQUxTKSA/XG4gICAgICBGWFJBVEVfREVDSU1BTFMgOiBkZWNpbWFsTnVtYmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2NhbCBkYXRlIGFuZCB0aW1lIGZyb20gSVNPIDg2MDEgdGltZXN0YW1wLiBJdCdzIGNyb3NzLWJyb3dzZXIgKElFIGVzcGVjaWFsbHkhKS5cbiAgICAqIElucHV0OiBVVEMgdGltZXN0YW1wIDo6IHN0cmluZy5cbiAgICAqIE91dHB1dDogdGltZXN0YW1wIDo6IGRhdGUuXG4gICAgKi9cbiAgZ2V0TG9jYWxEYXRlVGltZSA9ICh0aW1lc3RhbXApID0+IHtcbiAgICBjb25zdCBpc29UaW1lc3RhbXAgPSAodGltZXN0YW1wICE9PSBudWxsICYmIHRpbWVzdGFtcC5zbGljZSgtMSkgIT09ICdaJykgP1xuICAgICAgYCR7dGltZXN0YW1wfVpgIDogdGltZXN0YW1wO1xuICAgIGNvbnN0IGxvY2FsVGltZSA9IG5ldyBEYXRlKGlzb1RpbWVzdGFtcCkgLSBuZXcgRGF0ZSh0aW1lc3RhbXApLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgY29uc3QgdGltZVRvQ29udmVydCA9IGxvY2FsVGltZSA+PSAwID8gbG9jYWxUaW1lIDogMDtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZVRvQ29udmVydCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBhbW91bnQgYWNjb3JkaW5nIHRvIGl0cyBjdXJyZW5jeS5cbiAgICogSW5wdXQ6IGFtb3VudCA6OiBbbnVtYmVyLCBzdHJpbmddLCBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAgICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLCAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjAwJy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICAgKi9cbiAgZm9ybWF0Q3VycmVuY3lBbW91bnQgPSAodmFsdWUsIGN1cnJlbmN5KSA9PlxuICAgIE51bWJlcih2YWx1ZSkudG9GaXhlZCh0aGlzLmdldEN1cnJlbmN5RGVjaW1hbHMoY3VycmVuY3kpKTtcblxuICAvKipcbiAgICogRm9ybWF0IEZYIHJhdGUuXG4gICAqIElucHV0OiByYXRlLlxuICAgKiBPdXRwdXQ6IHJhdGUgOjogc3RyaW5nLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTEwMDAwJy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyMzQ1Njc4Jy5cbiAgICovXG4gIGZvcm1hdEZYUmF0ZSA9IHZhbHVlID0+IE51bWJlcih2YWx1ZSkudG9GaXhlZCh0aGlzLmdldEZYUmF0ZURlY2ltYWxzKHZhbHVlKSk7XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBhbiBpbnB1dCB0byBhIGZsb2F0IHdpdGggZml4ZWQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICAgKiBJbnB1dDogdmFsdWUgdG8gZm9ybWF0IDo6IFtudW1iZXIsIHN0cmluZ10sIGRlY2ltYWxzIDo6IG51bWJlci5cbiAgICogT3V0cHV0OiBmb3JtYXR0ZWQgdmFsdWUgOjogc3RyaW5nLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAnMjMgMDAwLjFhYmMnLCAnMicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjMwMDAuMTAnLlxuICAgKi9cbiAgZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMgPSAodmFsdWUsIGRlY2ltYWxzKSA9PiB7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4gICAgbGV0IGZsb2F0VmFsdWUgPSBTdHJpbmcodmFsdWUpLnJlcGxhY2UoL1teXFxkLiwtXS9nLCAnJykucmVwbGFjZSgnLCcsICcuJyk7XG4gICAgZmxvYXRWYWx1ZSA9IGlzTmFOKE51bWJlcihmbG9hdFZhbHVlKSkgPyAwIDogTnVtYmVyKGZsb2F0VmFsdWUpO1xuICAgIHJldHVybiBmbG9hdFZhbHVlLnRvRml4ZWQoZGVjaW1hbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBkYXRlIHRvIGEgY2hvc2VuIGZvcm1hdC5cbiAgICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcuXG4gICAqIE91dHB1dDogZGF0ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMDEuMDEuMjAxNycuXG4gICAqL1xuICBmb3JtYXREYXRlID0gKHZhbHVlLCBkYXRlRm9ybWF0KSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5mb3JtYXQoZGF0ZUZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogRm9ybWF0IGxvY2FsaXplZCBkYXRlIHN0cmluZyB0byBJU08gdGltZXN0YW1wLlxuICAgKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZyAob3B0aW9uYWwpLCBzaWduIG9mIHN0cmljdCBkYXRlIGZvcm1hdCA6OlxuICAgKiBib29sZWFuIChvcHRpb25hbCksIGRlZmF1bHQgdmFsdWUgOjogc3RyaW5nIChvcHRpb25hbCksIGRlZmF1bHQgZGF0ZSBmb3JtYXQgOjpcbiAgICogc3RyaW5nIChvcHRpb25hbCkuXG4gICAqIE91dHB1dDogSVNPIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcwMS4wMScsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLlxuICAgKi9cbiAgZm9ybWF0RGF0ZVRvSVNPID0gKHZhbHVlLCBkYXRlRm9ybWF0ID0gbnVsbCwgaXNTdHJpY3QgPSBmYWxzZSwgZGVmYXVsdFZhbHVlID0gJycsIGRlZmF1bHREYXRlRm9ybWF0ID0gbnVsbCkgPT4ge1xuICAgIGlmIChpc1N0cmljdCAmJiBtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoZGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChkZWZhdWx0RGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogUGFyc2UgZGF0ZSBzdHJpbmcgdG8gSVNPIHN0cmluZyBvciBhIG5ldyBmb3JtYXQuXG4gICAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nLCBuZXcgZGF0ZSBmb3JtYXQgOjogc3RyaW5nIChvcHRpb25hbCkuXG4gICAqIE91dHB1dDogZGF0ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcwMS4wMS4yMDE3JywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcwMS4wMS4yMDE3JywgJ0RELk1NLllZWVknLCAnWVlZWS1NTS1ERCcuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjAxNy0wMS0wMScuXG4gICAqL1xuICBwYXJzZURhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQsIG5ld0Zvcm1hdCA9IG51bGwpID0+IHtcbiAgICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gbmV3Rm9ybWF0ID09PSBudWxsID8gbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCkudG9JU09TdHJpbmcoKSA6XG4gICAgICAgIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQpLmZvcm1hdChuZXdGb3JtYXQpO1xuICAgIH0gZWxzZSBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBuZXdGb3JtYXQgPT09IG51bGwgPyBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEpLnRvSVNPU3RyaW5nKCkgOlxuICAgICAgICBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEpLmZvcm1hdChuZXdGb3JtYXQpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBmbG9hdC5cbiAgICogSW5wdXQ6IHZhbHVlIDo6IFtudW1iZXIsIHN0cmluZ10sIGRlY2ltYWwgc2VwYXJhdG9yIDo6IHN0cmluZy5cbiAgICogT3V0cHV0OiB2YWx1ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcxLDEnLCAnLCcuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xJy5cbiAgICovXG4gIHBhcnNlRmxvYXQgPSAodmFsdWUsIGRlY2ltYWxTZXBhcmF0b3IpID0+IHtcbiAgICBpZiAoIXZhbHVlIHx8IFN0cmluZyh2YWx1ZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpLnJlcGxhY2UoZGVjaW1hbFNlcGFyYXRvciwgJy4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBudW1iZXIuXG4gICAqIElucHV0OiB2YWx1ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICAgKiBPdXRwdXQ6IHZhbHVlIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzFhYicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gICAqL1xuICBwYXJzZU51bWJlciA9IHZhbHVlID0+IChTdHJpbmcodmFsdWUpLnJlcGxhY2UoL1teXFxkLV0vZywgJycpIHx8ICcnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEZvcm1hdFV0aWxzKCk7XG4iXX0=