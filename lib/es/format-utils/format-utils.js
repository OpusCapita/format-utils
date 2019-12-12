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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsIkRFRkFVTFRfQ1VSUkVOQ1kiLCJGWFJBVEVfREVDSU1BTFMiLCJTS0lQUEVEX0RBVEVfRk9STUFUIiwiZ2V0Q3VycmVuY3lEZWNpbWFscyIsImN1cnJlbmN5IiwibnVtYmVyT3B0aW9ucyIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsImUiLCJnZXRGWFJhdGVEZWNpbWFscyIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwiZ2V0TG9jYWxEYXRlVGltZSIsInRpbWVzdGFtcCIsImlzb1RpbWVzdGFtcCIsInNsaWNlIiwibG9jYWxUaW1lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidGltZVRvQ29udmVydCIsImZvcm1hdE51bWJlciIsIm9wdGlvbnMiLCJkZWNpbWFscyIsImlzVHMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImlzRHMiLCJmaXhlZE51bWJlciIsIk51bWJlciIsInRvRml4ZWQiLCJzcGxpdCIsImpvaW4iLCJmb3JtYXRDdXJyZW5jeUFtb3VudCIsImFtb3VudCIsImFtb3VudFN0ciIsInJlcGxhY2VWYWx1ZSIsIm11bHRpcGxpZXIiLCJhbW91bnRGbG9hdCIsInVuZGVmaW5lZCIsImlzTmFOIiwiZm9ybWF0RGF0ZSIsImRhdGVGb3JtYXQiLCJ1dGMiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJmb3JtYXREYXRlVG9JU08iLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJmb3Jt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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQgeyBERUZBVUxUX0NVUlJFTkNZLCBGWFJBVEVfREVDSU1BTFMsIFNLSVBQRURfREFURV9GT1JNQVQgfSBmcm9tICcuL2Zvcm1hdC11dGlscy5jb25zdGFudHMnO1xuXG4vKipcbiAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBjdXJyZW5jeS5cbiAqIElucHV0OiBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAwLlxuICogRGVmYXVsdHMgdG8gMi5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEN1cnJlbmN5RGVjaW1hbHMgPSAoY3VycmVuY3kpID0+IHtcbiAgY29uc3QgbnVtYmVyT3B0aW9ucyA9IHtcbiAgICBjdXJyZW5jeTogY3VycmVuY3kgfHwgREVGQVVMVF9DVVJSRU5DWSxcbiAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICBjdXJyZW5jeURpc3BsYXk6ICdjb2RlJyxcbiAgICB1c2VHcm91cGluZzogZmFsc2UsXG4gIH07XG4gIHRyeSB7XG4gICAgY29uc3QgdGVzdCA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCgnZW4tR0InLCBudW1iZXJPcHRpb25zKVxuICAgICAgLmZvcm1hdCgxLjExMTExMSlcbiAgICAgIC5yZXBsYWNlKC9bXlxcZC4sXS9nLCAnJyk7XG4gICAgY29uc3QgZm91bmRTZXBhcmF0b3IgPSB0ZXN0LnNlYXJjaCgvWy4sXS9nKTtcbiAgICBpZiAoZm91bmRTZXBhcmF0b3IgPT09IC0xKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRlc3QubGVuZ3RoIC0gZm91bmRTZXBhcmF0b3IgLSAxO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gSW4gYW55IGVycm9yIGNhc2UsIHJldHVybiAyIGRlY2ltYWxzLlxuICAgIHJldHVybiAyO1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBGWCByYXRlLlxuICogSW5wdXQ6IHJhdGUgOjogW251bWJlciwgc3RyaW5nXS5cbiAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6IDYuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogOC5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEZYUmF0ZURlY2ltYWxzID0gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IHZhbHVlU3RyaW5nID0gU3RyaW5nKHBhcnNlRmxvYXQoU3RyaW5nKHZhbHVlKSkpO1xuICBjb25zdCBkZWNpbWFsU2VwYXJhdG9yID0gdmFsdWVTdHJpbmcuaW5kZXhPZignLicpO1xuICBjb25zdCBkZWNpbWFsTnVtYmVyID0gdmFsdWVTdHJpbmcubGVuZ3RoIC0gZGVjaW1hbFNlcGFyYXRvciAtIDE7XG4gIHJldHVybiBkZWNpbWFsU2VwYXJhdG9yID09PSAtMSB8fCBkZWNpbWFsTnVtYmVyIDw9IEZYUkFURV9ERUNJTUFMU1xuICAgID8gRlhSQVRFX0RFQ0lNQUxTXG4gICAgOiBkZWNpbWFsTnVtYmVyO1xufTtcblxuLyoqXG4gKiBHZXQgbG9jYWwgZGF0ZSBhbmQgdGltZSBmcm9tIElTTyA4NjAxIHRpbWVzdGFtcC4gSXQncyBjcm9zcy1icm93c2VyIChJRSBlc3BlY2lhbGx5ISkuXG4gKiBJbnB1dDogVVRDIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IHRpbWVzdGFtcCA6OiBkYXRlLlxuICovXG5leHBvcnQgY29uc3QgZ2V0TG9jYWxEYXRlVGltZSA9ICh0aW1lc3RhbXApID0+IHtcbiAgY29uc3QgaXNvVGltZXN0YW1wID0gdGltZXN0YW1wICE9PSBudWxsICYmIHRpbWVzdGFtcC5zbGljZSgtMSkgIT09ICdaJ1xuICAgID8gYCR7dGltZXN0YW1wfVpgXG4gICAgOiB0aW1lc3RhbXA7XG4gIGNvbnN0IGxvY2FsVGltZSA9IG5ldyBEYXRlKGlzb1RpbWVzdGFtcCkgLSBuZXcgRGF0ZSh0aW1lc3RhbXApLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gIGNvbnN0IHRpbWVUb0NvbnZlcnQgPSBsb2NhbFRpbWUgPj0gMCA/IGxvY2FsVGltZSA6IDA7XG4gIHJldHVybiBuZXcgRGF0ZSh0aW1lVG9Db252ZXJ0KTtcbn07XG5cbi8qKlxuICogRm9ybWF0IG51bWJlciB3aXRoIHNlcGFyYXRvcnMgYW5kIG51bWJlciBvZiBkZWNpbWFscy5cbiAqIElucHV0OiB2YWx1ZSA6OiBbbnVtYmVyLCBmbG9hdCwgc3RyaW5nXVxuICogb3B0aW9ucyA6OiBvYmplY3QgKG9wdGlvbmFsKVxuICogICAgZGVjaW1hbHMgOjogc3RyaW5nIChvcHRpb25hbCkgICAgICAgICAgIC8vIG92ZXJyaWRlcyBudW1iZXIgb2YgZGVjaW1hbHNcbiAqICAgIHRob3VzYW5kU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAvLyBkZWZhdWx0cyB0byBub25lXG4gKiAgICBkZWNpbWFsU2VwYXJhdG9yIDo6IHN0cmluZyAob3B0aW9uYWwpICAgLy8gZGVmYXVsdHMgdG8gJy4nXG4gKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsIHsgZGVjaW1hbHM6IDIgfS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6XG4gKiAgNTAwMCwgeyBkZWNpbWFsczogMiwgdGhvdXNhbmRTZXBhcmF0b3I6ICcsJywgZGVjaW1hbFNlcGFyYXRvcjogJy4nIH1cbiAqICBvdXRwdXQ6ICc1LDAwMC4wMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXROdW1iZXIgPSAodmFsdWUsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCBkZWNpbWFscyA9IG9wdGlvbnMuZGVjaW1hbHMgfHwgMDtcbiAgY29uc3QgaXNUcyA9IHR5cGVvZiBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yLmxlbmd0aDtcbiAgY29uc3QgaXNEcyA9IHR5cGVvZiBvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMuZGVjaW1hbFNlcGFyYXRvci5sZW5ndGg7XG4gIGNvbnN0IGZpeGVkTnVtYmVyID0gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKGRlY2ltYWxzKTtcbiAgaWYgKGlzVHMgfHwgaXNEcykge1xuICAgIGlmIChkZWNpbWFscyA+IDApIHtcbiAgICAgIGNvbnN0IHNwbGl0ID0gZml4ZWROdW1iZXIuc3BsaXQoJy4nKTtcbiAgICAgIGlmIChpc1RzKSB7XG4gICAgICAgIHNwbGl0WzBdID0gc3BsaXRbMF0ucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgICB9XG4gICAgICBpZiAoaXNEcykge1xuICAgICAgICByZXR1cm4gc3BsaXQuam9pbihvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNwbGl0LmpvaW4oJy4nKTtcbiAgICB9XG4gICAgaWYgKGlzVHMpIHtcbiAgICAgIHJldHVybiBmaXhlZE51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBvcHRpb25zLnRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpeGVkTnVtYmVyO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgYW1vdW50IGFjY29yZGluZyB0byBpdHMgY3VycmVuY3kuXG4gKiBJbnB1dDogYW1vdW50IDo6IFtudW1iZXIsIHN0cmluZ11cbiAqIG9wdGlvbnMgOjogb2JqZWN0IChvcHRpb25hbClcbiAqICAgIGN1cnJlbmN5IDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBudW1iZXIgb2YgZGVjaW1hbHMgYnkgY3VycmVuY3lcbiAqICAgIGRlY2ltYWxzIDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBvdmVycmlkZXMgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiAgICB0aG91c2FuZFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgLy8gZGVmYXVsdHMgdG8gbm9uZVxuICogICAgZGVjaW1hbFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgIC8vIGRlZmF1bHRzIHRvICcuJ1xuICogICAgbXVsdGlwbGllciA6OiBudW1iZXIgKG9wdGlvbmFsKSAgICAgICAgIC8vIGFtb3VudCBpcyBtdWx0aXBsaWVkIGJ5IG11bHRpcGxpZXJcbiAqIE91dHB1dDogYW1vdW50IDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEsICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICogRXhhbXBsZSBvZiBpbnB1dDpcbiAqICA1MDAwLCB7IGN1cnJlbmN5OiAnRVVSJywgdGhvdXNhbmRTZXBhcmF0b3I6ICcsJywgZGVjaW1hbFNlcGFyYXRvcjogJy4nIH1cbiAqICBvdXRwdXQ6ICc1LDAwMC4wMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRDdXJyZW5jeUFtb3VudCA9IChhbW91bnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBsZXQgYW1vdW50U3RyID0gU3RyaW5nKGFtb3VudCkucmVwbGFjZSgvXFxzL2csICcnKTtcblxuICAvLyBTdHJpcHMgYWxsIGNvbW1hcyBPUiByZXBsYWNlcyBhbGwgY29tbWFzIHdpdGggZG90cywgaWYgY29tbWEgaXNuJ3QgdXNlZCBhcyBhIHRob3VzYW5kIHNlcGFyYXRvclxuICBjb25zdCByZXBsYWNlVmFsdWUgPSAob3B0aW9ucy50aG91c2FuZFNlcGFyYXRvciAhPT0gJywnKSA/ICcuJyA6ICcnO1xuICBhbW91bnRTdHIgPSBhbW91bnRTdHIucmVwbGFjZSgvLC9nLCByZXBsYWNlVmFsdWUpO1xuICBjb25zdCB7IG11bHRpcGxpZXIgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGFtb3VudEZsb2F0ID0gbXVsdGlwbGllciA/IG11bHRpcGxpZXIgKiBwYXJzZUZsb2F0KGFtb3VudFN0cikgOiBwYXJzZUZsb2F0KGFtb3VudFN0cik7XG5cbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzID09PSB1bmRlZmluZWRcbiAgICA/IGdldEN1cnJlbmN5RGVjaW1hbHMob3B0aW9ucy5jdXJyZW5jeSlcbiAgICA6IG9wdGlvbnMuZGVjaW1hbHM7XG4gIHJldHVybiBOdW1iZXIuaXNOYU4oYW1vdW50RmxvYXQpXG4gICAgPyBhbW91bnRGbG9hdFxuICAgIDogZm9ybWF0TnVtYmVyKGFtb3VudEZsb2F0LCB7IC4uLm9wdGlvbnMsIGRlY2ltYWxzIH0pO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgZGF0ZSB0byBhIGNob3NlbiBmb3JtYXQuXG4gKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGF0ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzAxLjAxLjIwMTcnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSwgZGF0ZUZvcm1hdCkgPT4ge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5mb3JtYXQoZGF0ZUZvcm1hdCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgbG9jYWxpemVkIGRhdGUgc3RyaW5nIHRvIElTTyB0aW1lc3RhbXAuXG4gKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZyAob3B0aW9uYWwpLCBzaWduIG9mIHN0cmljdCBkYXRlIGZvcm1hdCA6OlxuICogYm9vbGVhbiAob3B0aW9uYWwpLCBkZWZhdWx0IHZhbHVlIDo6IHN0cmluZyAob3B0aW9uYWwpLCBkZWZhdWx0IGRhdGUgZm9ybWF0IDo6XG4gKiBzdHJpbmcgKG9wdGlvbmFsKS5cbiAqIE91dHB1dDogSVNPIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMDEuMDEnLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGVUb0lTTyA9IChcbiAgdmFsdWUsXG4gIGRhdGVGb3JtYXQgPSBudWxsLFxuICBpc1N0cmljdCA9IGZhbHNlLFxuICBkZWZhdWx0VmFsdWUgPSAnJyxcbiAgZGVmYXVsdERhdGVGb3JtYXQgPSBudWxsLFxuKSA9PiB7XG4gIGlmIChpc1N0cmljdCAmJiBtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIGlmIChkZWZhdWx0RGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFuIGlucHV0IHRvIGEgZmxvYXQgd2l0aCBmaXhlZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgdG8gZm9ybWF0IDo6IFtudW1iZXIsIHN0cmluZ10sIGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIE91dHB1dDogZm9ybWF0dGVkIHZhbHVlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMyAwMDAuMWFiYycsICcyJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMzAwMC4xMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyA9ICh2YWx1ZSwgZGVjaW1hbHMpID0+IHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4gIGxldCBmbG9hdFZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bXlxcZC4sLV0vZywgJycpXG4gICAgLnJlcGxhY2UoJywnLCAnLicpO1xuICBmbG9hdFZhbHVlID0gaXNOYU4oTnVtYmVyKGZsb2F0VmFsdWUpKSA/IDAgOiBOdW1iZXIoZmxvYXRWYWx1ZSk7XG4gIHJldHVybiBmbG9hdFZhbHVlLnRvRml4ZWQoZGVjaW1hbHMpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlLlxuICogT3V0cHV0OiByYXRlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMTAwMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyMzQ1Njc4Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEZYUmF0ZSA9IHZhbHVlID0+IE51bWJlcih2YWx1ZSkudG9GaXhlZChnZXRGWFJhdGVEZWNpbWFscyh2YWx1ZSkpO1xuIl19