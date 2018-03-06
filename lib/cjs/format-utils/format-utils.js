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
      currency: currency || _formatUtils.DEFAULT_CURRENCY,
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

  this.formatFloatToFixedDecimals = function (value, decimals) {
    /* eslint-disable no-restricted-globals */
    var floatValue = String(value).replace(/[^\d.,-]/g, '').replace(',', '.');
    floatValue = isNaN(Number(floatValue)) ? 0 : Number(floatValue);
    return floatValue.toFixed(decimals);
  };

  this.formatFXRate = function (value) {
    return Number(value).toFixed(_this.getFXRateDecimals(value));
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
 * Format an input to a float with fixed number of decimals.
 * Input: value to format :: [number, string], decimals :: number.
 * Output: formatted value :: string.
 * Example of input: '23 000.1abc', '2'. Example of output: '23000.10'.
 */


/**
 * Format FX rate.
 * Input: rate.
 * Output: rate :: string.
 * Example of input: 1.11. Example of output: '1.110000'.
 * Example of input: 1.12345678. Example of output: '1.12345678'.
 */
;

exports.default = new FormatUtils();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIkZvcm1hdFV0aWxzIiwiZ2V0Q3VycmVuY3lEZWNpbWFscyIsImN1cnJlbmN5IiwibnVtYmVyT3B0aW9ucyIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsImdldEZYUmF0ZURlY2ltYWxzIiwidmFsdWUiLCJ2YWx1ZVN0cmluZyIsIlN0cmluZyIsInBhcnNlRmxvYXQiLCJkZWNpbWFsU2VwYXJhdG9yIiwiaW5kZXhPZiIsImRlY2ltYWxOdW1iZXIiLCJnZXRMb2NhbERhdGVUaW1lIiwidGltZXN0YW1wIiwiaXNvVGltZXN0YW1wIiwic2xpY2UiLCJsb2NhbFRpbWUiLCJEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ0aW1lVG9Db252ZXJ0IiwiZm9ybWF0Q3VycmVuY3lBbW91bnQiLCJOdW1iZXIiLCJ0b0ZpeGVkIiwiZm9ybWF0RGF0ZSIsImRhdGVGb3JtYXQiLCJ1dGMiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJmb3JtYXREYXRlVG9JU08iLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyIsImRlY2ltYWxzIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwiZm9ybWF0RlhSYXRlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFFQTs7Ozs7O0lBTU1BLFc7Ozs7O09BUUpDLG1CLEdBQXNCLFVBQUNDLFFBQUQsRUFBYztBQUNsQyxRQUFNQyxnQkFBZ0I7QUFDcEJELGdCQUFVQSx5Q0FEVTtBQUVwQkUsYUFBTyxVQUZhO0FBR3BCQyx1QkFBaUIsTUFIRztBQUlwQkMsbUJBQWE7QUFK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Ozs7Ozs7QUF3QkE7Ozs7Ozs7O0FBYUE7Ozs7Ozs7OztrQkFVYSxJQUFJaEIsV0FBSixFIiwiZmlsZSI6ImZvcm1hdC11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IHtcbiAgREVGQVVMVF9DVVJSRU5DWSxcbiAgRlhSQVRFX0RFQ0lNQUxTLFxuICBTS0lQUEVEX0RBVEVfRk9STUFULFxufSBmcm9tICcuL2Zvcm1hdC11dGlscy5jb25zdGFudHMnO1xuXG5jbGFzcyBGb3JtYXRVdGlscyB7XG4gIC8qKlxuICAgKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgY3VycmVuY3kuXG4gICAqIElucHV0OiBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAgICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogMi5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAwLlxuICAgKi9cbiAgZ2V0Q3VycmVuY3lEZWNpbWFscyA9IChjdXJyZW5jeSkgPT4ge1xuICAgIGNvbnN0IG51bWJlck9wdGlvbnMgPSB7XG4gICAgICBjdXJyZW5jeTogY3VycmVuY3kgfHwgREVGQVVMVF9DVVJSRU5DWSxcbiAgICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgICAgY3VycmVuY3lEaXNwbGF5OiAnY29kZScsXG4gICAgICB1c2VHcm91cGluZzogZmFsc2UsXG4gICAgfTtcbiAgICBjb25zdCB0ZXN0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1HQicsIG51bWJlck9wdGlvbnMpLmZvcm1hdCgxLjExMTExMSkucmVwbGFjZSgvW15cXGQuLF0vZywgJycpO1xuICAgIGNvbnN0IGZvdW5kU2VwYXJhdG9yID0gdGVzdC5zZWFyY2goL1suLF0vZyk7XG4gICAgaWYgKGZvdW5kU2VwYXJhdG9yID09PSAtMSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB0ZXN0Lmxlbmd0aCAtIGZvdW5kU2VwYXJhdG9yIC0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgRlggcmF0ZS5cbiAgICogSW5wdXQ6IHJhdGUgOjogW251bWJlciwgc3RyaW5nXS5cbiAgICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiA2LlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogOC5cbiAgICovXG4gIGdldEZYUmF0ZURlY2ltYWxzID0gKHZhbHVlKSA9PiB7XG4gICAgY29uc3QgdmFsdWVTdHJpbmcgPSBTdHJpbmcocGFyc2VGbG9hdChTdHJpbmcodmFsdWUpKSk7XG4gICAgY29uc3QgZGVjaW1hbFNlcGFyYXRvciA9IHZhbHVlU3RyaW5nLmluZGV4T2YoJy4nKTtcbiAgICBjb25zdCBkZWNpbWFsTnVtYmVyID0gdmFsdWVTdHJpbmcubGVuZ3RoIC0gZGVjaW1hbFNlcGFyYXRvciAtIDE7XG4gICAgcmV0dXJuIChkZWNpbWFsU2VwYXJhdG9yID09PSAtMSB8fCBkZWNpbWFsTnVtYmVyIDw9IEZYUkFURV9ERUNJTUFMUykgP1xuICAgICAgRlhSQVRFX0RFQ0lNQUxTIDogZGVjaW1hbE51bWJlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbG9jYWwgZGF0ZSBhbmQgdGltZSBmcm9tIElTTyA4NjAxIHRpbWVzdGFtcC4gSXQncyBjcm9zcy1icm93c2VyIChJRSBlc3BlY2lhbGx5ISkuXG4gICAgKiBJbnB1dDogVVRDIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gICAgKiBPdXRwdXQ6IHRpbWVzdGFtcCA6OiBkYXRlLlxuICAgICovXG4gIGdldExvY2FsRGF0ZVRpbWUgPSAodGltZXN0YW1wKSA9PiB7XG4gICAgY29uc3QgaXNvVGltZXN0YW1wID0gKHRpbWVzdGFtcCAhPT0gbnVsbCAmJiB0aW1lc3RhbXAuc2xpY2UoLTEpICE9PSAnWicpID9cbiAgICAgIGAke3RpbWVzdGFtcH1aYCA6IHRpbWVzdGFtcDtcbiAgICBjb25zdCBsb2NhbFRpbWUgPSBuZXcgRGF0ZShpc29UaW1lc3RhbXApIC0gbmV3IERhdGUodGltZXN0YW1wKS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIGNvbnN0IHRpbWVUb0NvbnZlcnQgPSBsb2NhbFRpbWUgPj0gMCA/IGxvY2FsVGltZSA6IDA7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRpbWVUb0NvbnZlcnQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGb3JtYXQgYW1vdW50IGFjY29yZGluZyB0byBpdHMgY3VycmVuY3kuXG4gICAqIElucHV0OiBhbW91bnQgOjogW251bWJlciwgc3RyaW5nXSwgY3VycmVuY3kgY29kZSA6OiBzdHJpbmcuXG4gICAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMSwgJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4wMCcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAgICovXG4gIGZvcm1hdEN1cnJlbmN5QW1vdW50ID0gKHZhbHVlLCBjdXJyZW5jeSkgPT5cbiAgICBOdW1iZXIodmFsdWUpLnRvRml4ZWQodGhpcy5nZXRDdXJyZW5jeURlY2ltYWxzKGN1cnJlbmN5KSk7XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBkYXRlIHRvIGEgY2hvc2VuIGZvcm1hdC5cbiAgICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcuXG4gICAqIE91dHB1dDogZGF0ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMDEuMDEuMjAxNycuXG4gICAqL1xuICBmb3JtYXREYXRlID0gKHZhbHVlLCBkYXRlRm9ybWF0KSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5mb3JtYXQoZGF0ZUZvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogRm9ybWF0IGxvY2FsaXplZCBkYXRlIHN0cmluZyB0byBJU08gdGltZXN0YW1wLlxuICAgKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZyAob3B0aW9uYWwpLCBzaWduIG9mIHN0cmljdCBkYXRlIGZvcm1hdCA6OlxuICAgKiBib29sZWFuIChvcHRpb25hbCksIGRlZmF1bHQgdmFsdWUgOjogc3RyaW5nIChvcHRpb25hbCksIGRlZmF1bHQgZGF0ZSBmb3JtYXQgOjpcbiAgICogc3RyaW5nIChvcHRpb25hbCkuXG4gICAqIE91dHB1dDogSVNPIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcwMS4wMScsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMDE3LTAxLTAxVDAwOjAwOjAwLjAwMFonLlxuICAgKi9cbiAgZm9ybWF0RGF0ZVRvSVNPID0gKHZhbHVlLCBkYXRlRm9ybWF0ID0gbnVsbCwgaXNTdHJpY3QgPSBmYWxzZSwgZGVmYXVsdFZhbHVlID0gJycsIGRlZmF1bHREYXRlRm9ybWF0ID0gbnVsbCkgPT4ge1xuICAgIGlmIChpc1N0cmljdCAmJiBtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoZGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChkZWZhdWx0RGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfTtcblxuICAvKipcbiAgICogRm9ybWF0IGFuIGlucHV0IHRvIGEgZmxvYXQgd2l0aCBmaXhlZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gICAqIElucHV0OiB2YWx1ZSB0byBmb3JtYXQgOjogW251bWJlciwgc3RyaW5nXSwgZGVjaW1hbHMgOjogbnVtYmVyLlxuICAgKiBPdXRwdXQ6IGZvcm1hdHRlZCB2YWx1ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMyAwMDAuMWFiYycsICcyJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMzAwMC4xMCcuXG4gICAqL1xuICBmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyA9ICh2YWx1ZSwgZGVjaW1hbHMpID0+IHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cbiAgICBsZXQgZmxvYXRWYWx1ZSA9IFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvW15cXGQuLC1dL2csICcnKS5yZXBsYWNlKCcsJywgJy4nKTtcbiAgICBmbG9hdFZhbHVlID0gaXNOYU4oTnVtYmVyKGZsb2F0VmFsdWUpKSA/IDAgOiBOdW1iZXIoZmxvYXRWYWx1ZSk7XG4gICAgcmV0dXJuIGZsb2F0VmFsdWUudG9GaXhlZChkZWNpbWFscyk7XG4gIH1cblxuICAvKipcbiAgICogRm9ybWF0IEZYIHJhdGUuXG4gICAqIElucHV0OiByYXRlLlxuICAgKiBPdXRwdXQ6IHJhdGUgOjogc3RyaW5nLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTEwMDAwJy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyMzQ1Njc4Jy5cbiAgICovXG4gIGZvcm1hdEZYUmF0ZSA9IHZhbHVlID0+IE51bWJlcih2YWx1ZSkudG9GaXhlZCh0aGlzLmdldEZYUmF0ZURlY2ltYWxzKHZhbHVlKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBGb3JtYXRVdGlscygpO1xuIl19