function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import moment from 'moment';
import { DEFAULT_CURRENCY, FXRATE_DECIMALS, SKIPPED_DATE_FORMAT } from './format-utils.constants';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsIkRFRkFVTFRfQ1VSUkVOQ1kiLCJGWFJBVEVfREVDSU1BTFMiLCJTS0lQUEVEX0RBVEVfRk9STUFUIiwiZ2V0Q3VycmVuY3lEZWNpbWFscyIsImN1cnJlbmN5IiwibnVtYmVyT3B0aW9ucyIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJnZXRGWFJhdGVEZWNpbWFscyIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwiZ2V0TG9jYWxEYXRlVGltZSIsInRpbWVzdGFtcCIsImlzb1RpbWVzdGFtcCIsInNsaWNlIiwibG9jYWxUaW1lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidGltZVRvQ29udmVydCIsImZvcm1hdE51bWJlciIsIm9wdGlvbnMiLCJkZWNpbWFscyIsImlzVHMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImlzRHMiLCJmaXhlZE51bWJlciIsIk51bWJlciIsInRvRml4ZWQiLCJzcGxpdCIsImpvaW4iLCJmb3JtYXRDdXJyZW5jeUFtb3VudCIsImFtb3VudCIsInVuZGVmaW5lZCIsImZvcm1hdERhdGUiLCJkYXRlRm9ybWF0IiwidXRjIiwiaXNWYWxpZCIsIklTT184NjAxIiwiZm9ybWF0RGF0ZVRvSVNPIiwiaXNTdHJpY3QiLCJkZWZhdWx0VmFsdWUiLCJkZWZhdWx0RGF0ZUZvcm1hdCIsInRvSVNPU3RyaW5nIiwiZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMiLCJmbG9hdFZhbHVlIiwiaXNOYU4i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QUFELEVBQVFpQixRQUFSLEVBQXFCO0FBQzdEO0FBQ0EsTUFBSXVCLFVBQVUsR0FBR3RDLE1BQU0sQ0FBQ0YsS0FBRCxDQUFOLENBQ2RSLE9BRGMsQ0FDTixXQURNLEVBQ08sRUFEUCxFQUVkQSxPQUZjLENBRU4sR0FGTSxFQUVELEdBRkMsQ0FBakI7QUFHQWdELEVBQUFBLFVBQVUsR0FBR0MsS0FBSyxDQUFDbkIsTUFBTSxDQUFDa0IsVUFBRCxDQUFQLENBQUwsR0FBNEIsQ0FBNUIsR0FBZ0NsQixNQUFNLENBQUNrQixVQUFELENBQW5EO0FBQ0EsU0FBT0EsVUFBVSxDQUFDakIsT0FBWCxDQUFtQk4sUUFBbkIsQ0FBUDtBQUNELENBUE07QUFTUDs7Ozs7Ozs7QUFPQSxPQUFPLElBQU15QixZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBMUMsS0FBSztBQUFBLFNBQUlzQixNQUFNLENBQUN0QixLQUFELENBQU4sQ0FBY3VCLE9BQWQsQ0FBc0J4QixpQkFBaUIsQ0FBQ0MsS0FBRCxDQUF2QyxDQUFKO0FBQUEsQ0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7IERFRkFVTFRfQ1VSUkVOQ1ksIEZYUkFURV9ERUNJTUFMUywgU0tJUFBFRF9EQVRFX0ZPUk1BVCB9IGZyb20gJy4vZm9ybWF0LXV0aWxzLmNvbnN0YW50cyc7XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIGN1cnJlbmN5LlxuICogSW5wdXQ6IGN1cnJlbmN5IGNvZGUgOjogc3RyaW5nLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDAuXG4gKiBEZWZhdWx0cyB0byAyLlxuICovXG5leHBvcnQgY29uc3QgZ2V0Q3VycmVuY3lEZWNpbWFscyA9IChjdXJyZW5jeSkgPT4ge1xuICBjb25zdCBudW1iZXJPcHRpb25zID0ge1xuICAgIGN1cnJlbmN5OiBjdXJyZW5jeSB8fCBERUZBVUxUX0NVUlJFTkNZLFxuICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgIGN1cnJlbmN5RGlzcGxheTogJ2NvZGUnLFxuICAgIHVzZUdyb3VwaW5nOiBmYWxzZSxcbiAgfTtcbiAgdHJ5IHtcbiAgICBjb25zdCB0ZXN0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1HQicsIG51bWJlck9wdGlvbnMpXG4gICAgICAuZm9ybWF0KDEuMTExMTExKVxuICAgICAgLnJlcGxhY2UoL1teXFxkLixdL2csICcnKTtcbiAgICBjb25zdCBmb3VuZFNlcGFyYXRvciA9IHRlc3Quc2VhcmNoKC9bLixdL2cpO1xuICAgIGlmIChmb3VuZFNlcGFyYXRvciA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGVzdC5sZW5ndGggLSBmb3VuZFNlcGFyYXRvciAtIDE7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgcmV0dXJuIDI7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogNi5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiA4LlxuICovXG5leHBvcnQgY29uc3QgZ2V0RlhSYXRlRGVjaW1hbHMgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgdmFsdWVTdHJpbmcgPSBTdHJpbmcocGFyc2VGbG9hdChTdHJpbmcodmFsdWUpKSk7XG4gIGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgPSB2YWx1ZVN0cmluZy5pbmRleE9mKCcuJyk7XG4gIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkZWNpbWFsU2VwYXJhdG9yIC0gMTtcbiAgcmV0dXJuIGRlY2ltYWxTZXBhcmF0b3IgPT09IC0xIHx8IGRlY2ltYWxOdW1iZXIgPD0gRlhSQVRFX0RFQ0lNQUxTXG4gICAgPyBGWFJBVEVfREVDSU1BTFNcbiAgICA6IGRlY2ltYWxOdW1iZXI7XG59O1xuXG4vKipcbiAqIEdldCBsb2NhbCBkYXRlIGFuZCB0aW1lIGZyb20gSVNPIDg2MDEgdGltZXN0YW1wLiBJdCdzIGNyb3NzLWJyb3dzZXIgKElFIGVzcGVjaWFsbHkhKS5cbiAqIElucHV0OiBVVEMgdGltZXN0YW1wIDo6IHN0cmluZy5cbiAqIE91dHB1dDogdGltZXN0YW1wIDo6IGRhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRMb2NhbERhdGVUaW1lID0gKHRpbWVzdGFtcCkgPT4ge1xuICBjb25zdCBpc29UaW1lc3RhbXAgPSB0aW1lc3RhbXAgIT09IG51bGwgJiYgdGltZXN0YW1wLnNsaWNlKC0xKSAhPT0gJ1onXG4gICAgPyBgJHt0aW1lc3RhbXB9WmBcbiAgICA6IHRpbWVzdGFtcDtcbiAgY29uc3QgbG9jYWxUaW1lID0gbmV3IERhdGUoaXNvVGltZXN0YW1wKSAtIG5ldyBEYXRlKHRpbWVzdGFtcCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgY29uc3QgdGltZVRvQ29udmVydCA9IGxvY2FsVGltZSA+PSAwID8gbG9jYWxUaW1lIDogMDtcbiAgcmV0dXJuIG5ldyBEYXRlKHRpbWVUb0NvbnZlcnQpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgbnVtYmVyIHdpdGggc2VwYXJhdG9ycyBhbmQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICogSW5wdXQ6IHZhbHVlIDo6IFtudW1iZXIsIGZsb2F0LCBzdHJpbmddXG4gKiBvcHRpb25zIDo6IG9iamVjdCAob3B0aW9uYWwpXG4gKiAgICBkZWNpbWFscyA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gb3ZlcnJpZGVzIG51bWJlciBvZiBkZWNpbWFsc1xuICogICAgdGhvdXNhbmRTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgIC8vIGRlZmF1bHRzIHRvIG5vbmVcbiAqICAgIGRlY2ltYWxTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgICAvLyBkZWZhdWx0cyB0byAnLidcbiAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMywgeyBkZWNpbWFsczogMiB9LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTInLlxuICogRXhhbXBsZSBvZiBpbnB1dDpcbiAqICA1MDAwLCB7IGRlY2ltYWxzOiAyLCB0aG91c2FuZFNlcGFyYXRvcjogJywnLCBkZWNpbWFsU2VwYXJhdG9yOiAnLicgfVxuICogIG91dHB1dDogJzUsMDAwLjAwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdE51bWJlciA9ICh2YWx1ZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyB8fCAwO1xuICBjb25zdCBpc1RzID0gdHlwZW9mIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IubGVuZ3RoO1xuICBjb25zdCBpc0RzID0gdHlwZW9mIG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yLmxlbmd0aDtcbiAgY29uc3QgZml4ZWROdW1iZXIgPSBOdW1iZXIodmFsdWUpLnRvRml4ZWQoZGVjaW1hbHMpO1xuICBpZiAoaXNUcyB8fCBpc0RzKSB7XG4gICAgaWYgKGRlY2ltYWxzID4gMCkge1xuICAgICAgY29uc3Qgc3BsaXQgPSBmaXhlZE51bWJlci5zcGxpdCgnLicpO1xuICAgICAgaWYgKGlzVHMpIHtcbiAgICAgICAgc3BsaXRbMF0gPSBzcGxpdFswXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0RzKSB7XG4gICAgICAgIHJldHVybiBzcGxpdC5qb2luKG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3BsaXQuam9pbignLicpO1xuICAgIH1cbiAgICBpZiAoaXNUcykge1xuICAgICAgcmV0dXJuIGZpeGVkTnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZml4ZWROdW1iZXI7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhbW91bnQgYWNjb3JkaW5nIHRvIGl0cyBjdXJyZW5jeS5cbiAqIElucHV0OiBhbW91bnQgOjogW251bWJlciwgc3RyaW5nXVxuICogb3B0aW9ucyA6OiBvYmplY3QgKG9wdGlvbmFsKVxuICogICAgY3VycmVuY3kgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG51bWJlciBvZiBkZWNpbWFscyBieSBjdXJyZW5jeVxuICogICAgZGVjaW1hbHMgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG92ZXJyaWRlcyBudW1iZXIgb2YgZGVjaW1hbHNcbiAqICAgIHRob3VzYW5kU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAvLyBkZWZhdWx0cyB0byBub25lXG4gKiAgICBkZWNpbWFsU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAgLy8gZGVmYXVsdHMgdG8gJy4nXG4gKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLCAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6XG4gKiAgNTAwMCwgeyBjdXJyZW5jeTogJ0VVUicsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0Q3VycmVuY3lBbW91bnQgPSAoYW1vdW50LCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzID09PSB1bmRlZmluZWRcbiAgICA/IGdldEN1cnJlbmN5RGVjaW1hbHMob3B0aW9ucy5jdXJyZW5jeSlcbiAgICA6IG9wdGlvbnMuZGVjaW1hbHM7XG4gIHJldHVybiBmb3JtYXROdW1iZXIoYW1vdW50LCB7IC4uLm9wdGlvbnMsIGRlY2ltYWxzIH0pO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgZGF0ZSB0byBhIGNob3NlbiBmb3JtYXQuXG4gKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGF0ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzAxLjAxLjIwMTcnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSwgZGF0ZUZvcm1hdCkgPT4ge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5mb3JtYXQoZGF0ZUZvcm1hdCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgbG9jYWxpemVkIGRhdGUgc3RyaW5nIHRvIElTTyB0aW1lc3RhbXAuXG4gKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZyAob3B0aW9uYWwpLCBzaWduIG9mIHN0cmljdCBkYXRlIGZvcm1hdCA6OlxuICogYm9vbGVhbiAob3B0aW9uYWwpLCBkZWZhdWx0IHZhbHVlIDo6IHN0cmluZyAob3B0aW9uYWwpLCBkZWZhdWx0IGRhdGUgZm9ybWF0IDo6XG4gKiBzdHJpbmcgKG9wdGlvbmFsKS5cbiAqIE91dHB1dDogSVNPIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMDEuMDEnLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGVUb0lTTyA9IChcbiAgdmFsdWUsXG4gIGRhdGVGb3JtYXQgPSBudWxsLFxuICBpc1N0cmljdCA9IGZhbHNlLFxuICBkZWZhdWx0VmFsdWUgPSAnJyxcbiAgZGVmYXVsdERhdGVGb3JtYXQgPSBudWxsLFxuKSA9PiB7XG4gIGlmIChpc1N0cmljdCAmJiBtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIGlmIChkZWZhdWx0RGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFuIGlucHV0IHRvIGEgZmxvYXQgd2l0aCBmaXhlZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgdG8gZm9ybWF0IDo6IFtudW1iZXIsIHN0cmluZ10sIGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIE91dHB1dDogZm9ybWF0dGVkIHZhbHVlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMyAwMDAuMWFiYycsICcyJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMzAwMC4xMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyA9ICh2YWx1ZSwgZGVjaW1hbHMpID0+IHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4gIGxldCBmbG9hdFZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bXlxcZC4sLV0vZywgJycpXG4gICAgLnJlcGxhY2UoJywnLCAnLicpO1xuICBmbG9hdFZhbHVlID0gaXNOYU4oTnVtYmVyKGZsb2F0VmFsdWUpKSA/IDAgOiBOdW1iZXIoZmxvYXRWYWx1ZSk7XG4gIHJldHVybiBmbG9hdFZhbHVlLnRvRml4ZWQoZGVjaW1hbHMpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlLlxuICogT3V0cHV0OiByYXRlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMTAwMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyMzQ1Njc4Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEZYUmF0ZSA9IHZhbHVlID0+IE51bWJlcih2YWx1ZSkudG9GaXhlZChnZXRGWFJhdGVEZWNpbWFscyh2YWx1ZSkpO1xuIl19