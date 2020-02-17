function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import moment from 'moment';
import { DEFAULT_CURRENCY, FXRATE_DECIMALS, SKIPPED_DATE_FORMAT } from './format-utils.constants'; // Hard coded currencies that has two decimal places
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

export var getCurrencyDecimals = function getCurrencyDecimals(currency) {
  var numberOptions = {
    currency: currency || DEFAULT_CURRENCY,
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

export var getFXRateDecimals = function getFXRateDecimals(value) {
  var valueString = String(parseFloat(String(value)));
  var decimalSeparator = valueString.indexOf('.');
  var decimalNumber = valueString.length - decimalSeparator - 1;
  return decimalSeparator === -1 || decimalNumber <= FXRATE_DECIMALS ? FXRATE_DECIMALS : decimalNumber;
};
/**
 * Get local date and time from ISO 8601 timestamp. It's cross-browser (IE especially!).
 * Input: UTC timestamp :: string.
 * Output: timestamp :: date.
 */

export var getLocalDateTime = function getLocalDateTime(timestamp) {
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

export var formatNumber = function formatNumber(value, options) {
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

export var formatCurrencyAmount = function formatCurrencyAmount(amount, options) {
  if (options === void 0) {
    options = {};
  }

  var amountStr = String(amount).replace(/\s/g, ''); // Strips all thousand separator

  if (options.thousandSeparator) {
    amountStr = amountStr.replace(new RegExp("\\" + options.thousandSeparator, 'g'), '');
  } // before number convertion decimal separator is replaced with proper one


  if (options.decimalSeparator !== '.') {
    amountStr = amountStr.replace(new RegExp("\\" + options.decimalSeparator, 'g'), '.');
  }

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

export var formatDate = function formatDate(value, dateFormat) {
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
/**
 * Format localized date string to ISO timestamp.
 * Input: date :: string, date format :: string (optional), sign of strict date format ::
 * boolean (optional), default value :: string (optional), default date format ::
 * string (optional).
 * Output: ISO timestamp :: string.
 * Example of input: '01.01', 'DD.MM.YYYY'. Example of output: '2017-01-01T00:00:00.000Z'.
 */

export var formatDateToISO = function formatDateToISO(value, dateFormat, isStrict, defaultValue, defaultDateFormat) {
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
/**
 * Format an input to a float with fixed number of decimals.
 * Input: value to format :: [number, string], decimals :: number.
 * Output: formatted value :: string.
 * Example of input: '23 000.1abc', '2'. Example of output: '23000.10'.
 */

export var formatFloatToFixedDecimals = function formatFloatToFixedDecimals(value, decimals) {
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

export var formatFXRate = function formatFXRate(value) {
  return Number(value).toFixed(getFXRateDecimals(value));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsIkRFRkFVTFRfQ1VSUkVOQ1kiLCJGWFJBVEVfREVDSU1BTFMiLCJTS0lQUEVEX0RBVEVfRk9STUFUIiwiREVDX0NPVU5UXzIiLCJERUNfQ09VTlRfMyIsImdldEN1cnJlbmN5RGVjaW1hbHMiLCJjdXJyZW5jeSIsIm51bWJlck9wdGlvbnMiLCJzdHlsZSIsImN1cnJlbmN5RGlzcGxheSIsInVzZUdyb3VwaW5nIiwiaW5jbHVkZXMiLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsImUiLCJnZXRGWFJhdGVEZWNpbWFscyIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwiZ2V0TG9jYWxEYXRlVGltZSIsInRpbWVzdGFtcCIsImlzb1RpbWVzdGFtcCIsInNsaWNlIiwibG9jYWxUaW1lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidGltZVRvQ29udmVydCIsImZvcm1hdE51bWJlciIsIm9wdGlvbnMiLCJkZWNpbWFscyIsImlzVHMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImlzRHMiLCJmaXhlZE51bWJlciIsIk51bWJlciIsInRvRml4ZWQiLCJzcGxpdCIsImpvaW4iLCJmb3JtYXRDdXJyZW5jeUFtb3VudCIsImFtb3VudCIsImFtb3VudFN0ciIsIlJlZ0V4cCIsIm11bHRpcGxpZXIiLCJhbW91bnRGbG9hdCIsInVuZGVmaW5lZCIsImlzTmFOIiwiZm9ybWF0RGF0ZSIsImRhdGVGb3JtYXQiLCJ1dGMiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJmb3JtYXREYXRlVG9JU08iLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyIsImZsb2F0VmFsdWUiLCJmb3JtYXRGWFJhdGUiXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBT0EsTUFBUCxNQUFtQixRQUFuQjtBQUVBLFNBQVNDLGdCQUFULEVBQTJCQyxlQUEzQixFQUE0Q0MsbUJBQTVDLFFBQXVFLDBCQUF2RSxDLENBRUE7QUFDQTs7QUFDQSxJQUFNQyxXQUFXLEdBQUcsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsS0FBN0IsRUFBb0MsS0FBcEMsRUFBMkMsS0FBM0MsRUFBa0QsS0FBbEQsRUFBeUQsS0FBekQsRUFBZ0UsS0FBaEUsRUFBdUUsS0FBdkUsRUFBOEUsS0FBOUUsQ0FBcEIsQyxDQUEwRzs7QUFDMUcsSUFBTUMsV0FBVyxHQUFHLENBQUMsS0FBRCxDQUFwQjtBQUVBOzs7Ozs7Ozs7QUFRQSxPQUFPLElBQU1DLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsUUFBRCxFQUFjO0FBQy9DLE1BQU1DLGFBQWEsR0FBRztBQUNwQkQsSUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUlOLGdCQURGO0FBRXBCUSxJQUFBQSxLQUFLLEVBQUUsVUFGYTtBQUdwQkMsSUFBQUEsZUFBZSxFQUFFLE1BSEc7QUFJcEJDLElBQUFBLFdBQVcsRUFBRTtBQUpPLEdBQXRCLENBRCtDLENBTy9DOztBQUNBLE1BQUlQLFdBQVcsQ0FBQ1EsUUFBWixDQUFxQkwsUUFBckIsQ0FBSixFQUFvQztBQUNsQyxXQUFPLENBQVA7QUFDRDs7QUFDRCxNQUFJRixXQUFXLENBQUNPLFFBQVosQ0FBcUJMLFFBQXJCLENBQUosRUFBb0M7QUFDbEMsV0FBTyxDQUFQO0FBQ0Q7O0FBQ0QsTUFBSTtBQUNGLFFBQU1NLElBQUksR0FBRyxJQUFJQyxJQUFJLENBQUNDLFlBQVQsQ0FBc0IsT0FBdEIsRUFBK0JQLGFBQS9CLEVBQ1ZRLE1BRFUsQ0FDSCxRQURHLEVBRVZDLE9B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UCxDQUFXcEMsS0FBWCxFQUFrQjBDLGlCQUFsQixFQUFxQ0YsUUFBckMsRUFBK0NHLFdBQS9DLEVBQVA7QUFDRDs7QUFDRCxTQUFPRixZQUFQO0FBQ0QsQ0FwQk07QUFzQlA7Ozs7Ozs7QUFNQSxPQUFPLElBQU1HLDBCQUEwQixHQUFHLFNBQTdCQSwwQkFBNkIsQ0FBQzVDLEtBQUQsRUFBUWlCLFFBQVIsRUFBcUI7QUFDN0Q7QUFDQSxNQUFJNEIsVUFBVSxHQUFHM0MsTUFBTSxDQUFDRixLQUFELENBQU4sQ0FDZE4sT0FEYyxDQUNOLFdBRE0sRUFDTyxFQURQLEVBRWRBLE9BRmMsQ0FFTixHQUZNLEVBRUQsR0FGQyxDQUFqQjtBQUdBbUQsRUFBQUEsVUFBVSxHQUFHWixLQUFLLENBQUNYLE1BQU0sQ0FBQ3VCLFVBQUQsQ0FBUCxDQUFMLEdBQTRCLENBQTVCLEdBQWdDdkIsTUFBTSxDQUFDdUIsVUFBRCxDQUFuRDtBQUNBLFNBQU9BLFVBQVUsQ0FBQ3RCLE9BQVgsQ0FBbUJOLFFBQW5CLENBQVA7QUFDRCxDQVBNO0FBU1A7Ozs7Ozs7O0FBT0EsT0FBTyxJQUFNNkIsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQzlDLEtBQUQ7QUFBQSxTQUFXc0IsTUFBTSxDQUFDdEIsS0FBRCxDQUFOLENBQWN1QixPQUFkLENBQXNCeEIsaUJBQWlCLENBQUNDLEtBQUQsQ0FBdkMsQ0FBWDtBQUFBLENBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQgeyBERUZBVUxUX0NVUlJFTkNZLCBGWFJBVEVfREVDSU1BTFMsIFNLSVBQRURfREFURV9GT1JNQVQgfSBmcm9tICcuL2Zvcm1hdC11dGlscy5jb25zdGFudHMnO1xuXG4vLyBIYXJkIGNvZGVkIGN1cnJlbmNpZXMgdGhhdCBoYXMgdHdvIGRlY2ltYWwgcGxhY2VzXG4vLyBGaXggYnVnIGluIENocm9tZSB0aGF0IGZhaWxzIHRvIGNvdW50IGRlY2ltYWxzIGZvciB0aGVzZSBjdXJyZW5jaWVzXG5jb25zdCBERUNfQ09VTlRfMiA9IFsnQUZOJywgJ0FMTCcsICdJUlInLCAnS1BXJywgJ0xBSycsICdMQlAnLCAnTUdBJywgJ01NSycsICdSU0QnLCAnU0xMJywgJ1NPUycsICdTWVAnXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuY29uc3QgREVDX0NPVU5UXzMgPSBbJ0lRRCddO1xuXG4vKipcbiAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBjdXJyZW5jeS5cbiAqIElucHV0OiBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAwLlxuICogRGVmYXVsdHMgdG8gMi5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEN1cnJlbmN5RGVjaW1hbHMgPSAoY3VycmVuY3kpID0+IHtcbiAgY29uc3QgbnVtYmVyT3B0aW9ucyA9IHtcbiAgICBjdXJyZW5jeTogY3VycmVuY3kgfHwgREVGQVVMVF9DVVJSRU5DWSxcbiAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICBjdXJyZW5jeURpc3BsYXk6ICdjb2RlJyxcbiAgICB1c2VHcm91cGluZzogZmFsc2UsXG4gIH07XG4gIC8vIEhhcmQgY29kZXMgZGVjaW1hbCBjb3VudHNcbiAgaWYgKERFQ19DT1VOVF8yLmluY2x1ZGVzKGN1cnJlbmN5KSkge1xuICAgIHJldHVybiAyO1xuICB9XG4gIGlmIChERUNfQ09VTlRfMy5pbmNsdWRlcyhjdXJyZW5jeSkpIHtcbiAgICByZXR1cm4gMztcbiAgfVxuICB0cnkge1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUdCJywgbnVtYmVyT3B0aW9ucylcbiAgICAgIC5mb3JtYXQoMS4xMTExMTEpXG4gICAgICAucmVwbGFjZSgvW15cXGQuLF0vZywgJycpO1xuICAgIGNvbnN0IGZvdW5kU2VwYXJhdG9yID0gdGVzdC5zZWFyY2goL1suLF0vZyk7XG4gICAgaWYgKGZvdW5kU2VwYXJhdG9yID09PSAtMSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB0ZXN0Lmxlbmd0aCAtIGZvdW5kU2VwYXJhdG9yIC0gMTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIEluIGFueSBlcnJvciBjYXNlLCByZXR1cm4gMiBkZWNpbWFscy5cbiAgICByZXR1cm4gMjtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlIDo6IFtudW1iZXIsIHN0cmluZ10uXG4gKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiA2LlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6IDguXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGWFJhdGVEZWNpbWFscyA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCB2YWx1ZVN0cmluZyA9IFN0cmluZyhwYXJzZUZsb2F0KFN0cmluZyh2YWx1ZSkpKTtcbiAgY29uc3QgZGVjaW1hbFNlcGFyYXRvciA9IHZhbHVlU3RyaW5nLmluZGV4T2YoJy4nKTtcbiAgY29uc3QgZGVjaW1hbE51bWJlciA9IHZhbHVlU3RyaW5nLmxlbmd0aCAtIGRlY2ltYWxTZXBhcmF0b3IgLSAxO1xuICByZXR1cm4gZGVjaW1hbFNlcGFyYXRvciA9PT0gLTEgfHwgZGVjaW1hbE51bWJlciA8PSBGWFJBVEVfREVDSU1BTFNcbiAgICA/IEZYUkFURV9ERUNJTUFMU1xuICAgIDogZGVjaW1hbE51bWJlcjtcbn07XG5cbi8qKlxuICogR2V0IGxvY2FsIGRhdGUgYW5kIHRpbWUgZnJvbSBJU08gODYwMSB0aW1lc3RhbXAuIEl0J3MgY3Jvc3MtYnJvd3NlciAoSUUgZXNwZWNpYWxseSEpLlxuICogSW5wdXQ6IFVUQyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogT3V0cHV0OiB0aW1lc3RhbXAgOjogZGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldExvY2FsRGF0ZVRpbWUgPSAodGltZXN0YW1wKSA9PiB7XG4gIGNvbnN0IGlzb1RpbWVzdGFtcCA9IHRpbWVzdGFtcCAhPT0gbnVsbCAmJiB0aW1lc3RhbXAuc2xpY2UoLTEpICE9PSAnWidcbiAgICA/IGAke3RpbWVzdGFtcH1aYFxuICAgIDogdGltZXN0YW1wO1xuICBjb25zdCBsb2NhbFRpbWUgPSBuZXcgRGF0ZShpc29UaW1lc3RhbXApIC0gbmV3IERhdGUodGltZXN0YW1wKS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICBjb25zdCB0aW1lVG9Db252ZXJ0ID0gbG9jYWxUaW1lID49IDAgPyBsb2NhbFRpbWUgOiAwO1xuICByZXR1cm4gbmV3IERhdGUodGltZVRvQ29udmVydCk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBudW1iZXIgd2l0aCBzZXBhcmF0b3JzIGFuZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgOjogW251bWJlciwgZmxvYXQsIHN0cmluZ11cbiAqIG9wdGlvbnMgOjogb2JqZWN0IChvcHRpb25hbClcbiAqICAgIGRlY2ltYWxzIDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBvdmVycmlkZXMgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiAgICB0aG91c2FuZFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgLy8gZGVmYXVsdHMgdG8gbm9uZVxuICogICAgZGVjaW1hbFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgIC8vIGRlZmF1bHRzIHRvICcuJ1xuICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCB7IGRlY2ltYWxzOiAyIH0uIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMicuXG4gKiBFeGFtcGxlIG9mIGlucHV0OlxuICogIDUwMDAsIHsgZGVjaW1hbHM6IDIsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0TnVtYmVyID0gKHZhbHVlLCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzIHx8IDA7XG4gIGNvbnN0IGlzVHMgPSB0eXBlb2Ygb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvci5sZW5ndGg7XG4gIGNvbnN0IGlzRHMgPSB0eXBlb2Ygb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IubGVuZ3RoO1xuICBjb25zdCBmaXhlZE51bWJlciA9IE51bWJlcih2YWx1ZSkudG9GaXhlZChkZWNpbWFscyk7XG4gIGlmIChpc1RzIHx8IGlzRHMpIHtcbiAgICBpZiAoZGVjaW1hbHMgPiAwKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IGZpeGVkTnVtYmVyLnNwbGl0KCcuJyk7XG4gICAgICBpZiAoaXNUcykge1xuICAgICAgICBzcGxpdFswXSA9IHNwbGl0WzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKGlzRHMpIHtcbiAgICAgICAgcmV0dXJuIHNwbGl0LmpvaW4ob3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzcGxpdC5qb2luKCcuJyk7XG4gICAgfVxuICAgIGlmIChpc1RzKSB7XG4gICAgICByZXR1cm4gZml4ZWROdW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgfVxuICB9XG4gIHJldHVybiBmaXhlZE51bWJlcjtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFtb3VudCBhY2NvcmRpbmcgdG8gaXRzIGN1cnJlbmN5LlxuICogSW5wdXQ6IGFtb3VudCA6OiBbbnVtYmVyLCBzdHJpbmddXG4gKiBvcHRpb25zIDo6IG9iamVjdCAob3B0aW9uYWwpXG4gKiAgICBjdXJyZW5jeSA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gbnVtYmVyIG9mIGRlY2ltYWxzIGJ5IGN1cnJlbmN5XG4gKiAgICBkZWNpbWFscyA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gb3ZlcnJpZGVzIG51bWJlciBvZiBkZWNpbWFsc1xuICogICAgdGhvdXNhbmRTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgIC8vIGRlZmF1bHRzIHRvIG5vbmVcbiAqICAgIGRlY2ltYWxTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgICAvLyBkZWZhdWx0cyB0byAnLidcbiAqICAgIG11bHRpcGxpZXIgOjogbnVtYmVyIChvcHRpb25hbCkgICAgICAgICAvLyBhbW91bnQgaXMgbXVsdGlwbGllZCBieSBtdWx0aXBsaWVyXG4gKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLCAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6XG4gKiAgNTAwMCwgeyBjdXJyZW5jeTogJ0VVUicsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0Q3VycmVuY3lBbW91bnQgPSAoYW1vdW50LCBvcHRpb25zID0ge30pID0+IHtcbiAgbGV0IGFtb3VudFN0ciA9IFN0cmluZyhhbW91bnQpLnJlcGxhY2UoL1xccy9nLCAnJyk7XG5cbiAgLy8gU3RyaXBzIGFsbCB0aG91c2FuZCBzZXBhcmF0b3JcbiAgaWYgKG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpIHtcbiAgICBhbW91bnRTdHIgPSBhbW91bnRTdHIucmVwbGFjZShuZXcgUmVnRXhwKGBcXFxcJHtvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yfWAsICdnJyksICcnKTtcbiAgfVxuICAvLyBiZWZvcmUgbnVtYmVyIGNvbnZlcnRpb24gZGVjaW1hbCBzZXBhcmF0b3IgaXMgcmVwbGFjZWQgd2l0aCBwcm9wZXIgb25lXG4gIGlmIChvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IgIT09ICcuJykge1xuICAgIGFtb3VudFN0ciA9IGFtb3VudFN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoYFxcXFwke29wdGlvbnMuZGVjaW1hbFNlcGFyYXRvcn1gLCAnZycpLCAnLicpO1xuICB9XG5cbiAgY29uc3QgeyBtdWx0aXBsaWVyIH0gPSBvcHRpb25zO1xuICBjb25zdCBhbW91bnRGbG9hdCA9IG11bHRpcGxpZXIgPyBtdWx0aXBsaWVyICogcGFyc2VGbG9hdChhbW91bnRTdHIpIDogcGFyc2VGbG9hdChhbW91bnRTdHIpO1xuXG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyA9PT0gdW5kZWZpbmVkXG4gICAgPyBnZXRDdXJyZW5jeURlY2ltYWxzKG9wdGlvbnMuY3VycmVuY3kpXG4gICAgOiBvcHRpb25zLmRlY2ltYWxzO1xuICByZXR1cm4gTnVtYmVyLmlzTmFOKGFtb3VudEZsb2F0KVxuICAgID8gYW1vdW50RmxvYXRcbiAgICA6IGZvcm1hdE51bWJlcihhbW91bnRGbG9hdCwgeyAuLi5vcHRpb25zLCBkZWNpbWFscyB9KTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGRhdGUgdG8gYSBjaG9zZW4gZm9ybWF0LlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IGRhdGUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcwMS4wMS4yMDE3Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQpID0+IHtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuZm9ybWF0KGRhdGVGb3JtYXQpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGxvY2FsaXplZCBkYXRlIHN0cmluZyB0byBJU08gdGltZXN0YW1wLlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgc2lnbiBvZiBzdHJpY3QgZGF0ZSBmb3JtYXQgOjpcbiAqIGJvb2xlYW4gKG9wdGlvbmFsKSwgZGVmYXVsdCB2YWx1ZSA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgZGVmYXVsdCBkYXRlIGZvcm1hdCA6OlxuICogc3RyaW5nIChvcHRpb25hbCkuXG4gKiBPdXRwdXQ6IElTTyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXREYXRlVG9JU08gPSAoXG4gIHZhbHVlLFxuICBkYXRlRm9ybWF0ID0gbnVsbCxcbiAgaXNTdHJpY3QgPSBmYWxzZSxcbiAgZGVmYXVsdFZhbHVlID0gJycsXG4gIGRlZmF1bHREYXRlRm9ybWF0ID0gbnVsbCxcbikgPT4ge1xuICBpZiAoaXNTdHJpY3QgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgU0tJUFBFRF9EQVRFX0ZPUk1BVCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgaWYgKGRhdGVGb3JtYXQgIT09IG51bGwgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGVmYXVsdERhdGVGb3JtYXQgIT09IG51bGwgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhbiBpbnB1dCB0byBhIGZsb2F0IHdpdGggZml4ZWQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICogSW5wdXQ6IHZhbHVlIHRvIGZvcm1hdCA6OiBbbnVtYmVyLCBzdHJpbmddLCBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBPdXRwdXQ6IGZvcm1hdHRlZCB2YWx1ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMjMgMDAwLjFhYmMnLCAnMicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjMwMDAuMTAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMgPSAodmFsdWUsIGRlY2ltYWxzKSA9PiB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xuICBsZXQgZmxvYXRWYWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICAucmVwbGFjZSgvW15cXGQuLC1dL2csICcnKVxuICAgIC5yZXBsYWNlKCcsJywgJy4nKTtcbiAgZmxvYXRWYWx1ZSA9IGlzTmFOKE51bWJlcihmbG9hdFZhbHVlKSkgPyAwIDogTnVtYmVyKGZsb2F0VmFsdWUpO1xuICByZXR1cm4gZmxvYXRWYWx1ZS50b0ZpeGVkKGRlY2ltYWxzKTtcbn07XG5cbi8qKlxuICogRm9ybWF0IEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZS5cbiAqIE91dHB1dDogcmF0ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTEwMDAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMjM0NTY3OCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGWFJhdGUgPSAodmFsdWUpID0+IE51bWJlcih2YWx1ZSkudG9GaXhlZChnZXRGWFJhdGVEZWNpbWFscyh2YWx1ZSkpO1xuIl19