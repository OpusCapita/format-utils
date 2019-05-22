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

  var amountStr = String(amount).replace(/\s/g, ''); // Replaces all commas with dots, if comma isn't used as a thousand separator

  if (options.thousandSeparator !== ',') {
    amountStr = amountStr.replace(',', '.');
  }

  var decimals = options.decimals === undefined ? getCurrencyDecimals(options.currency) : options.decimals;
  return formatNumber(parseFloat(amountStr), _extends({}, options, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsIkRFRkFVTFRfQ1VSUkVOQ1kiLCJGWFJBVEVfREVDSU1BTFMiLCJTS0lQUEVEX0RBVEVfRk9STUFUIiwiZ2V0Q3VycmVuY3lEZWNpbWFscyIsImN1cnJlbmN5IiwibnVtYmVyT3B0aW9ucyIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJnZXRGWFJhdGVEZWNpbWFscyIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwiZ2V0TG9jYWxEYXRlVGltZSIsInRpbWVzdGFtcCIsImlzb1RpbWVzdGFtcCIsInNsaWNlIiwibG9jYWxUaW1lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidGltZVRvQ29udmVydCIsImZvcm1hdE51bWJlciIsIm9wdGlvbnMiLCJkZWNpbWFscyIsImlzVHMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImlzRHMiLCJmaXhlZE51bWJlciIsIk51bWJlciIsInRvRml4ZWQiLCJzcGxpdCIsImpvaW4iLCJmb3JtYXRDdXJyZW5jeUFtb3VudCIsImFtb3VudCIsImFtb3VudFN0ciIsInVuZGVmaW5lZCIsImZvcm1hdERhdGUiLCJkYXRlRm9ybWF0IiwidXRjIiwiaXNWYWxpZCIsIklTT184NjAxIiwiZm9ybWF0RGF0ZVRvSVNPIiwiaXNTdHJpY3QiLCJkZWZhdWx0VmFsdWUiLCJkZWZhdWx0RGF0ZUZvcm1hdCIsInRvSVNPU3RyaW5nIiwiZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMiLCJmbG9hdFZh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RCxHQUFQLENBQVdoQyxLQUFYLEVBQWtCc0MsaUJBQWxCLEVBQXFDRixRQUFyQyxFQUErQ0gsT0FBL0MsRUFBbEMsRUFBNEY7QUFDMUYsV0FBT3ZELE1BQU0sQ0FBQ3NELEdBQVAsQ0FBV2hDLEtBQVgsRUFBa0JzQyxpQkFBbEIsRUFBcUNGLFFBQXJDLEVBQStDRyxXQUEvQyxFQUFQO0FBQ0Q7O0FBQ0QsU0FBT0YsWUFBUDtBQUNELENBcEJNO0FBc0JQOzs7Ozs7O0FBTUEsT0FBTyxJQUFNRywwQkFBMEIsR0FBRyxTQUE3QkEsMEJBQTZCLENBQUN4QyxLQUFELEVBQVFpQixRQUFSLEVBQXFCO0FBQzdEO0FBQ0EsTUFBSXdCLFVBQVUsR0FBR3ZDLE1BQU0sQ0FBQ0YsS0FBRCxDQUFOLENBQ2RSLE9BRGMsQ0FDTixXQURNLEVBQ08sRUFEUCxFQUVkQSxPQUZjLENBRU4sR0FGTSxFQUVELEdBRkMsQ0FBakI7QUFHQWlELEVBQUFBLFVBQVUsR0FBR0MsS0FBSyxDQUFDcEIsTUFBTSxDQUFDbUIsVUFBRCxDQUFQLENBQUwsR0FBNEIsQ0FBNUIsR0FBZ0NuQixNQUFNLENBQUNtQixVQUFELENBQW5EO0FBQ0EsU0FBT0EsVUFBVSxDQUFDbEIsT0FBWCxDQUFtQk4sUUFBbkIsQ0FBUDtBQUNELENBUE07QUFTUDs7Ozs7Ozs7QUFPQSxPQUFPLElBQU0wQixZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBM0MsS0FBSztBQUFBLFNBQUlzQixNQUFNLENBQUN0QixLQUFELENBQU4sQ0FBY3VCLE9BQWQsQ0FBc0J4QixpQkFBaUIsQ0FBQ0MsS0FBRCxDQUF2QyxDQUFKO0FBQUEsQ0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7IERFRkFVTFRfQ1VSUkVOQ1ksIEZYUkFURV9ERUNJTUFMUywgU0tJUFBFRF9EQVRFX0ZPUk1BVCB9IGZyb20gJy4vZm9ybWF0LXV0aWxzLmNvbnN0YW50cyc7XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIGN1cnJlbmN5LlxuICogSW5wdXQ6IGN1cnJlbmN5IGNvZGUgOjogc3RyaW5nLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDAuXG4gKiBEZWZhdWx0cyB0byAyLlxuICovXG5leHBvcnQgY29uc3QgZ2V0Q3VycmVuY3lEZWNpbWFscyA9IChjdXJyZW5jeSkgPT4ge1xuICBjb25zdCBudW1iZXJPcHRpb25zID0ge1xuICAgIGN1cnJlbmN5OiBjdXJyZW5jeSB8fCBERUZBVUxUX0NVUlJFTkNZLFxuICAgIHN0eWxlOiAnY3VycmVuY3knLFxuICAgIGN1cnJlbmN5RGlzcGxheTogJ2NvZGUnLFxuICAgIHVzZUdyb3VwaW5nOiBmYWxzZSxcbiAgfTtcbiAgdHJ5IHtcbiAgICBjb25zdCB0ZXN0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1HQicsIG51bWJlck9wdGlvbnMpXG4gICAgICAuZm9ybWF0KDEuMTExMTExKVxuICAgICAgLnJlcGxhY2UoL1teXFxkLixdL2csICcnKTtcbiAgICBjb25zdCBmb3VuZFNlcGFyYXRvciA9IHRlc3Quc2VhcmNoKC9bLixdL2cpO1xuICAgIGlmIChmb3VuZFNlcGFyYXRvciA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGVzdC5sZW5ndGggLSBmb3VuZFNlcGFyYXRvciAtIDE7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgcmV0dXJuIDI7XG4gIH1cbn07XG5cbi8qKlxuICogR2V0IGEgbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIGZvciBhIEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICogT3V0cHV0OiBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogNi5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiA4LlxuICovXG5leHBvcnQgY29uc3QgZ2V0RlhSYXRlRGVjaW1hbHMgPSAodmFsdWUpID0+IHtcbiAgY29uc3QgdmFsdWVTdHJpbmcgPSBTdHJpbmcocGFyc2VGbG9hdChTdHJpbmcodmFsdWUpKSk7XG4gIGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgPSB2YWx1ZVN0cmluZy5pbmRleE9mKCcuJyk7XG4gIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkZWNpbWFsU2VwYXJhdG9yIC0gMTtcbiAgcmV0dXJuIGRlY2ltYWxTZXBhcmF0b3IgPT09IC0xIHx8IGRlY2ltYWxOdW1iZXIgPD0gRlhSQVRFX0RFQ0lNQUxTXG4gICAgPyBGWFJBVEVfREVDSU1BTFNcbiAgICA6IGRlY2ltYWxOdW1iZXI7XG59O1xuXG4vKipcbiAqIEdldCBsb2NhbCBkYXRlIGFuZCB0aW1lIGZyb20gSVNPIDg2MDEgdGltZXN0YW1wLiBJdCdzIGNyb3NzLWJyb3dzZXIgKElFIGVzcGVjaWFsbHkhKS5cbiAqIElucHV0OiBVVEMgdGltZXN0YW1wIDo6IHN0cmluZy5cbiAqIE91dHB1dDogdGltZXN0YW1wIDo6IGRhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRMb2NhbERhdGVUaW1lID0gKHRpbWVzdGFtcCkgPT4ge1xuICBjb25zdCBpc29UaW1lc3RhbXAgPSB0aW1lc3RhbXAgIT09IG51bGwgJiYgdGltZXN0YW1wLnNsaWNlKC0xKSAhPT0gJ1onXG4gICAgPyBgJHt0aW1lc3RhbXB9WmBcbiAgICA6IHRpbWVzdGFtcDtcbiAgY29uc3QgbG9jYWxUaW1lID0gbmV3IERhdGUoaXNvVGltZXN0YW1wKSAtIG5ldyBEYXRlKHRpbWVzdGFtcCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgY29uc3QgdGltZVRvQ29udmVydCA9IGxvY2FsVGltZSA+PSAwID8gbG9jYWxUaW1lIDogMDtcbiAgcmV0dXJuIG5ldyBEYXRlKHRpbWVUb0NvbnZlcnQpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgbnVtYmVyIHdpdGggc2VwYXJhdG9ycyBhbmQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICogSW5wdXQ6IHZhbHVlIDo6IFtudW1iZXIsIGZsb2F0LCBzdHJpbmddXG4gKiBvcHRpb25zIDo6IG9iamVjdCAob3B0aW9uYWwpXG4gKiAgICBkZWNpbWFscyA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gb3ZlcnJpZGVzIG51bWJlciBvZiBkZWNpbWFsc1xuICogICAgdGhvdXNhbmRTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgIC8vIGRlZmF1bHRzIHRvIG5vbmVcbiAqICAgIGRlY2ltYWxTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgICAvLyBkZWZhdWx0cyB0byAnLidcbiAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMScuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMywgeyBkZWNpbWFsczogMiB9LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTInLlxuICogRXhhbXBsZSBvZiBpbnB1dDpcbiAqICA1MDAwLCB7IGRlY2ltYWxzOiAyLCB0aG91c2FuZFNlcGFyYXRvcjogJywnLCBkZWNpbWFsU2VwYXJhdG9yOiAnLicgfVxuICogIG91dHB1dDogJzUsMDAwLjAwJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdE51bWJlciA9ICh2YWx1ZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyB8fCAwO1xuICBjb25zdCBpc1RzID0gdHlwZW9mIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IubGVuZ3RoO1xuICBjb25zdCBpc0RzID0gdHlwZW9mIG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yLmxlbmd0aDtcbiAgY29uc3QgZml4ZWROdW1iZXIgPSBOdW1iZXIodmFsdWUpLnRvRml4ZWQoZGVjaW1hbHMpO1xuICBpZiAoaXNUcyB8fCBpc0RzKSB7XG4gICAgaWYgKGRlY2ltYWxzID4gMCkge1xuICAgICAgY29uc3Qgc3BsaXQgPSBmaXhlZE51bWJlci5zcGxpdCgnLicpO1xuICAgICAgaWYgKGlzVHMpIHtcbiAgICAgICAgc3BsaXRbMF0gPSBzcGxpdFswXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0RzKSB7XG4gICAgICAgIHJldHVybiBzcGxpdC5qb2luKG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3BsaXQuam9pbignLicpO1xuICAgIH1cbiAgICBpZiAoaXNUcykge1xuICAgICAgcmV0dXJuIGZpeGVkTnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZml4ZWROdW1iZXI7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhbW91bnQgYWNjb3JkaW5nIHRvIGl0cyBjdXJyZW5jeS5cbiAqIElucHV0OiBhbW91bnQgOjogW251bWJlciwgc3RyaW5nXVxuICogb3B0aW9ucyA6OiBvYmplY3QgKG9wdGlvbmFsKVxuICogICAgY3VycmVuY3kgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG51bWJlciBvZiBkZWNpbWFscyBieSBjdXJyZW5jeVxuICogICAgZGVjaW1hbHMgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG92ZXJyaWRlcyBudW1iZXIgb2YgZGVjaW1hbHNcbiAqICAgIHRob3VzYW5kU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAvLyBkZWZhdWx0cyB0byBub25lXG4gKiAgICBkZWNpbWFsU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAgLy8gZGVmYXVsdHMgdG8gJy4nXG4gKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLCAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6XG4gKiAgNTAwMCwgeyBjdXJyZW5jeTogJ0VVUicsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0Q3VycmVuY3lBbW91bnQgPSAoYW1vdW50LCBvcHRpb25zID0ge30pID0+IHtcbiAgbGV0IGFtb3VudFN0ciA9IFN0cmluZyhhbW91bnQpLnJlcGxhY2UoL1xccy9nLCAnJyk7XG5cbiAgLy8gUmVwbGFjZXMgYWxsIGNvbW1hcyB3aXRoIGRvdHMsIGlmIGNvbW1hIGlzbid0IHVzZWQgYXMgYSB0aG91c2FuZCBzZXBhcmF0b3JcbiAgaWYgKG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IgIT09ICcsJykge1xuICAgIGFtb3VudFN0ciA9IGFtb3VudFN0ci5yZXBsYWNlKCcsJywgJy4nKTtcbiAgfVxuXG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyA9PT0gdW5kZWZpbmVkXG4gICAgPyBnZXRDdXJyZW5jeURlY2ltYWxzKG9wdGlvbnMuY3VycmVuY3kpXG4gICAgOiBvcHRpb25zLmRlY2ltYWxzO1xuICByZXR1cm4gZm9ybWF0TnVtYmVyKHBhcnNlRmxvYXQoYW1vdW50U3RyKSwgeyAuLi5vcHRpb25zLCBkZWNpbWFscyB9KTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGRhdGUgdG8gYSBjaG9zZW4gZm9ybWF0LlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IGRhdGUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcwMS4wMS4yMDE3Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQpID0+IHtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuZm9ybWF0KGRhdGVGb3JtYXQpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGxvY2FsaXplZCBkYXRlIHN0cmluZyB0byBJU08gdGltZXN0YW1wLlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgc2lnbiBvZiBzdHJpY3QgZGF0ZSBmb3JtYXQgOjpcbiAqIGJvb2xlYW4gKG9wdGlvbmFsKSwgZGVmYXVsdCB2YWx1ZSA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgZGVmYXVsdCBkYXRlIGZvcm1hdCA6OlxuICogc3RyaW5nIChvcHRpb25hbCkuXG4gKiBPdXRwdXQ6IElTTyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXREYXRlVG9JU08gPSAoXG4gIHZhbHVlLFxuICBkYXRlRm9ybWF0ID0gbnVsbCxcbiAgaXNTdHJpY3QgPSBmYWxzZSxcbiAgZGVmYXVsdFZhbHVlID0gJycsXG4gIGRlZmF1bHREYXRlRm9ybWF0ID0gbnVsbCxcbikgPT4ge1xuICBpZiAoaXNTdHJpY3QgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgU0tJUFBFRF9EQVRFX0ZPUk1BVCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgaWYgKGRhdGVGb3JtYXQgIT09IG51bGwgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGVmYXVsdERhdGVGb3JtYXQgIT09IG51bGwgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhbiBpbnB1dCB0byBhIGZsb2F0IHdpdGggZml4ZWQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICogSW5wdXQ6IHZhbHVlIHRvIGZvcm1hdCA6OiBbbnVtYmVyLCBzdHJpbmddLCBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBPdXRwdXQ6IGZvcm1hdHRlZCB2YWx1ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMjMgMDAwLjFhYmMnLCAnMicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjMwMDAuMTAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMgPSAodmFsdWUsIGRlY2ltYWxzKSA9PiB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xuICBsZXQgZmxvYXRWYWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICAucmVwbGFjZSgvW15cXGQuLC1dL2csICcnKVxuICAgIC5yZXBsYWNlKCcsJywgJy4nKTtcbiAgZmxvYXRWYWx1ZSA9IGlzTmFOKE51bWJlcihmbG9hdFZhbHVlKSkgPyAwIDogTnVtYmVyKGZsb2F0VmFsdWUpO1xuICByZXR1cm4gZmxvYXRWYWx1ZS50b0ZpeGVkKGRlY2ltYWxzKTtcbn07XG5cbi8qKlxuICogRm9ybWF0IEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZS5cbiAqIE91dHB1dDogcmF0ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTEwMDAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMjM0NTY3OCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGWFJhdGUgPSB2YWx1ZSA9PiBOdW1iZXIodmFsdWUpLnRvRml4ZWQoZ2V0RlhSYXRlRGVjaW1hbHModmFsdWUpKTtcbiJdfQ==