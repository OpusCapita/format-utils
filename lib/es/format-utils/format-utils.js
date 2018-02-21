function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import moment from 'moment';

import { FXRATE_DECIMALS, SKIPPED_DATE_FORMAT } from './format-utils.constants';

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
    return decimalSeparator === -1 || decimalNumber <= FXRATE_DECIMALS ? FXRATE_DECIMALS : decimalNumber;
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
    if (moment.utc(value, SKIPPED_DATE_FORMAT, true).isValid()) {
      return value;
    }
    if (moment.utc(value, moment.ISO_8601, true).isValid()) {
      return moment.utc(value, moment.ISO_8601, true).format(dateFormat);
    }
    return value;
  };

  this.formatDateToISO = function (value) {
    var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var isStrict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var defaultValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var defaultDateFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    if (isStrict && moment.utc(value, SKIPPED_DATE_FORMAT, isStrict).isValid()) {
      return value;
    }
    if (moment.utc(value, moment.ISO_8601, isStrict).isValid()) {
      return moment.utc(value, moment.ISO_8601, isStrict).toISOString();
    }
    if (dateFormat !== null && moment.utc(value, dateFormat, isStrict).isValid()) {
      return moment.utc(value, dateFormat, isStrict).toISOString();
    }
    if (defaultDateFormat !== null && moment.utc(value, defaultDateFormat, isStrict).isValid()) {
      return moment.utc(value, defaultDateFormat, isStrict).toISOString();
    }
    return defaultValue;
  };

  this.parseDate = function (value, dateFormat) {
    var newFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (moment.utc(value, dateFormat).isValid()) {
      return newFormat === null ? moment.utc(value, dateFormat).toISOString() : moment.utc(value, dateFormat).format(newFormat);
    } else if (moment.utc(value, moment.ISO_8601).isValid()) {
      return newFormat === null ? moment.utc(value, moment.ISO_8601).toISOString() : moment.utc(value, moment.ISO_8601).format(newFormat);
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

export default new FormatUtils();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsIkZYUkFURV9ERUNJTUFMUyIsIlNLSVBQRURfREFURV9GT1JNQVQiLCJGb3JtYXRVdGlscyIsImdldEN1cnJlbmN5RGVjaW1hbHMiLCJjdXJyZW5jeSIsIm51bWJlck9wdGlvbnMiLCJzdHlsZSIsImN1cnJlbmN5RGlzcGxheSIsInVzZUdyb3VwaW5nIiwidGVzdCIsIkludGwiLCJOdW1iZXJGb3JtYXQiLCJmb3JtYXQiLCJyZXBsYWNlIiwiZm91bmRTZXBhcmF0b3IiLCJzZWFyY2giLCJsZW5ndGgiLCJnZXRGWFJhdGVEZWNpbWFscyIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwiZ2V0TG9jYWxEYXRlVGltZSIsInRpbWVzdGFtcCIsImlzb1RpbWVzdGFtcCIsInNsaWNlIiwibG9jYWxUaW1lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidGltZVRvQ29udmVydCIsImZvcm1hdEN1cnJlbmN5QW1vdW50IiwiTnVtYmVyIiwidG9GaXhlZCIsImZvcm1hdEZYUmF0ZSIsImZvcm1hdEZsb2F0VG9GaXhlZERlY2ltYWxzIiwiZGVjaW1hbHMiLCJmbG9hdFZhbHVlIiwiaXNOYU4iLCJmb3JtYXREYXRlIiwiZGF0ZUZvcm1hdCIsInV0YyIsImlzVmFsaWQiLCJJU09fODYwMSIsImZvcm1hdERhdGVUb0lTTyIsImlzU3RyaWN0IiwiZGVmYXVsdFZhbHVlIiwiZGVmYXVsdERhdGVGb3JtYXQiLCJ0b0lTT1N0cmluZyIsInBhcnNlRGF0ZSIsIm5ld0Zvcm1hdCIsInBhcnNlTnVtYmVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU9BLE1BQVAsTUFBbUIsUUFBbkI7O0FBRUEsU0FDRUMsZUFERixFQUVFQyxtQkFGRixRQUdPLDBCQUhQ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ZCxDQUFzQlMsZ0JBQXRCLEVBQXdDLEdBQXhDLENBQVA7QUFDRCxHOztPQVFEK0IsVyxHQUFjO0FBQUEsV0FBVWpDLE9BQU9GLEtBQVAsRUFBY0wsT0FBZCxDQUFzQixTQUF0QixFQUFpQyxFQUFqQyxLQUF3QyxFQUFsRDtBQUFBLEc7O0FBbEtkOzs7Ozs7Ozs7QUFzQkE7Ozs7Ozs7OztBQWVBOzs7Ozs7O0FBYUE7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7QUFhQTs7Ozs7Ozs7QUFtQkE7Ozs7Ozs7Ozs7QUF3QkE7Ozs7Ozs7OztBQWtCQTs7Ozs7Ozs7QUFhQTs7Ozs7Ozs7QUFTRixlQUFlLElBQUlYLFdBQUosRUFBZiIsImZpbGUiOiJmb3JtYXQtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7XG4gIEZYUkFURV9ERUNJTUFMUyxcbiAgU0tJUFBFRF9EQVRFX0ZPUk1BVCxcbn0gZnJvbSAnLi9mb3JtYXQtdXRpbHMuY29uc3RhbnRzJztcblxuY2xhc3MgRm9ybWF0VXRpbHMge1xuICAvKipcbiAgICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIGN1cnJlbmN5LlxuICAgKiBJbnB1dDogY3VycmVuY3kgY29kZSA6OiBzdHJpbmcuXG4gICAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDIuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogMC5cbiAgICovXG4gIGdldEN1cnJlbmN5RGVjaW1hbHMgPSAoY3VycmVuY3kpID0+IHtcbiAgICBjb25zdCBudW1iZXJPcHRpb25zID0ge1xuICAgICAgY3VycmVuY3ksXG4gICAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICAgIGN1cnJlbmN5RGlzcGxheTogJ2NvZGUnLFxuICAgICAgdXNlR3JvdXBpbmc6IGZhbHNlLFxuICAgIH07XG4gICAgY29uc3QgdGVzdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCgnZW4tR0InLCBudW1iZXJPcHRpb25zKS5mb3JtYXQoMS4xMTExMTEpLnJlcGxhY2UoL1teXFxkLixdL2csICcnKTtcbiAgICBjb25zdCBmb3VuZFNlcGFyYXRvciA9IHRlc3Quc2VhcmNoKC9bLixdL2cpO1xuICAgIGlmIChmb3VuZFNlcGFyYXRvciA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGVzdC5sZW5ndGggLSBmb3VuZFNlcGFyYXRvciAtIDE7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIEZYIHJhdGUuXG4gICAqIElucHV0OiByYXRlIDo6IFtudW1iZXIsIHN0cmluZ10uXG4gICAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogNi5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6IDguXG4gICAqL1xuICBnZXRGWFJhdGVEZWNpbWFscyA9ICh2YWx1ZSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlU3RyaW5nID0gU3RyaW5nKHBhcnNlRmxvYXQoU3RyaW5nKHZhbHVlKSkpO1xuICAgIGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgPSB2YWx1ZVN0cmluZy5pbmRleE9mKCcuJyk7XG4gICAgY29uc3QgZGVjaW1hbE51bWJlciA9IHZhbHVlU3RyaW5nLmxlbmd0aCAtIGRlY2ltYWxTZXBhcmF0b3IgLSAxO1xuICAgIHJldHVybiAoZGVjaW1hbFNlcGFyYXRvciA9PT0gLTEgfHwgZGVjaW1hbE51bWJlciA8PSBGWFJBVEVfREVDSU1BTFMpID9cbiAgICAgIEZYUkFURV9ERUNJTUFMUyA6IGRlY2ltYWxOdW1iZXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGxvY2FsIGRhdGUgYW5kIHRpbWUgZnJvbSBJU08gODYwMSB0aW1lc3RhbXAuIEl0J3MgY3Jvc3MtYnJvd3NlciAoSUUgZXNwZWNpYWxseSEpLlxuICAgICogSW5wdXQ6IFVUQyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICAgICogT3V0cHV0OiB0aW1lc3RhbXAgOjogZGF0ZS5cbiAgICAqL1xuICBnZXRMb2NhbERhdGVUaW1lID0gKHRpbWVzdGFtcCkgPT4ge1xuICAgIGNvbnN0IGlzb1RpbWVzdGFtcCA9ICh0aW1lc3RhbXAgIT09IG51bGwgJiYgdGltZXN0YW1wLnNsaWNlKC0xKSAhPT0gJ1onKSA/XG4gICAgICBgJHt0aW1lc3RhbXB9WmAgOiB0aW1lc3RhbXA7XG4gICAgY29uc3QgbG9jYWxUaW1lID0gbmV3IERhdGUoaXNvVGltZXN0YW1wKSAtIG5ldyBEYXRlKHRpbWVzdGFtcCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICBjb25zdCB0aW1lVG9Db252ZXJ0ID0gbG9jYWxUaW1lID49IDAgPyBsb2NhbFRpbWUgOiAwO1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lVG9Db252ZXJ0KTtcbiAgfTtcblxuICAvKipcbiAgICogRm9ybWF0IGFtb3VudCBhY2NvcmRpbmcgdG8gaXRzIGN1cnJlbmN5LlxuICAgKiBJbnB1dDogYW1vdW50IDo6IFtudW1iZXIsIHN0cmluZ10sIGN1cnJlbmN5IGNvZGUgOjogc3RyaW5nLlxuICAgKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEsICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMDAnLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMywgJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gICAqL1xuICBmb3JtYXRDdXJyZW5jeUFtb3VudCA9ICh2YWx1ZSwgY3VycmVuY3kpID0+XG4gICAgTnVtYmVyKHZhbHVlKS50b0ZpeGVkKHRoaXMuZ2V0Q3VycmVuY3lEZWNpbWFscyhjdXJyZW5jeSkpO1xuXG4gIC8qKlxuICAgKiBGb3JtYXQgRlggcmF0ZS5cbiAgICogSW5wdXQ6IHJhdGUuXG4gICAqIE91dHB1dDogcmF0ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMTAwMDAnLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTIzNDU2NzgnLlxuICAgKi9cbiAgZm9ybWF0RlhSYXRlID0gdmFsdWUgPT4gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKHRoaXMuZ2V0RlhSYXRlRGVjaW1hbHModmFsdWUpKTtcblxuICAvKipcbiAgICogRm9ybWF0IGFuIGlucHV0IHRvIGEgZmxvYXQgd2l0aCBmaXhlZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gICAqIElucHV0OiB2YWx1ZSB0byBmb3JtYXQgOjogW251bWJlciwgc3RyaW5nXSwgZGVjaW1hbHMgOjogbnVtYmVyLlxuICAgKiBPdXRwdXQ6IGZvcm1hdHRlZCB2YWx1ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMyAwMDAuMWFiYycsICcyJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMzAwMC4xMCcuXG4gICAqL1xuICBmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyA9ICh2YWx1ZSwgZGVjaW1hbHMpID0+IHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1yZXN0cmljdGVkLWdsb2JhbHMgKi9cbiAgICBsZXQgZmxvYXRWYWx1ZSA9IFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvW15cXGQuLC1dL2csICcnKS5yZXBsYWNlKCcsJywgJy4nKTtcbiAgICBmbG9hdFZhbHVlID0gaXNOYU4oTnVtYmVyKGZsb2F0VmFsdWUpKSA/IDAgOiBOdW1iZXIoZmxvYXRWYWx1ZSk7XG4gICAgcmV0dXJuIGZsb2F0VmFsdWUudG9GaXhlZChkZWNpbWFscyk7XG4gIH1cblxuICAvKipcbiAgICogRm9ybWF0IGRhdGUgdG8gYSBjaG9zZW4gZm9ybWF0LlxuICAgKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZy5cbiAgICogT3V0cHV0OiBkYXRlIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcwMS4wMS4yMDE3Jy5cbiAgICovXG4gIGZvcm1hdERhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmZvcm1hdChkYXRlRm9ybWF0KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGb3JtYXQgbG9jYWxpemVkIGRhdGUgc3RyaW5nIHRvIElTTyB0aW1lc3RhbXAuXG4gICAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nIChvcHRpb25hbCksIHNpZ24gb2Ygc3RyaWN0IGRhdGUgZm9ybWF0IDo6XG4gICAqIGJvb2xlYW4gKG9wdGlvbmFsKSwgZGVmYXVsdCB2YWx1ZSA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgZGVmYXVsdCBkYXRlIGZvcm1hdCA6OlxuICAgKiBzdHJpbmcgKG9wdGlvbmFsKS5cbiAgICogT3V0cHV0OiBJU08gdGltZXN0YW1wIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gICAqL1xuICBmb3JtYXREYXRlVG9JU08gPSAodmFsdWUsIGRhdGVGb3JtYXQgPSBudWxsLCBpc1N0cmljdCA9IGZhbHNlLCBkZWZhdWx0VmFsdWUgPSAnJywgZGVmYXVsdERhdGVGb3JtYXQgPSBudWxsKSA9PiB7XG4gICAgaWYgKGlzU3RyaWN0ICYmIG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChkYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKGRlZmF1bHREYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQYXJzZSBkYXRlIHN0cmluZyB0byBJU08gc3RyaW5nIG9yIGEgbmV3IGZvcm1hdC5cbiAgICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcsIG5ldyBkYXRlIGZvcm1hdCA6OiBzdHJpbmcgKG9wdGlvbmFsKS5cbiAgICogT3V0cHV0OiBkYXRlIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxLjIwMTcnLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxLjIwMTcnLCAnREQuTU0uWVlZWScsICdZWVlZLU1NLUREJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMDE3LTAxLTAxJy5cbiAgICovXG4gIHBhcnNlRGF0ZSA9ICh2YWx1ZSwgZGF0ZUZvcm1hdCwgbmV3Rm9ybWF0ID0gbnVsbCkgPT4ge1xuICAgIGlmIChtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBuZXdGb3JtYXQgPT09IG51bGwgPyBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0KS50b0lTT1N0cmluZygpIDpcbiAgICAgICAgbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCkuZm9ybWF0KG5ld0Zvcm1hdCk7XG4gICAgfSBlbHNlIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG5ld0Zvcm1hdCA9PT0gbnVsbCA/IG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSkudG9JU09TdHJpbmcoKSA6XG4gICAgICAgIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSkuZm9ybWF0KG5ld0Zvcm1hdCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIGZsb2F0LlxuICAgKiBJbnB1dDogdmFsdWUgOjogW251bWJlciwgc3RyaW5nXSwgZGVjaW1hbCBzZXBhcmF0b3IgOjogc3RyaW5nLlxuICAgKiBPdXRwdXQ6IHZhbHVlIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzEsMScsICcsJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEnLlxuICAgKi9cbiAgcGFyc2VGbG9hdCA9ICh2YWx1ZSwgZGVjaW1hbFNlcGFyYXRvcikgPT4ge1xuICAgIGlmICghdmFsdWUgfHwgU3RyaW5nKHZhbHVlKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSkucmVwbGFjZShkZWNpbWFsU2VwYXJhdG9yLCAnLicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIG51bWJlci5cbiAgICogSW5wdXQ6IHZhbHVlIDo6IFtudW1iZXIsIHN0cmluZ10uXG4gICAqIE91dHB1dDogdmFsdWUgOjogc3RyaW5nLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAnMWFiJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAgICovXG4gIHBhcnNlTnVtYmVyID0gdmFsdWUgPT4gKFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvW15cXGQtXS9nLCAnJykgfHwgJycpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRm9ybWF0VXRpbHMoKTtcbiJdfQ==