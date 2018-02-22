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

export default new FormatUtils();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsIkZYUkFURV9ERUNJTUFMUyIsIlNLSVBQRURfREFURV9GT1JNQVQiLCJGb3JtYXRVdGlscyIsImdldEN1cnJlbmN5RGVjaW1hbHMiLCJjdXJyZW5jeSIsIm51bWJlck9wdGlvbnMiLCJzdHlsZSIsImN1cnJlbmN5RGlzcGxheSIsInVzZUdyb3VwaW5nIiwidGVzdCIsIkludGwiLCJOdW1iZXJGb3JtYXQiLCJmb3JtYXQiLCJyZXBsYWNlIiwiZm91bmRTZXBhcmF0b3IiLCJzZWFyY2giLCJsZW5ndGgiLCJnZXRGWFJhdGVEZWNpbWFscyIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwiZ2V0TG9jYWxEYXRlVGltZSIsInRpbWVzdGFtcCIsImlzb1RpbWVzdGFtcCIsInNsaWNlIiwibG9jYWxUaW1lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidGltZVRvQ29udmVydCIsImZvcm1hdEN1cnJlbmN5QW1vdW50IiwiTnVtYmVyIiwidG9GaXhlZCIsImZvcm1hdERhdGUiLCJkYXRlRm9ybWF0IiwidXRjIiwiaXNWYWxpZCIsIklTT184NjAxIiwiZm9ybWF0RGF0ZVRvSVNPIiwiaXNTdHJpY3QiLCJkZWZhdWx0VmFsdWUiLCJkZWZhdWx0RGF0ZUZvcm1hdCIsInRvSVNPU3RyaW5nIiwiZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMiLCJkZWNpbWFscyIsImZsb2F0VmFsdWUiLCJpc05hTiIsImZvcm1hdEZYUmF0ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPQSxNQUFQLE1BQW1CLFFBQW5COztBQUVBLFNBQ0VDLGVBREYsRUFFRUMsbUJBRkYsUUFHTywwQkFIUDs7SUFLTUMsVzs7Ozs7T0FRSkMsbUIsR0FBc0IsVUFBQ0MsUUFB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QUFBQSxXQUFTaEIsT0FBT2hCLEtBQVAsRUFBY2lCLE9BQWQsQ0FBc0IsTUFBS2xCLGlCQUFMLENBQXVCQyxLQUF2QixDQUF0QixDQUFUO0FBQUEsRzs7QUEzSGY7Ozs7Ozs7OztBQXNCQTs7Ozs7Ozs7O0FBZUE7Ozs7Ozs7QUFhQTs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7O0FBbUJBOzs7Ozs7Ozs7O0FBd0JBOzs7Ozs7OztBQWFBOzs7Ozs7Ozs7QUFVRixlQUFlLElBQUloQixXQUFKLEVBQWYiLCJmaWxlIjoiZm9ybWF0LXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQge1xuICBGWFJBVEVfREVDSU1BTFMsXG4gIFNLSVBQRURfREFURV9GT1JNQVQsXG59IGZyb20gJy4vZm9ybWF0LXV0aWxzLmNvbnN0YW50cyc7XG5cbmNsYXNzIEZvcm1hdFV0aWxzIHtcbiAgLyoqXG4gICAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBjdXJyZW5jeS5cbiAgICogSW5wdXQ6IGN1cnJlbmN5IGNvZGUgOjogc3RyaW5nLlxuICAgKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAyLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDAuXG4gICAqL1xuICBnZXRDdXJyZW5jeURlY2ltYWxzID0gKGN1cnJlbmN5KSA9PiB7XG4gICAgY29uc3QgbnVtYmVyT3B0aW9ucyA9IHtcbiAgICAgIGN1cnJlbmN5LFxuICAgICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgICBjdXJyZW5jeURpc3BsYXk6ICdjb2RlJyxcbiAgICAgIHVzZUdyb3VwaW5nOiBmYWxzZSxcbiAgICB9O1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUdCJywgbnVtYmVyT3B0aW9ucykuZm9ybWF0KDEuMTExMTExKS5yZXBsYWNlKC9bXlxcZC4sXS9nLCAnJyk7XG4gICAgY29uc3QgZm91bmRTZXBhcmF0b3IgPSB0ZXN0LnNlYXJjaCgvWy4sXS9nKTtcbiAgICBpZiAoZm91bmRTZXBhcmF0b3IgPT09IC0xKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRlc3QubGVuZ3RoIC0gZm91bmRTZXBhcmF0b3IgLSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBGWCByYXRlLlxuICAgKiBJbnB1dDogcmF0ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICAgKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6IDYuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiA4LlxuICAgKi9cbiAgZ2V0RlhSYXRlRGVjaW1hbHMgPSAodmFsdWUpID0+IHtcbiAgICBjb25zdCB2YWx1ZVN0cmluZyA9IFN0cmluZyhwYXJzZUZsb2F0KFN0cmluZyh2YWx1ZSkpKTtcbiAgICBjb25zdCBkZWNpbWFsU2VwYXJhdG9yID0gdmFsdWVTdHJpbmcuaW5kZXhPZignLicpO1xuICAgIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkZWNpbWFsU2VwYXJhdG9yIC0gMTtcbiAgICByZXR1cm4gKGRlY2ltYWxTZXBhcmF0b3IgPT09IC0xIHx8IGRlY2ltYWxOdW1iZXIgPD0gRlhSQVRFX0RFQ0lNQUxTKSA/XG4gICAgICBGWFJBVEVfREVDSU1BTFMgOiBkZWNpbWFsTnVtYmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2NhbCBkYXRlIGFuZCB0aW1lIGZyb20gSVNPIDg2MDEgdGltZXN0YW1wLiBJdCdzIGNyb3NzLWJyb3dzZXIgKElFIGVzcGVjaWFsbHkhKS5cbiAgICAqIElucHV0OiBVVEMgdGltZXN0YW1wIDo6IHN0cmluZy5cbiAgICAqIE91dHB1dDogdGltZXN0YW1wIDo6IGRhdGUuXG4gICAgKi9cbiAgZ2V0TG9jYWxEYXRlVGltZSA9ICh0aW1lc3RhbXApID0+IHtcbiAgICBjb25zdCBpc29UaW1lc3RhbXAgPSAodGltZXN0YW1wICE9PSBudWxsICYmIHRpbWVzdGFtcC5zbGljZSgtMSkgIT09ICdaJykgP1xuICAgICAgYCR7dGltZXN0YW1wfVpgIDogdGltZXN0YW1wO1xuICAgIGNvbnN0IGxvY2FsVGltZSA9IG5ldyBEYXRlKGlzb1RpbWVzdGFtcCkgLSBuZXcgRGF0ZSh0aW1lc3RhbXApLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgY29uc3QgdGltZVRvQ29udmVydCA9IGxvY2FsVGltZSA+PSAwID8gbG9jYWxUaW1lIDogMDtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZVRvQ29udmVydCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBhbW91bnQgYWNjb3JkaW5nIHRvIGl0cyBjdXJyZW5jeS5cbiAgICogSW5wdXQ6IGFtb3VudCA6OiBbbnVtYmVyLCBzdHJpbmddLCBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAgICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLCAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjAwJy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICAgKi9cbiAgZm9ybWF0Q3VycmVuY3lBbW91bnQgPSAodmFsdWUsIGN1cnJlbmN5KSA9PlxuICAgIE51bWJlcih2YWx1ZSkudG9GaXhlZCh0aGlzLmdldEN1cnJlbmN5RGVjaW1hbHMoY3VycmVuY3kpKTtcblxuICAvKipcbiAgICogRm9ybWF0IGRhdGUgdG8gYSBjaG9zZW4gZm9ybWF0LlxuICAgKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZy5cbiAgICogT3V0cHV0OiBkYXRlIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcwMS4wMS4yMDE3Jy5cbiAgICovXG4gIGZvcm1hdERhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmZvcm1hdChkYXRlRm9ybWF0KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGb3JtYXQgbG9jYWxpemVkIGRhdGUgc3RyaW5nIHRvIElTTyB0aW1lc3RhbXAuXG4gICAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nIChvcHRpb25hbCksIHNpZ24gb2Ygc3RyaWN0IGRhdGUgZm9ybWF0IDo6XG4gICAqIGJvb2xlYW4gKG9wdGlvbmFsKSwgZGVmYXVsdCB2YWx1ZSA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgZGVmYXVsdCBkYXRlIGZvcm1hdCA6OlxuICAgKiBzdHJpbmcgKG9wdGlvbmFsKS5cbiAgICogT3V0cHV0OiBJU08gdGltZXN0YW1wIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gICAqL1xuICBmb3JtYXREYXRlVG9JU08gPSAodmFsdWUsIGRhdGVGb3JtYXQgPSBudWxsLCBpc1N0cmljdCA9IGZhbHNlLCBkZWZhdWx0VmFsdWUgPSAnJywgZGVmYXVsdERhdGVGb3JtYXQgPSBudWxsKSA9PiB7XG4gICAgaWYgKGlzU3RyaWN0ICYmIG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChkYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKGRlZmF1bHREYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGb3JtYXQgYW4gaW5wdXQgdG8gYSBmbG9hdCB3aXRoIGZpeGVkIG51bWJlciBvZiBkZWNpbWFscy5cbiAgICogSW5wdXQ6IHZhbHVlIHRvIGZvcm1hdCA6OiBbbnVtYmVyLCBzdHJpbmddLCBkZWNpbWFscyA6OiBudW1iZXIuXG4gICAqIE91dHB1dDogZm9ybWF0dGVkIHZhbHVlIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzIzIDAwMC4xYWJjJywgJzInLiBFeGFtcGxlIG9mIG91dHB1dDogJzIzMDAwLjEwJy5cbiAgICovXG4gIGZvcm1hdEZsb2F0VG9GaXhlZERlY2ltYWxzID0gKHZhbHVlLCBkZWNpbWFscykgPT4ge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xuICAgIGxldCBmbG9hdFZhbHVlID0gU3RyaW5nKHZhbHVlKS5yZXBsYWNlKC9bXlxcZC4sLV0vZywgJycpLnJlcGxhY2UoJywnLCAnLicpO1xuICAgIGZsb2F0VmFsdWUgPSBpc05hTihOdW1iZXIoZmxvYXRWYWx1ZSkpID8gMCA6IE51bWJlcihmbG9hdFZhbHVlKTtcbiAgICByZXR1cm4gZmxvYXRWYWx1ZS50b0ZpeGVkKGRlY2ltYWxzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgRlggcmF0ZS5cbiAgICogSW5wdXQ6IHJhdGUuXG4gICAqIE91dHB1dDogcmF0ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMTAwMDAnLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTIzNDU2NzgnLlxuICAgKi9cbiAgZm9ybWF0RlhSYXRlID0gdmFsdWUgPT4gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKHRoaXMuZ2V0RlhSYXRlRGVjaW1hbHModmFsdWUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEZvcm1hdFV0aWxzKCk7XG4iXX0=