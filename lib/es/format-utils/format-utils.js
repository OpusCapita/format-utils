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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsIkRFRkFVTFRfQ1VSUkVOQ1kiLCJGWFJBVEVfREVDSU1BTFMiLCJTS0lQUEVEX0RBVEVfRk9STUFUIiwiZ2V0Q3VycmVuY3lEZWNpbWFscyIsImN1cnJlbmN5IiwibnVtYmVyT3B0aW9ucyIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJnZXRGWFJhdGVEZWNpbWFscyIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwiZ2V0TG9jYWxEYXRlVGltZSIsInRpbWVzdGFtcCIsImlzb1RpbWVzdGFtcCIsInNsaWNlIiwibG9jYWxUaW1lIiwiRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0IiwidGltZVRvQ29udmVydCIsImZvcm1hdE51bWJlciIsIm9wdGlvbnMiLCJkZWNpbWFscyIsImlzVHMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImlzRHMiLCJmaXhlZE51bWJlciIsIk51bWJlciIsInRvRml4ZWQiLCJzcGxpdCIsImpvaW4iLCJmb3JtYXRDdXJyZW5jeUFtb3VudCIsImFtb3VudCIsImFtb3VudFN0ciIsInJlcGxhY2VWYWx1ZSIsIm11bHRpcGxpZXIiLCJhbW91bnRGbG9hdCIsInVuZGVmaW5lZCIsImlzTmFOIiwiZm9ybWF0RGF0ZSIsImRhdGVGb3JtYXQiLCJ1dGMiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJmb3JtYXREYXRlVG9JU08iLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyIsImZsb2F0VmFsdWUiLCJmb3JtYXRGWFJhdGUiXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBT0EsTUFBUCxNQUFtQixRQUFuQjtBQUVBLFNBQVNDLGdCQUFULEVBQTJCQyxlQUEzQixFQUE0Q0MsbUJBQTVDLFFBQXVFLDBCQUF2RTtBQUVBOzs7Ozs7Ozs7QUFRQSxPQUFPLElBQU1DLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsUUFBRCxFQUFjO0FBQy9DLE1BQU1DLGFBQWEsR0FBRztBQUNwQkQsSUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUlKLGdCQURGO0FBRXBCTSxJQUFBQSxLQUFLLEVBQUUsVUFGYTtBQUdwQkMsSUFBQUEsZUFBZSxFQUFFLE1BSEc7QUFJcEJDLElBQUFBLFdBQVcsRUFBRTtBQUpPLEdBQXRCOztBQU1BLE1BQUk7QUFDRixRQUFNQyxJQUFJLEdBQUcsSUFBSUMsSUFBSSxDQUFDQyxZQUFULENBQXNCLE9BQXRCLEVBQStCTixhQUEvQixFQUNWTyxNQURVLENBQ0gsUUFERyxFQUVWQyxPQUZVLENBRUYsVUFGRSxFQUVVLEVBRlYsQ0FBYjtBQUdBLFFBQU1DLGNBQWMsR0FBR0wsSUFBSSxDQUFDTSxNQUFMLENBQVksT0FBWixDQUF2Qjs7QUFDQSxRQUFJRCxjQUFjLEtBQUssQ0FBQyxDQUF4QixFQUEyQjtBQUN6QixhQUFPLENBQVA7QUFDRDs7QUFDRCxXQUFPTCxJQUFJLENBQUNPLE1BQUwsR0FBY0YsY0FBZCxHQUErQixDQUF0QztBQUNELEdBVEQsQ0FTRSxPQUFPRyxDQUFQLEVBQVU7QUFDVkMsSUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNGLENBQWQsRUFEVSxDQUNROztBQUNsQixXQUFPLENBQVA7QUFDRDtBQUNGLENBcEJNO0FBc0JQOzs7Ozs7OztBQU9BLE9BQU8sSUFBTUcsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQixDQUFDQyxLQUFELEVBQVc7QUFDMUMsTUFBTUMsV0FBVyxHQUFH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TixDQUFjdUIsT0FBZCxDQUFzQnhCLGlCQUFpQixDQUFDQyxLQUFELENBQXZDLENBQUo7QUFBQSxDQUExQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IHsgREVGQVVMVF9DVVJSRU5DWSwgRlhSQVRFX0RFQ0lNQUxTLCBTS0lQUEVEX0RBVEVfRk9STUFUIH0gZnJvbSAnLi9mb3JtYXQtdXRpbHMuY29uc3RhbnRzJztcblxuLyoqXG4gKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgY3VycmVuY3kuXG4gKiBJbnB1dDogY3VycmVuY3kgY29kZSA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICdFVVInLiBFeGFtcGxlIG9mIG91dHB1dDogMi5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogMC5cbiAqIERlZmF1bHRzIHRvIDIuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDdXJyZW5jeURlY2ltYWxzID0gKGN1cnJlbmN5KSA9PiB7XG4gIGNvbnN0IG51bWJlck9wdGlvbnMgPSB7XG4gICAgY3VycmVuY3k6IGN1cnJlbmN5IHx8IERFRkFVTFRfQ1VSUkVOQ1ksXG4gICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgY3VycmVuY3lEaXNwbGF5OiAnY29kZScsXG4gICAgdXNlR3JvdXBpbmc6IGZhbHNlLFxuICB9O1xuICB0cnkge1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUdCJywgbnVtYmVyT3B0aW9ucylcbiAgICAgIC5mb3JtYXQoMS4xMTExMTEpXG4gICAgICAucmVwbGFjZSgvW15cXGQuLF0vZywgJycpO1xuICAgIGNvbnN0IGZvdW5kU2VwYXJhdG9yID0gdGVzdC5zZWFyY2goL1suLF0vZyk7XG4gICAgaWYgKGZvdW5kU2VwYXJhdG9yID09PSAtMSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB0ZXN0Lmxlbmd0aCAtIGZvdW5kU2VwYXJhdG9yIC0gMTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICByZXR1cm4gMjtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlIDo6IFtudW1iZXIsIHN0cmluZ10uXG4gKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiA2LlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6IDguXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGWFJhdGVEZWNpbWFscyA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCB2YWx1ZVN0cmluZyA9IFN0cmluZyhwYXJzZUZsb2F0KFN0cmluZyh2YWx1ZSkpKTtcbiAgY29uc3QgZGVjaW1hbFNlcGFyYXRvciA9IHZhbHVlU3RyaW5nLmluZGV4T2YoJy4nKTtcbiAgY29uc3QgZGVjaW1hbE51bWJlciA9IHZhbHVlU3RyaW5nLmxlbmd0aCAtIGRlY2ltYWxTZXBhcmF0b3IgLSAxO1xuICByZXR1cm4gZGVjaW1hbFNlcGFyYXRvciA9PT0gLTEgfHwgZGVjaW1hbE51bWJlciA8PSBGWFJBVEVfREVDSU1BTFNcbiAgICA/IEZYUkFURV9ERUNJTUFMU1xuICAgIDogZGVjaW1hbE51bWJlcjtcbn07XG5cbi8qKlxuICogR2V0IGxvY2FsIGRhdGUgYW5kIHRpbWUgZnJvbSBJU08gODYwMSB0aW1lc3RhbXAuIEl0J3MgY3Jvc3MtYnJvd3NlciAoSUUgZXNwZWNpYWxseSEpLlxuICogSW5wdXQ6IFVUQyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogT3V0cHV0OiB0aW1lc3RhbXAgOjogZGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldExvY2FsRGF0ZVRpbWUgPSAodGltZXN0YW1wKSA9PiB7XG4gIGNvbnN0IGlzb1RpbWVzdGFtcCA9IHRpbWVzdGFtcCAhPT0gbnVsbCAmJiB0aW1lc3RhbXAuc2xpY2UoLTEpICE9PSAnWidcbiAgICA/IGAke3RpbWVzdGFtcH1aYFxuICAgIDogdGltZXN0YW1wO1xuICBjb25zdCBsb2NhbFRpbWUgPSBuZXcgRGF0ZShpc29UaW1lc3RhbXApIC0gbmV3IERhdGUodGltZXN0YW1wKS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICBjb25zdCB0aW1lVG9Db252ZXJ0ID0gbG9jYWxUaW1lID49IDAgPyBsb2NhbFRpbWUgOiAwO1xuICByZXR1cm4gbmV3IERhdGUodGltZVRvQ29udmVydCk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBudW1iZXIgd2l0aCBzZXBhcmF0b3JzIGFuZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgOjogW251bWJlciwgZmxvYXQsIHN0cmluZ11cbiAqIG9wdGlvbnMgOjogb2JqZWN0IChvcHRpb25hbClcbiAqICAgIGRlY2ltYWxzIDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBvdmVycmlkZXMgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiAgICB0aG91c2FuZFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgLy8gZGVmYXVsdHMgdG8gbm9uZVxuICogICAgZGVjaW1hbFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgIC8vIGRlZmF1bHRzIHRvICcuJ1xuICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCB7IGRlY2ltYWxzOiAyIH0uIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMicuXG4gKiBFeGFtcGxlIG9mIGlucHV0OlxuICogIDUwMDAsIHsgZGVjaW1hbHM6IDIsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0TnVtYmVyID0gKHZhbHVlLCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzIHx8IDA7XG4gIGNvbnN0IGlzVHMgPSB0eXBlb2Ygb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvci5sZW5ndGg7XG4gIGNvbnN0IGlzRHMgPSB0eXBlb2Ygb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IubGVuZ3RoO1xuICBjb25zdCBmaXhlZE51bWJlciA9IE51bWJlcih2YWx1ZSkudG9GaXhlZChkZWNpbWFscyk7XG4gIGlmIChpc1RzIHx8IGlzRHMpIHtcbiAgICBpZiAoZGVjaW1hbHMgPiAwKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IGZpeGVkTnVtYmVyLnNwbGl0KCcuJyk7XG4gICAgICBpZiAoaXNUcykge1xuICAgICAgICBzcGxpdFswXSA9IHNwbGl0WzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKGlzRHMpIHtcbiAgICAgICAgcmV0dXJuIHNwbGl0LmpvaW4ob3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzcGxpdC5qb2luKCcuJyk7XG4gICAgfVxuICAgIGlmIChpc1RzKSB7XG4gICAgICByZXR1cm4gZml4ZWROdW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgfVxuICB9XG4gIHJldHVybiBmaXhlZE51bWJlcjtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFtb3VudCBhY2NvcmRpbmcgdG8gaXRzIGN1cnJlbmN5LlxuICogSW5wdXQ6IGFtb3VudCA6OiBbbnVtYmVyLCBzdHJpbmddXG4gKiBvcHRpb25zIDo6IG9iamVjdCAob3B0aW9uYWwpXG4gKiAgICBjdXJyZW5jeSA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gbnVtYmVyIG9mIGRlY2ltYWxzIGJ5IGN1cnJlbmN5XG4gKiAgICBkZWNpbWFscyA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gb3ZlcnJpZGVzIG51bWJlciBvZiBkZWNpbWFsc1xuICogICAgdGhvdXNhbmRTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgIC8vIGRlZmF1bHRzIHRvIG5vbmVcbiAqICAgIGRlY2ltYWxTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgICAvLyBkZWZhdWx0cyB0byAnLidcbiAqICAgIG11bHRpcGxpZXIgOjogbnVtYmVyIChvcHRpb25hbCkgICAgICAgICAvLyBhbW91bnQgaXMgbXVsdGlwbGllZCBieSBtdWx0aXBsaWVyXG4gKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLCAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6XG4gKiAgNTAwMCwgeyBjdXJyZW5jeTogJ0VVUicsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0Q3VycmVuY3lBbW91bnQgPSAoYW1vdW50LCBvcHRpb25zID0ge30pID0+IHtcbiAgbGV0IGFtb3VudFN0ciA9IFN0cmluZyhhbW91bnQpLnJlcGxhY2UoL1xccy9nLCAnJyk7XG5cbiAgLy8gU3RyaXBzIGFsbCBjb21tYXMgT1IgcmVwbGFjZXMgYWxsIGNvbW1hcyB3aXRoIGRvdHMsIGlmIGNvbW1hIGlzbid0IHVzZWQgYXMgYSB0aG91c2FuZCBzZXBhcmF0b3JcbiAgY29uc3QgcmVwbGFjZVZhbHVlID0gKG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IgIT09ICcsJykgPyAnLicgOiAnJztcbiAgYW1vdW50U3RyID0gYW1vdW50U3RyLnJlcGxhY2UoLywvZywgcmVwbGFjZVZhbHVlKTtcbiAgY29uc3QgeyBtdWx0aXBsaWVyIH0gPSBvcHRpb25zO1xuICBjb25zdCBhbW91bnRGbG9hdCA9IG11bHRpcGxpZXIgPyBtdWx0aXBsaWVyICogcGFyc2VGbG9hdChhbW91bnRTdHIpIDogcGFyc2VGbG9hdChhbW91bnRTdHIpO1xuXG4gIGNvbnN0IGRlY2ltYWxzID0gb3B0aW9ucy5kZWNpbWFscyA9PT0gdW5kZWZpbmVkXG4gICAgPyBnZXRDdXJyZW5jeURlY2ltYWxzKG9wdGlvbnMuY3VycmVuY3kpXG4gICAgOiBvcHRpb25zLmRlY2ltYWxzO1xuICByZXR1cm4gTnVtYmVyLmlzTmFOKGFtb3VudEZsb2F0KVxuICAgID8gYW1vdW50RmxvYXRcbiAgICA6IGZvcm1hdE51bWJlcihhbW91bnRGbG9hdCwgeyAuLi5vcHRpb25zLCBkZWNpbWFscyB9KTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGRhdGUgdG8gYSBjaG9zZW4gZm9ybWF0LlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcuXG4gKiBPdXRwdXQ6IGRhdGUgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcwMS4wMS4yMDE3Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQpID0+IHtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgdHJ1ZSkuZm9ybWF0KGRhdGVGb3JtYXQpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGxvY2FsaXplZCBkYXRlIHN0cmluZyB0byBJU08gdGltZXN0YW1wLlxuICogSW5wdXQ6IGRhdGUgOjogc3RyaW5nLCBkYXRlIGZvcm1hdCA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgc2lnbiBvZiBzdHJpY3QgZGF0ZSBmb3JtYXQgOjpcbiAqIGJvb2xlYW4gKG9wdGlvbmFsKSwgZGVmYXVsdCB2YWx1ZSA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgZGVmYXVsdCBkYXRlIGZvcm1hdCA6OlxuICogc3RyaW5nIChvcHRpb25hbCkuXG4gKiBPdXRwdXQ6IElTTyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXREYXRlVG9JU08gPSAoXG4gIHZhbHVlLFxuICBkYXRlRm9ybWF0ID0gbnVsbCxcbiAgaXNTdHJpY3QgPSBmYWxzZSxcbiAgZGVmYXVsdFZhbHVlID0gJycsXG4gIGRlZmF1bHREYXRlRm9ybWF0ID0gbnVsbCxcbikgPT4ge1xuICBpZiAoaXNTdHJpY3QgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgU0tJUFBFRF9EQVRFX0ZPUk1BVCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgaWYgKGRhdGVGb3JtYXQgIT09IG51bGwgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgZGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGVmYXVsdERhdGVGb3JtYXQgIT09IG51bGwgJiYgbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhbiBpbnB1dCB0byBhIGZsb2F0IHdpdGggZml4ZWQgbnVtYmVyIG9mIGRlY2ltYWxzLlxuICogSW5wdXQ6IHZhbHVlIHRvIGZvcm1hdCA6OiBbbnVtYmVyLCBzdHJpbmddLCBkZWNpbWFscyA6OiBudW1iZXIuXG4gKiBPdXRwdXQ6IGZvcm1hdHRlZCB2YWx1ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMjMgMDAwLjFhYmMnLCAnMicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjMwMDAuMTAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RmxvYXRUb0ZpeGVkRGVjaW1hbHMgPSAodmFsdWUsIGRlY2ltYWxzKSA9PiB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xuICBsZXQgZmxvYXRWYWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICAucmVwbGFjZSgvW15cXGQuLC1dL2csICcnKVxuICAgIC5yZXBsYWNlKCcsJywgJy4nKTtcbiAgZmxvYXRWYWx1ZSA9IGlzTmFOKE51bWJlcihmbG9hdFZhbHVlKSkgPyAwIDogTnVtYmVyKGZsb2F0VmFsdWUpO1xuICByZXR1cm4gZmxvYXRWYWx1ZS50b0ZpeGVkKGRlY2ltYWxzKTtcbn07XG5cbi8qKlxuICogRm9ybWF0IEZYIHJhdGUuXG4gKiBJbnB1dDogcmF0ZS5cbiAqIE91dHB1dDogcmF0ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLjExLiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTEwMDAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMjM0NTY3OCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGWFJhdGUgPSB2YWx1ZSA9PiBOdW1iZXIodmFsdWUpLnRvRml4ZWQoZ2V0RlhSYXRlRGVjaW1hbHModmFsdWUpKTtcbiJdfQ==