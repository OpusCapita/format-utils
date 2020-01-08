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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsIkRFRkFVTFRfQ1VSUkVOQ1kiLCJGWFJBVEVfREVDSU1BTFMiLCJTS0lQUEVEX0RBVEVfRk9STUFUIiwiREVDX0NPVU5UXzIiLCJERUNfQ09VTlRfMyIsImdldEN1cnJlbmN5RGVjaW1hbHMiLCJjdXJyZW5jeSIsIm51bWJlck9wdGlvbnMiLCJzdHlsZSIsImN1cnJlbmN5RGlzcGxheSIsInVzZUdyb3VwaW5nIiwiaW5jbHVkZXMiLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsImUiLCJnZXRGWFJhdGVEZWNpbWFscyIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwiZ2V0TG9jYWxEYXRlVGltZSIsInRpbWVzdGFtcCIsImlzb1RpbWVzdGFtcCIsInNsaWNlIiwibG9jYWxUaW1lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidGltZVRvQ29udmVydCIsImZvcm1hdE51bWJlciIsIm9wdGlvbnMiLCJkZWNpbWFscyIsImlzVHMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImlzRHMiLCJmaXhlZE51bWJlciIsIk51bWJlciIsInRvRml4ZWQiLCJzcGxpdCIsImpvaW4iLCJmb3JtYXRDdXJyZW5jeUFtb3VudCIsImFtb3VudCIsImFtb3VudFN0ciIsInJlcGxhY2VWYWx1ZSIsIm11bHRpcGxpZXIiLCJhbW91bnRGbG9hdCIsInVuZGVmaW5lZCIsImlzTmFOIiwiZm9ybWF0RGF0ZSIsImRhdGVGb3JtYXQiLCJ1dGMiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJmb3JtYXREYXRlVG9JU08iLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyIsImZsb2F0VmFsdWUiLCJmb3JtYXRGWFJhdGUiXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBT0EsTUFBUCxNQUFtQixRQUFuQjtBQUVBLFNBQVNDLGdCQUFULEVBQTJCQyxlQUEzQixFQUE0Q0MsbUJBQTVDLFFBQXVFLDBCQUF2RSxDLENBRUE7QUFDQTs7QUFDQSxJQUFNQyxXQUFXLEdBQUcsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsS0FBN0IsRUFBb0MsS0FBcEMsRUFBMkMsS0FBM0MsRUFBa0QsS0FBbEQsRUFBeUQsS0FBekQsRUFBZ0UsS0FBaEUsRUFBdUUsS0FBdkUsRUFBOEUsS0FBOUUsQ0FBcEIsQyxDQUEwRzs7QUFDMUcsSUFBTUMsV0FBVyxHQUFHLENBQUMsS0FBRCxDQUFwQjtBQUVBOzs7Ozs7Ozs7QUFRQSxPQUFPLElBQU1DLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsUUFBRCxFQUFjO0FBQy9DLE1BQU1DLGFBQWEsR0FBRztBQUNwQkQsSUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUlOLGdCQURGO0FBRXBCUSxJQUFBQSxLQUFLLEVBQUUsVUFGYTtBQUdwQkMsSUFBQUEsZUFBZSxFQUFFLE1BSEc7QUFJcEJDLElBQUFBLFdBQVcsRUFBRTtBQUpPLEdBQXRCLENBRCtDLENBTy9DOztBQUNBLE1BQUlQLFdBQVcsQ0FBQ1EsUUFBWixDQUFxQkwsUUFBckIsQ0FBSixFQUFvQztBQUNsQyxXQUFPLENBQVA7QUFDRDs7QUFDRCxNQUFJRixXQUFXLENBQUNPLFFBQVosQ0FBcUJMLFFBQXJCLENBQUosRUFBb0M7QUFDbEMsV0FBTyxDQUFQO0FBQ0Q7O0FBQ0QsTUFBSTtBQUNGLFFBQU1NLElBQUksR0FBRyxJQUFJQyxJQUFJLENBQUNDLFlBQVQsQ0FBc0IsT0FBdEIsRUFBK0JQLGFBQS9CLEVBQ1ZRLE1BRFUsQ0FDSCxRQURHLEVB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QixVQUFVLEdBQUczQyxNQUFNLENBQUNGLEtBQUQsQ0FBTixDQUNkTixPQURjLENBQ04sV0FETSxFQUNPLEVBRFAsRUFFZEEsT0FGYyxDQUVOLEdBRk0sRUFFRCxHQUZDLENBQWpCO0FBR0FtRCxFQUFBQSxVQUFVLEdBQUdaLEtBQUssQ0FBQ1gsTUFBTSxDQUFDdUIsVUFBRCxDQUFQLENBQUwsR0FBNEIsQ0FBNUIsR0FBZ0N2QixNQUFNLENBQUN1QixVQUFELENBQW5EO0FBQ0EsU0FBT0EsVUFBVSxDQUFDdEIsT0FBWCxDQUFtQk4sUUFBbkIsQ0FBUDtBQUNELENBUE07QUFTUDs7Ozs7Ozs7QUFPQSxPQUFPLElBQU02QixZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDOUMsS0FBRDtBQUFBLFNBQVdzQixNQUFNLENBQUN0QixLQUFELENBQU4sQ0FBY3VCLE9BQWQsQ0FBc0J4QixpQkFBaUIsQ0FBQ0MsS0FBRCxDQUF2QyxDQUFYO0FBQUEsQ0FBckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7IERFRkFVTFRfQ1VSUkVOQ1ksIEZYUkFURV9ERUNJTUFMUywgU0tJUFBFRF9EQVRFX0ZPUk1BVCB9IGZyb20gJy4vZm9ybWF0LXV0aWxzLmNvbnN0YW50cyc7XG5cbi8vIEhhcmQgY29kZWQgY3VycmVuY2llcyB0aGF0IGhhcyB0d28gZGVjaW1hbCBwbGFjZXNcbi8vIEZpeCBidWcgaW4gQ2hyb21lIHRoYXQgZmFpbHMgdG8gY291bnQgZGVjaW1hbHMgZm9yIHRoZXNlIGN1cnJlbmNpZXNcbmNvbnN0IERFQ19DT1VOVF8yID0gWydBRk4nLCAnQUxMJywgJ0lSUicsICdLUFcnLCAnTEFLJywgJ0xCUCcsICdNR0EnLCAnTU1LJywgJ1JTRCcsICdTTEwnLCAnU09TJywgJ1NZUCddOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5jb25zdCBERUNfQ09VTlRfMyA9IFsnSVFEJ107XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIGN1cnJlbmN5LlxuICogSW5wdXQ6IGN1cnJlbmN5IGNvZGUgOjogc3RyaW5nLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDAuXG4gKiBEZWZhdWx0cyB0byAyLlxuICovXG5leHBvcnQgY29uc3QgZ2V0Q3VycmVuY3lEZWNpbWFscyA9IChjdXJyZW5jeSkgPT4ge1xuICBjb25zdCBudW1iZXJPcHRpb25zID0ge1xuICAgIGN1cnJlbmN5OiBjdXJyZW5jeSB8fCBERUZBVUxUX0NVUlJFTkNZLFxuICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgIGN1cnJlbmN5RGlzcGxheTogJ2NvZGUnLFxuICAgIHVzZUdyb3VwaW5nOiBmYWxzZSxcbiAgfTtcbiAgLy8gSGFyZCBjb2RlcyBkZWNpbWFsIGNvdW50c1xuICBpZiAoREVDX0NPVU5UXzIuaW5jbHVkZXMoY3VycmVuY3kpKSB7XG4gICAgcmV0dXJuIDI7XG4gIH1cbiAgaWYgKERFQ19DT1VOVF8zLmluY2x1ZGVzKGN1cnJlbmN5KSkge1xuICAgIHJldHVybiAzO1xuICB9XG4gIHRyeSB7XG4gICAgY29uc3QgdGVzdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCgnZW4tR0InLCBudW1iZXJPcHRpb25zKVxuICAgICAgLmZvcm1hdCgxLjExMTExMSlcbiAgICAgIC5yZXBsYWNlKC9bXlxcZC4sXS9nLCAnJyk7XG4gICAgY29uc3QgZm91bmRTZXBhcmF0b3IgPSB0ZXN0LnNlYXJjaCgvWy4sXS9nKTtcbiAgICBpZiAoZm91bmRTZXBhcmF0b3IgPT09IC0xKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRlc3QubGVuZ3RoIC0gZm91bmRTZXBhcmF0b3IgLSAxO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gSW4gYW55IGVycm9yIGNhc2UsIHJldHVybiAyIGRlY2ltYWxzLlxuICAgIHJldHVybiAyO1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBGWCByYXRlLlxuICogSW5wdXQ6IHJhdGUgOjogW251bWJlciwgc3RyaW5nXS5cbiAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6IDYuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogOC5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEZYUmF0ZURlY2ltYWxzID0gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IHZhbHVlU3RyaW5nID0gU3RyaW5nKHBhcnNlRmxvYXQoU3RyaW5nKHZhbHVlKSkpO1xuICBjb25zdCBkZWNpbWFsU2VwYXJhdG9yID0gdmFsdWVTdHJpbmcuaW5kZXhPZignLicpO1xuICBjb25zdCBkZWNpbWFsTnVtYmVyID0gdmFsdWVTdHJpbmcubGVuZ3RoIC0gZGVjaW1hbFNlcGFyYXRvciAtIDE7XG4gIHJldHVybiBkZWNpbWFsU2VwYXJhdG9yID09PSAtMSB8fCBkZWNpbWFsTnVtYmVyIDw9IEZYUkFURV9ERUNJTUFMU1xuICAgID8gRlhSQVRFX0RFQ0lNQUxTXG4gICAgOiBkZWNpbWFsTnVtYmVyO1xufTtcblxuLyoqXG4gKiBHZXQgbG9jYWwgZGF0ZSBhbmQgdGltZSBmcm9tIElTTyA4NjAxIHRpbWVzdGFtcC4gSXQncyBjcm9zcy1icm93c2VyIChJRSBlc3BlY2lhbGx5ISkuXG4gKiBJbnB1dDogVVRDIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IHRpbWVzdGFtcCA6OiBkYXRlLlxuICovXG5leHBvcnQgY29uc3QgZ2V0TG9jYWxEYXRlVGltZSA9ICh0aW1lc3RhbXApID0+IHtcbiAgY29uc3QgaXNvVGltZXN0YW1wID0gdGltZXN0YW1wICE9PSBudWxsICYmIHRpbWVzdGFtcC5zbGljZSgtMSkgIT09ICdaJ1xuICAgID8gYCR7dGltZXN0YW1wfVpgXG4gICAgOiB0aW1lc3RhbXA7XG4gIGNvbnN0IGxvY2FsVGltZSA9IG5ldyBEYXRlKGlzb1RpbWVzdGFtcCkgLSBuZXcgRGF0ZSh0aW1lc3RhbXApLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gIGNvbnN0IHRpbWVUb0NvbnZlcnQgPSBsb2NhbFRpbWUgPj0gMCA/IGxvY2FsVGltZSA6IDA7XG4gIHJldHVybiBuZXcgRGF0ZSh0aW1lVG9Db252ZXJ0KTtcbn07XG5cbi8qKlxuICogRm9ybWF0IG51bWJlciB3aXRoIHNlcGFyYXRvcnMgYW5kIG51bWJlciBvZiBkZWNpbWFscy5cbiAqIElucHV0OiB2YWx1ZSA6OiBbbnVtYmVyLCBmbG9hdCwgc3RyaW5nXVxuICogb3B0aW9ucyA6OiBvYmplY3QgKG9wdGlvbmFsKVxuICogICAgZGVjaW1hbHMgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG92ZXJyaWRlcyBudW1iZXIgb2YgZGVjaW1hbHNcbiAqICAgIHRob3VzYW5kU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAvLyBkZWZhdWx0cyB0byBub25lXG4gKiAgICBkZWNpbWFsU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAgLy8gZGVmYXVsdHMgdG8gJy4nXG4gKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsIHsgZGVjaW1hbHM6IDIgfS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6XG4gKiAgNTAwMCwgeyBkZWNpbWFsczogMiwgdGhvdXNhbmRTZXBhcmF0b3I6ICcsJywgZGVjaW1hbFNlcGFyYXRvcjogJy4nIH1cbiAqICBvdXRwdXQ6ICc1LDAwMC4wMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXROdW1iZXIgPSAodmFsdWUsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCBkZWNpbWFscyA9IG9wdGlvbnMuZGVjaW1hbHMgfHwgMDtcbiAgY29uc3QgaXNUcyA9IHR5cGVvZiBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yLmxlbmd0aDtcbiAgY29uc3QgaXNEcyA9IHR5cGVvZiBvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvci5sZW5ndGg7XG4gIGNvbnN0IGZpeGVkTnVtYmVyID0gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKGRlY2ltYWxzKTtcbiAgaWYgKGlzVHMgfHwgaXNEcykge1xuICAgIGlmIChkZWNpbWFscyA+IDApIHtcbiAgICAgIGNvbnN0IHNwbGl0ID0gZml4ZWROdW1iZXIuc3BsaXQoJy4nKTtcbiAgICAgIGlmIChpc1RzKSB7XG4gICAgICAgIHNwbGl0WzBdID0gc3BsaXRbMF0ucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgICB9XG4gICAgICBpZiAoaXNEcykge1xuICAgICAgICByZXR1cm4gc3BsaXQuam9pbihvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNwbGl0LmpvaW4oJy4nKTtcbiAgICB9XG4gICAgaWYgKGlzVHMpIHtcbiAgICAgIHJldHVybiBmaXhlZE51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpeGVkTnVtYmVyO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgYW1vdW50IGFjY29yZGluZyB0byBpdHMgY3VycmVuY3kuXG4gKiBJbnB1dDogYW1vdW50IDo6IFtudW1iZXIsIHN0cmluZ11cbiAqIG9wdGlvbnMgOjogb2JqZWN0IChvcHRpb25hbClcbiAqICAgIGN1cnJlbmN5IDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBudW1iZXIgb2YgZGVjaW1hbHMgYnkgY3VycmVuY3lcbiAqICAgIGRlY2ltYWxzIDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBvdmVycmlkZXMgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiAgICB0aG91c2FuZFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgLy8gZGVmYXVsdHMgdG8gbm9uZVxuICogICAgZGVjaW1hbFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgIC8vIGRlZmF1bHRzIHRvICcuJ1xuICogICAgbXVsdGlwbGllciA6OiBudW1iZXIgKG9wdGlvbmFsKSAgICAgICAgIC8vIGFtb3VudCBpcyBtdWx0aXBsaWVkIGJ5IG11bHRpcGxpZXJcbiAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEsICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICogRXhhbXBsZSBvZiBpbnB1dDpcbiAqICA1MDAwLCB7IGN1cnJlbmN5OiAnRVVSJywgdGhvdXNhbmRTZXBhcmF0b3I6ICcsJywgZGVjaW1hbFNlcGFyYXRvcjogJy4nIH1cbiAqICBvdXRwdXQ6ICc1LDAwMC4wMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRDdXJyZW5jeUFtb3VudCA9IChhbW91bnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgYW1vdW50U3RyID0gU3RyaW5nKGFtb3VudCkucmVwbGFjZSgvXFxzL2csICcnKTtcblxuICAvLyBTdHJpcHMgYWxsIGNvbW1hcyBPUiByZXBsYWNlcyBhbGwgY29tbWFzIHdpdGggZG90cywgaWYgY29tbWEgaXNuJ3QgdXNlZCBhcyBhIHRob3VzYW5kIHNlcGFyYXRvclxuICBjb25zdCByZXBsYWNlVmFsdWUgPSAob3B0aW9ucy50aG91c2FuZFNlcGFyYXRvciAhPT0gJywnKSA/ICcuJyA6ICcnO1xuICBhbW91bnRTdHIgPSBhbW91bnRTdHIucmVwbGFjZSgvLC9nLCByZXBsYWNlVmFsdWUpO1xuICBjb25zdCB7IG11bHRpcGxpZXIgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGFtb3VudEZsb2F0ID0gbXVsdGlwbGllciA/IG11bHRpcGxpZXIgKiBwYXJzZUZsb2F0KGFtb3VudFN0cikgOiBwYXJzZUZsb2F0KGFtb3VudFN0cik7XG5cbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzID09PSB1bmRlZmluZWRcbiAgICA/IGdldEN1cnJlbmN5RGVjaW1hbHMob3B0aW9ucy5jdXJyZW5jeSlcbiAgICA6IG9wdGlvbnMuZGVjaW1hbHM7XG4gIHJldHVybiBOdW1iZXIuaXNOYU4oYW1vdW50RmxvYXQpXG4gICAgPyBhbW91bnRGbG9hdFxuICAgIDogZm9ybWF0TnVtYmVyKGFtb3VudEZsb2F0LCB7IC4uLm9wdGlvbnMsIGRlY2ltYWxzIH0pO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgZGF0ZSB0byBhIGNob3NlbiBmb3JtYXQuXG4gKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGF0ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzAxLjAxLjIwMTcnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSwgZGF0ZUZvcm1hdCkgPT4ge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5mb3JtYXQoZGF0ZUZvcm1hdCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgbG9jYWxpemVkIGRhdGUgc3RyaW5nIHRvIElTTyB0aW1lc3RhbXAuXG4gKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZyAob3B0aW9uYWwpLCBzaWduIG9mIHN0cmljdCBkYXRlIGZvcm1hdCA6OlxuICogYm9vbGVhbiAob3B0aW9uYWwpLCBkZWZhdWx0IHZhbHVlIDo6IHN0cmluZyAob3B0aW9uYWwpLCBkZWZhdWx0IGRhdGUgZm9ybWF0IDo6XG4gKiBzdHJpbmcgKG9wdGlvbmFsKS5cbiAqIE91dHB1dDogSVNPIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMDEuMDEnLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGVUb0lTTyA9IChcbiAgdmFsdWUsXG4gIGRhdGVGb3JtYXQgPSBudWxsLFxuICBpc1N0cmljdCA9IGZhbHNlLFxuICBkZWZhdWx0VmFsdWUgPSAnJyxcbiAgZGVmYXVsdERhdGVGb3JtYXQgPSBudWxsLFxuKSA9PiB7XG4gIGlmIChpc1N0cmljdCAmJiBtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIGlmIChkZWZhdWx0RGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFuIGlucHV0IHRvIGEgZmxvYXQgd2l0aCBmaXhlZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgdG8gZm9ybWF0IDo6IFtudW1iZXIsIHN0cmluZ10sIGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIE91dHB1dDogZm9ybWF0dGVkIHZhbHVlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMyAwMDAuMWFiYycsICcyJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMzAwMC4xMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyA9ICh2YWx1ZSwgZGVjaW1hbHMpID0+IHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4gIGxldCBmbG9hdFZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bXlxcZC4sLV0vZywgJycpXG4gICAgLnJlcGxhY2UoJywnLCAnLicpO1xuICBmbG9hdFZhbHVlID0gaXNOYU4oTnVtYmVyKGZsb2F0VmFsdWUpKSA/IDAgOiBOdW1iZXIoZmxvYXRWYWx1ZSk7XG4gIHJldHVybiBmbG9hdFZhbHVlLnRvRml4ZWQoZGVjaW1hbHMpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlLlxuICogT3V0cHV0OiByYXRlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMTAwMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyMzQ1Njc4Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEZYUmF0ZSA9ICh2YWx1ZSkgPT4gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKGdldEZYUmF0ZURlY2ltYWxzKHZhbHVlKSk7XG4iXX0=