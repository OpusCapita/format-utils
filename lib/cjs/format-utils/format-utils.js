"use strict";

exports.__esModule = true;
exports.formatFXRate = exports.formatFloatToFixedDecimals = exports.formatDateToISO = exports.formatDate = exports.formatCurrencyAmount = exports.formatNumber = exports.getLocalDateTime = exports.getFXRateDecimals = exports.getCurrencyDecimals = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _formatUtils = require("./format-utils.constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Hard coded currencies that has two decimal places
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

var getCurrencyDecimals = function getCurrencyDecimals(currency) {
  var numberOptions = {
    currency: currency || _formatUtils.DEFAULT_CURRENCY,
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


exports.getCurrencyDecimals = getCurrencyDecimals;

var getFXRateDecimals = function getFXRateDecimals(value) {
  var valueString = String(parseFloat(String(value)));
  var decimalSeparator = valueString.indexOf('.');
  var decimalNumber = valueString.length - decimalSeparator - 1;
  return decimalSeparator === -1 || decimalNumber <= _formatUtils.FXRATE_DECIMALS ? _formatUtils.FXRATE_DECIMALS : decimalNumber;
};
/**
 * Get local date and time from ISO 8601 timestamp. It's cross-browser (IE especially!).
 * Input: UTC timestamp :: string.
 * Output: timestamp :: date.
 */


exports.getFXRateDecimals = getFXRateDecimals;

var getLocalDateTime = function getLocalDateTime(timestamp) {
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


exports.getLocalDateTime = getLocalDateTime;

var formatNumber = function formatNumber(value, options) {
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


exports.formatNumber = formatNumber;

var formatCurrencyAmount = function formatCurrencyAmount(amount, options) {
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


exports.formatCurrencyAmount = formatCurrencyAmount;

var formatDate = function formatDate(value, dateFormat) {
  if (value === null) {
    return '';
  }

  if (_moment["default"].utc(value, _formatUtils.SKIPPED_DATE_FORMAT, true).isValid()) {
    return value;
  }

  if (_moment["default"].utc(value, _moment["default"].ISO_8601, true).isValid()) {
    return _moment["default"].utc(value, _moment["default"].ISO_8601, true).format(dateFormat);
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


exports.formatDate = formatDate;

var formatDateToISO = function formatDateToISO(value, dateFormat, isStrict, defaultValue, defaultDateFormat) {
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

  if (isStrict && _moment["default"].utc(value, _formatUtils.SKIPPED_DATE_FORMAT, isStrict).isValid()) {
    return value;
  }

  if (_moment["default"].utc(value, _moment["default"].ISO_8601, isStrict).isValid()) {
    return _moment["default"].utc(value, _moment["default"].ISO_8601, isStrict).toISOString();
  }

  if (dateFormat !== null && _moment["default"].utc(value, dateFormat, isStrict).isValid()) {
    return _moment["default"].utc(value, dateFormat, isStrict).toISOString();
  }

  if (defaultDateFormat !== null && _moment["default"].utc(value, defaultDateFormat, isStrict).isValid()) {
    return _moment["default"].utc(value, defaultDateFormat, isStrict).toISOString();
  }

  return defaultValue;
};
/**
 * Format an input to a float with fixed number of decimals.
 * Input: value to format :: [number, string], decimals :: number.
 * Output: formatted value :: string.
 * Example of input: '23 000.1abc', '2'. Example of output: '23000.10'.
 */


exports.formatDateToISO = formatDateToISO;

var formatFloatToFixedDecimals = function formatFloatToFixedDecimals(value, decimals) {
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


exports.formatFloatToFixedDecimals = formatFloatToFixedDecimals;

var formatFXRate = function formatFXRate(value) {
  return Number(value).toFixed(getFXRateDecimals(value));
};

exports.formatFXRate = formatFXRate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzIl0sIm5hbWVzIjpbIkRFQ19DT1VOVF8yIiwiREVDX0NPVU5UXzMiLCJnZXRDdXJyZW5jeURlY2ltYWxzIiwiY3VycmVuY3kiLCJudW1iZXJPcHRpb25zIiwiREVGQVVMVF9DVVJSRU5DWSIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJpbmNsdWRlcyIsInRlc3QiLCJJbnRsIiwiTnVtYmVyRm9ybWF0IiwiZm9ybWF0IiwicmVwbGFjZSIsImZvdW5kU2VwYXJhdG9yIiwic2VhcmNoIiwibGVuZ3RoIiwiZSIsImdldEZYUmF0ZURlY2ltYWxzIiwidmFsdWUiLCJ2YWx1ZVN0cmluZyIsIlN0cmluZyIsInBhcnNlRmxvYXQiLCJkZWNpbWFsU2VwYXJhdG9yIiwiaW5kZXhPZiIsImRlY2ltYWxOdW1iZXIiLCJGWFJBVEVfREVDSU1BTFMiLCJnZXRMb2NhbERhdGVUaW1lIiwidGltZXN0YW1wIiwiaXNvVGltZXN0YW1wIiwic2xpY2UiLCJsb2NhbFRpbWUiLCJEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ0aW1lVG9Db252ZXJ0IiwiZm9ybWF0TnVtYmVyIiwib3B0aW9ucyIsImRlY2ltYWxzIiwiaXNUcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiaXNEcyIsImZpeGVkTnVtYmVyIiwiTnVtYmVyIiwidG9GaXhlZCIsInNwbGl0Iiwiam9pbiIsImZvcm1hdEN1cnJlbmN5QW1vdW50IiwiYW1vdW50IiwiYW1vdW50U3RyIiwicmVwbGFjZVZhbHVlIiwibXVsdGlwbGllciIsImFtb3VudEZsb2F0IiwidW5kZWZpbmVkIiwiaXNOYU4iLCJmb3JtYXREYXRlIiwiZGF0ZUZvcm1hdCIsIm1vbWVudCIsInV0YyIsIlNLSVBQRURfREFURV9GT1JNQVQiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJmb3JtYXREYXRlVG9JU08iLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyIsImZsb2F0VmFsdWUiLCJmb3JtYXRGWFJhdGUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0FBRUE7Ozs7OztBQUVBO0FBQ0E7QUFDQSxJQUFNQSxXQUFXLEdBQUcsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsS0FBN0IsRUFBb0MsS0FBcEMsRUFBMkMsS0FBM0MsRUFBa0QsS0FBbEQsRUFBeUQsS0FBekQsRUFBZ0UsS0FBaEUsRUFBdUUsS0FBdkUsRUFBOEUsS0FBOUUsQ0FBcEIsQyxDQUEwRzs7QUFDMUcsSUFBTUMsV0FBVyxHQUFHLENBQUMsS0FBRCxDQUFwQjtBQUVBOzs7Ozs7Ozs7QUFRTyxJQUFNQyxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCLENBQUNDLFFBQUQsRUFBYztBQUMvQyxNQUFNQyxhQUFhLEdBQUc7QUFDcEJELElBQUFBLFFBQVEsRUFBRUEsUUFBUSxJQUFJRSw2QkFERjtBQUVwQkMsSUFBQUEsS0FBSyxFQUFFLFVBRmE7QUFHcEJDLElBQUFBLGVBQWUsRUFBRSxNQUhHO0FBSXBCQyxJQUFBQSxXQUFXLEVBQUU7QUFKTyxHQUF0QixDQUQrQyxDQU8vQzs7QUFDQSxNQUFJUixXQUFXLENBQUNTLFFBQVosQ0FBcUJOLFFBQXJCLENBQUosRUFBb0M7QUFDbEMsV0FBTyxDQUFQO0FBQ0Q7O0FBQ0QsTUFBSUYsV0FBVyxDQUFDUSxRQUFaLENBQXFCTixRQUFyQixDQUFKLEVBQW9DO0FBQ2xDLFdBQU8sQ0FBUDtBQUNEOztBQUNELE1BQUk7QUFDRixRQUFNTyxJQUFJLEdBQUcsSUFBSUMsSUFBSSxDQUFDQyxZQUFULENBQXNCLE9BQXRCLEVBQStCUixhQUEvQixFQUNWUyxNQURVLENBQ0gsUUFERyxFQUVWQyxPQUZVLENBRUYsVUFGRSxFQUVVLEVBRlYsQ0FBYjtBQUdBLFFBQU1DLGNBQWMsR0FBR0wsSUFBSSxDQUFDTSxNQUFMLENBQVksT0FBWixDQUF2Qjs7QUFDQSxRQUFJRCxjQUFjLEtBQUssQ0FBQyxDQUF4QixFQUEyQjtBQUN6QixhQUFPLENBQVA7QUFDRDs7QUFDRCxXQUFPTCxJQUFJLENBQUNPLE1BQUwsR0FBY0YsY0FBZCxHQUErQixDQUF0QztBQUNELEdBVEQsQ0FTRSxPQUFPRyxDQUFQLEVBQVU7QUFDVjtBQUNBLFdBQU8sQ0FBUDtBQUNEO0FBQ0YsQ0EzQk07QUE2QlA7Ozs7Ozs7Ozs7O0FBT08sSUFBTUMsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQixDQUFDQyxLQUFELEVBQVc7QUFDMUMsTUFBTUMsV0FBVyxHQUFHQyxNQUFNLENBQUNDLFVBQVUsQ0FBQ0QsTUFBTSxDQUFDRixLQUFELENBQVAsQ0FBWCxDQUExQjtBQUNBLE1BQU1JLGdCQUFnQixHQUFHSCxXQUFXLENBQUNJLE9BQVosQ0FBb0IsR0FBcEIsQ0FBekI7QUFDQSxNQUFNQyxhQUFhLEdBQUdMLFdBQVcsQ0FBQ0osTUFBWixHQUFxQk8sZ0JBQXJCLEdBQXdDLENBQTlEO0FBQ0EsU0FBT0EsZ0JBQWdCLEtBQUssQ0FBQyxDQUF0QixJQUEyQkUsYUFBYSxJQUFJQyw0QkFBNUMsR0FDSEEsNEJBREcsR0FFSEQsYUFGSjtBQUdELENBUE07QUFTUDs7Ozs7Ozs7O0FBS08sSUFBTUUsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQixDQUFDQyxTQUFELEVBQWU7QUFDN0MsTUFBTUMsWUFBWSxHQUFHRCxTQUFTLEtBQUssSUFBZCxJQUFzQkEsU0FBUyxDQUFDRSxLQUFWLENBQWdCLENBQUMsQ0FBakIsTUFBd0IsR0FBOUMsR0FDZEYsU0FEYyxTQUVqQkEsU0FGSjtBQUdBLE1BQU1HLFNBQVMsR0FBRyxJQUFJQyxJQUFKLENBQVNILFlBQVQsSUFBeUIsSUFBSUcsSUFBSixDQUFTSixTQUFULEVBQW9CSyxpQkFBcEIsRUFBM0M7QUFDQSxNQUFNQyxhQUFhLEdBQUdILFNBQVMsSUFBSSxDQUFiLEdBQWlCQSxTQUFqQixHQUE2QixDQUFuRDtBQUNBLFNBQU8sSUFBSUMsSUFBSixDQUFTRSxhQUFULENBQVA7QUFDRCxDQVBNO0FBU1A7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNPLElBQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUNoQixLQUFELEVBQVFpQixPQUFSLEVBQXlCO0FBQUEsTUFBakJBLE9BQWlCO0FBQWpCQSxJQUFBQSxPQUFpQixHQUFQLEVBQU87QUFBQTs7QUFDbkQsTUFBTUMsUUFBUSxHQUFHRCxPQUFPLENBQUNDLFFBQVIsSUFBb0IsQ0FBckM7QUFDQSxNQUFNQyxJQUFJLEdBQUcsT0FBT0YsT0FBTyxDQUFDRyxpQkFBZixLQUFxQyxRQUFyQyxJQUFpREgsT0FBTyxDQUFDRyxpQkFBUixDQUEwQnZCLE1BQXhGO0FBQ0EsTUFBTXdCLElBQUksR0FBRyxPQUFPSixPQUFPLENBQUNiLGdCQUFmLEtBQW9DLFFBQXBDLElBQWdEYSxPQUFPLENBQUNiLGdCQUFSLENBQXlCUCxNQUF0RjtBQUNBLE1BQU15QixXQUFXLEdBQUdDLE1BQU0sQ0FBQ3ZCLEtBQUQsQ0FBTixDQUFjd0IsT0FBZCxDQUFzQk4sUUFBdEIsQ0FBcEI7O0FBQ0EsTUFBSUMsSUFBSSxJQUFJRSxJQUFaLEVBQWtCO0FBQ2hCLFFBQUlILFFBQVEsR0FBRyxDQUFmLEVBQWtCO0FBQ2hCLFVBQU1PLEtBQUssR0FBR0gsV0FBVyxDQUFDRyxLQUFaLENBQWtCLEdBQWxCLENBQWQ7O0FBQ0EsVUFBSU4sSUFBSixFQUFVO0FBQ1JNLFFBQUFBLEtBQUssQ0FBQyxDQUFELENBQUwsR0FBV0EsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTL0IsT0FBVCxDQUFpQix1QkFBakIsRUFBMEN1QixPQUFPLENBQUNHLGlCQUFsRCxDQUFYO0FBQ0Q7O0FBQ0QsVUFBSUMsSUFBSixFQUFVO0FBQ1IsZUFBT0ksS0FBSyxDQUFDQyxJQUFOLENBQVdULE9BQU8sQ0FBQ2IsZ0JBQW5CLENBQVA7QUFDRDs7QUFDRCxhQUFPcUIsS0FBSyxDQUFDQyxJQUFOLENBQVcsR0FBWCxDQUFQO0FBQ0Q7O0FBQ0QsUUFBSVAsSUFBSixFQUFVO0FBQ1IsYUFBT0csV0FBVyxDQUFDNUIsT0FBWixDQUFvQix1QkFBcEIsRUFBNkN1QixPQUFPLENBQUNHLGlCQUFyRCxDQUFQO0FBQ0Q7QUFDRjs7QUFDRCxTQUFPRSxXQUFQO0FBQ0QsQ0FyQk07QUF1QlA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JPLElBQU1LLG9CQUFvQixHQUFHLFNBQXZCQSxvQkFBdUIsQ0FBQ0MsTUFBRCxFQUFTWCxPQUFULEVBQTBCO0FBQUEsTUFBakJBLE9BQWlCO0FBQWpCQSxJQUFBQSxPQUFpQixHQUFQLEVBQU87QUFBQTs7QUFDNUQsTUFBSVksU0FBUyxHQUFHM0IsTUFBTSxDQUFDMEIsTUFBRCxDQUFOLENBQWVsQyxPQUFmLENBQXVCLEtBQXZCLEVBQThCLEVBQTlCLENBQWhCLENBRDRELENBRzVEOztBQUNBLE1BQU1vQyxZQUFZLEdBQUliLE9BQU8sQ0FBQ0csaUJBQVIsS0FBOEIsR0FBL0IsR0FBc0MsR0FBdEMsR0FBNEMsRUFBakU7QUFDQVMsRUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNuQyxPQUFWLENBQWtCLElBQWxCLEVBQXdCb0MsWUFBeEIsQ0FBWjtBQUw0RCxpQkFPckNiLE9BUHFDO0FBQUEsTUFPcERjLFVBUG9ELFlBT3BEQSxVQVBvRDtBQVE1RCxNQUFNQyxXQUFXLEdBQUdELFVBQVUsR0FBR0EsVUFBVSxHQUFHNUIsVUFBVSxDQUFDMEIsU0FBRCxDQUExQixHQUF3QzFCLFVBQVUsQ0FBQzBCLFNBQUQsQ0FBaEY7QUFFQSxNQUFNWCxRQUFRLEdBQUdELE9BQU8sQ0FBQ0MsUUFBUixLQUFxQmUsU0FBckIsR0FDYm5ELG1CQUFtQixDQUFDbUMsT0FBTyxDQUFDbEMsUUFBVCxDQUROLEdBRWJrQyxPQUFPLENBQUNDLFFBRlo7QUFHQSxTQUFPSyxNQUFNLENBQUNXLEtBQVAsQ0FBYUYsV0FBYixJQUNIQSxXQURHLEdBRUhoQixZQUFZLENBQUNnQixXQUFELGVBQW1CZixPQUFuQjtBQUE0QkMsSUFBQUEsUUFBUSxFQUFSQTtBQUE1QixLQUZoQjtBQUdELENBaEJNO0FBa0JQOzs7Ozs7Ozs7O0FBTU8sSUFBTWlCLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQUNuQyxLQUFELEVBQVFvQyxVQUFSLEVBQXVCO0FBQy9DLE1BQUlwQyxLQUFLLEtBQUssSUFBZCxFQUFvQjtBQUNsQixXQUFPLEVBQVA7QUFDRDs7QUFDRCxNQUFJcUMsbUJBQU9DLEdBQVAsQ0FBV3RDLEtBQVgsRUFBa0J1QyxnQ0FBbEIsRUFBdUMsSUFBdkMsRUFBNkNDLE9BQTdDLEVBQUosRUFBNEQ7QUFDMUQsV0FBT3hDLEtBQVA7QUFDRDs7QUFDRCxNQUFJcUMsbUJBQU9DLEdBQVAsQ0FBV3RDLEtBQVgsRUFBa0JxQyxtQkFBT0ksUUFBekIsRUFBbUMsSUFBbkMsRUFBeUNELE9BQXpDLEVBQUosRUFBd0Q7QUFDdEQsV0FBT0gsbUJBQU9DLEdBQVAsQ0FBV3RDLEtBQVgsRUFBa0JxQyxtQkFBT0ksUUFBekIsRUFBbUMsSUFBbkMsRUFBeUNoRCxNQUF6QyxDQUFnRDJDLFVBQWhELENBQVA7QUFDRDs7QUFDRCxTQUFPcEMsS0FBUDtBQUNELENBWE07QUFhUDs7Ozs7Ozs7Ozs7O0FBUU8sSUFBTTBDLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FDN0IxQyxLQUQ2QixFQUU3Qm9DLFVBRjZCLEVBRzdCTyxRQUg2QixFQUk3QkMsWUFKNkIsRUFLN0JDLGlCQUw2QixFQU0xQjtBQUFBLE1BSkhULFVBSUc7QUFKSEEsSUFBQUEsVUFJRyxHQUpVLElBSVY7QUFBQTs7QUFBQSxNQUhITyxRQUdHO0FBSEhBLElBQUFBLFFBR0csR0FIUSxLQUdSO0FBQUE7O0FBQUEsTUFGSEMsWUFFRztBQUZIQSxJQUFBQSxZQUVHLEdBRlksRUFFWjtBQUFBOztBQUFBLE1BREhDLGlCQUNHO0FBREhBLElBQUFBLGlCQUNHLEdBRGlCLElBQ2pCO0FBQUE7O0FBQ0gsTUFBSUYsUUFBUSxJQUFJTixtQkFBT0MsR0FBUCxDQUFXdEMsS0FBWCxFQUFrQnVDLGdDQUFsQixFQUF1Q0ksUUFBdkMsRUFBaURILE9BQWpELEVBQWhCLEVBQTRFO0FBQzFFLFdBQU94QyxLQUFQO0FBQ0Q7O0FBQ0QsTUFBSXFDLG1CQUFPQyxHQUFQLENBQVd0QyxLQUFYLEVBQWtCcUMsbUJBQU9JLFFBQXpCLEVBQW1DRSxRQUFuQyxFQUE2Q0gsT0FBN0MsRUFBSixFQUE0RDtBQUMxRCxXQUFPSCxtQkFBT0MsR0FBUCxDQUFXdEMsS0FBWCxFQUFrQnFDLG1CQUFPSSxRQUF6QixFQUFtQ0UsUUFBbkMsRUFBNkNHLFdBQTdDLEVBQVA7QUFDRDs7QUFDRCxNQUFJVixVQUFVLEtBQUssSUFBZixJQUF1QkMsbUJBQU9DLEdBQVAsQ0FBV3RDLEtBQVgsRUFBa0JvQyxVQUFsQixFQUE4Qk8sUUFBOUIsRUFBd0NILE9BQXhDLEVBQTNCLEVBQThFO0FBQzVFLFdBQU9ILG1CQUFPQyxHQUFQLENBQVd0QyxLQUFYLEVBQWtCb0MsVUFBbEIsRUFBOEJPLFFBQTlCLEVBQXdDRyxXQUF4QyxFQUFQO0FBQ0Q7O0FBQ0QsTUFBSUQsaUJBQWlCLEtBQUssSUFBdEIsSUFBOEJSLG1CQUFPQyxHQUFQLENBQVd0QyxLQUFYLEVBQWtCNkMsaUJBQWxCLEVBQXFDRixRQUFyQyxFQUErQ0gsT0FBL0MsRUFBbEMsRUFBNEY7QUFDMUYsV0FBT0gsbUJBQU9DLEdBQVAsQ0FBV3RDLEtBQVgsRUFBa0I2QyxpQkFBbEIsRUFBcUNGLFFBQXJDLEVBQStDRyxXQUEvQyxFQUFQO0FBQ0Q7O0FBQ0QsU0FBT0YsWUFBUDtBQUNELENBcEJNO0FBc0JQOzs7Ozs7Ozs7O0FBTU8sSUFBTUcsMEJBQTBCLEdBQUcsU0FBN0JBLDBCQUE2QixDQUFDL0MsS0FBRCxFQUFRa0IsUUFBUixFQUFxQjtBQUM3RDtBQUNBLE1BQUk4QixVQUFVLEdBQUc5QyxNQUFNLENBQUNGLEtBQUQsQ0FBTixDQUNkTixPQURjLENBQ04sV0FETSxFQUNPLEVBRFAsRUFFZEEsT0FGYyxDQUVOLEdBRk0sRUFFRCxHQUZDLENBQWpCO0FBR0FzRCxFQUFBQSxVQUFVLEdBQUdkLEtBQUssQ0FBQ1gsTUFBTSxDQUFDeUIsVUFBRCxDQUFQLENBQUwsR0FBNEIsQ0FBNUIsR0FBZ0N6QixNQUFNLENBQUN5QixVQUFELENBQW5EO0FBQ0EsU0FBT0EsVUFBVSxDQUFDeEIsT0FBWCxDQUFtQk4sUUFBbkIsQ0FBUDtBQUNELENBUE07QUFTUDs7Ozs7Ozs7Ozs7QUFPTyxJQUFNK0IsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ2pELEtBQUQ7QUFBQSxTQUFXdUIsTUFBTSxDQUFDdkIsS0FBRCxDQUFOLENBQWN3QixPQUFkLENBQXNCekIsaUJBQWlCLENBQUNDLEtBQUQsQ0FBdkMsQ0FBWDtBQUFBLENBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQgeyBERUZBVUxUX0NVUlJFTkNZLCBGWFJBVEVfREVDSU1BTFMsIFNLSVBQRURfREFURV9GT1JNQVQgfSBmcm9tICcuL2Zvcm1hdC11dGlscy5jb25zdGFudHMnO1xuXG4vLyBIYXJkIGNvZGVkIGN1cnJlbmNpZXMgdGhhdCBoYXMgdHdvIGRlY2ltYWwgcGxhY2VzXG4vLyBGaXggYnVnIGluIENocm9tZSB0aGF0IGZhaWxzIHRvIGNvdW50IGRlY2ltYWxzIGZvciB0aGVzZSBjdXJyZW5jaWVzXG5jb25zdCBERUNfQ09VTlRfMiA9IFsnQUZOJywgJ0FMTCcsICdJUlInLCAnS1BXJywgJ0xBSycsICdMQlAnLCAnTUdBJywgJ01NSycsICdSU0QnLCAnU0xMJywgJ1NPUycsICdTWVAnXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuY29uc3QgREVDX0NPVU5UXzMgPSBbJ0lRRCddO1xuXG4vKipcbiAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBjdXJyZW5jeS5cbiAqIElucHV0OiBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGVjaW1hbHMgOjogbnVtYmVyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAyLlxuICogRXhhbXBsZSBvZiBpbnB1dDogJ0pQWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAwLlxuICogRGVmYXVsdHMgdG8gMi5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEN1cnJlbmN5RGVjaW1hbHMgPSAoY3VycmVuY3kpID0+IHtcbiAgY29uc3QgbnVtYmVyT3B0aW9ucyA9IHtcbiAgICBjdXJyZW5jeTogY3VycmVuY3kgfHwgREVGQVVMVF9DVVJSRU5DWSxcbiAgICBzdHlsZTogJ2N1cnJlbmN5JyxcbiAgICBjdXJyZW5jeURpc3BsYXk6ICdjb2RlJyxcbiAgICB1c2VHcm91cGluZzogZmFsc2UsXG4gIH07XG4gIC8vIEhhcmQgY29kZXMgZGVjaW1hbCBjb3VudHNcbiAgaWYgKERFQ19DT1VOVF8yLmluY2x1ZGVzKGN1cnJlbmN5KSkge1xuICAgIHJldHVybiAyO1xuICB9XG4gIGlmIChERUNfQ09VTlRfMy5pbmNsdWRlcyhjdXJyZW5jeSkpIHtcbiAgICByZXR1cm4gMztcbiAgfVxuICB0cnkge1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUdCJywgbnVtYmVyT3B0aW9ucylcbiAgICAgIC5mb3JtYXQoMS4xMTExMTEpXG4gICAgICAucmVwbGFjZSgvW15cXGQuLF0vZywgJycpO1xuICAgIGNvbnN0IGZvdW5kU2VwYXJhdG9yID0gdGVzdC5zZWFyY2goL1suLF0vZyk7XG4gICAgaWYgKGZvdW5kU2VwYXJhdG9yID09PSAtMSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB0ZXN0Lmxlbmd0aCAtIGZvdW5kU2VwYXJhdG9yIC0gMTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIEluIGFueSBlcnJvciBjYXNlLCByZXR1cm4gMiBkZWNpbWFscy5cbiAgICByZXR1cm4gMjtcbiAgfVxufTtcblxuLyoqXG4gKiBHZXQgYSBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgZm9yIGEgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlIDo6IFtudW1iZXIsIHN0cmluZ10uXG4gKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiA2LlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6IDguXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGWFJhdGVEZWNpbWFscyA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCB2YWx1ZVN0cmluZyA9IFN0cmluZyhwYXJzZUZsb2F0KFN0cmluZyh2YWx1ZSkpKTtcbiAgY29uc3QgZGVjaW1hbFNlcGFyYXRvciA9IHZhbHVlU3RyaW5nLmluZGV4T2YoJy4nKTtcbiAgY29uc3QgZGVjaW1hbE51bWJlciA9IHZhbHVlU3RyaW5nLmxlbmd0aCAtIGRlY2ltYWxTZXBhcmF0b3IgLSAxO1xuICByZXR1cm4gZGVjaW1hbFNlcGFyYXRvciA9PT0gLTEgfHwgZGVjaW1hbE51bWJlciA8PSBGWFJBVEVfREVDSU1BTFNcbiAgICA/IEZYUkFURV9ERUNJTUFMU1xuICAgIDogZGVjaW1hbE51bWJlcjtcbn07XG5cbi8qKlxuICogR2V0IGxvY2FsIGRhdGUgYW5kIHRpbWUgZnJvbSBJU08gODYwMSB0aW1lc3RhbXAuIEl0J3MgY3Jvc3MtYnJvd3NlciAoSUUgZXNwZWNpYWxseSEpLlxuICogSW5wdXQ6IFVUQyB0aW1lc3RhbXAgOjogc3RyaW5nLlxuICogT3V0cHV0OiB0aW1lc3RhbXAgOjogZGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldExvY2FsRGF0ZVRpbWUgPSAodGltZXN0YW1wKSA9PiB7XG4gIGNvbnN0IGlzb1RpbWVzdGFtcCA9IHRpbWVzdGFtcCAhPT0gbnVsbCAmJiB0aW1lc3RhbXAuc2xpY2UoLTEpICE9PSAnWidcbiAgICA/IGAke3RpbWVzdGFtcH1aYFxuICAgIDogdGltZXN0YW1wO1xuICBjb25zdCBsb2NhbFRpbWUgPSBuZXcgRGF0ZShpc29UaW1lc3RhbXApIC0gbmV3IERhdGUodGltZXN0YW1wKS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICBjb25zdCB0aW1lVG9Db252ZXJ0ID0gbG9jYWxUaW1lID49IDAgPyBsb2NhbFRpbWUgOiAwO1xuICByZXR1cm4gbmV3IERhdGUodGltZVRvQ29udmVydCk7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBudW1iZXIgd2l0aCBzZXBhcmF0b3JzIGFuZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgOjogW251bWJlciwgZmxvYXQsIHN0cmluZ11cbiAqIG9wdGlvbnMgOjogb2JqZWN0IChvcHRpb25hbClcbiAqICAgIGRlY2ltYWxzIDo6IHN0cmluZyAob3B0aW9uYWwpICAgICAgICAgICAvLyBvdmVycmlkZXMgbnVtYmVyIG9mIGRlY2ltYWxzXG4gKiAgICB0aG91c2FuZFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgLy8gZGVmYXVsdHMgdG8gbm9uZVxuICogICAgZGVjaW1hbFNlcGFyYXRvciA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgIC8vIGRlZmF1bHRzIHRvICcuJ1xuICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCB7IGRlY2ltYWxzOiAyIH0uIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMicuXG4gKiBFeGFtcGxlIG9mIGlucHV0OlxuICogIDUwMDAsIHsgZGVjaW1hbHM6IDIsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0TnVtYmVyID0gKHZhbHVlLCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzIHx8IDA7XG4gIGNvbnN0IGlzVHMgPSB0eXBlb2Ygb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvci5sZW5ndGg7XG4gIGNvbnN0IGlzRHMgPSB0eXBlb2Ygb3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLmRlY2ltYWxTZXBhcmF0b3IubGVuZ3RoO1xuICBjb25zdCBmaXhlZE51bWJlciA9IE51bWJlcih2YWx1ZSkudG9GaXhlZChkZWNpbWFscyk7XG4gIGlmIChpc1RzIHx8IGlzRHMpIHtcbiAgICBpZiAoZGVjaW1hbHMgPiAwKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IGZpeGVkTnVtYmVyLnNwbGl0KCcuJyk7XG4gICAgICBpZiAoaXNUcykge1xuICAgICAgICBzcGxpdFswXSA9IHNwbGl0WzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKGlzRHMpIHtcbiAgICAgICAgcmV0dXJuIHNwbGl0LmpvaW4ob3B0aW9ucy5kZWNpbWFsU2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzcGxpdC5qb2luKCcuJyk7XG4gICAgfVxuICAgIGlmIChpc1RzKSB7XG4gICAgICByZXR1cm4gZml4ZWROdW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgb3B0aW9ucy50aG91c2FuZFNlcGFyYXRvcik7XG4gICAgfVxuICB9XG4gIHJldHVybiBmaXhlZE51bWJlcjtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFtb3VudCBhY2NvcmRpbmcgdG8gaXRzIGN1cnJlbmN5LlxuICogSW5wdXQ6IGFtb3VudCA6OiBbbnVtYmVyLCBzdHJpbmddXG4gKiBvcHRpb25zIDo6IG9iamVjdCAob3B0aW9uYWwpXG4gKiAgICBjdXJyZW5jeSA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gbnVtYmVyIG9mIGRlY2ltYWxzIGJ5IGN1cnJlbmN5XG4gKiAgICBkZWNpbWFscyA6OiBzdHJpbmcgKG9wdGlvbmFsKSAgICAgICAgICAgLy8gb3ZlcnJpZGVzIG51bWJlciBvZiBkZWNpbWFsc1xuICogICAgdGhvdXNhbmRTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgIC8vIGRlZmF1bHRzIHRvIG5vbmVcbiAqICAgIGRlY2ltYWxTZXBhcmF0b3IgOjogc3RyaW5nIChvcHRpb25hbCkgICAvLyBkZWZhdWx0cyB0byAnLidcbiAqICAgIG11bHRpcGxpZXIgOjogbnVtYmVyIChvcHRpb25hbCkgICAgICAgICAvLyBhbW91bnQgaXMgbXVsdGlwbGllZCBieSBtdWx0aXBsaWVyXG4gKiBPdXRwdXQ6IGFtb3VudCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAxLCAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjAwJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzLCAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxJy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6XG4gKiAgNTAwMCwgeyBjdXJyZW5jeTogJ0VVUicsIHRob3VzYW5kU2VwYXJhdG9yOiAnLCcsIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyB9XG4gKiAgb3V0cHV0OiAnNSwwMDAuMDAnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0Q3VycmVuY3lBbW91bnQgPSAoYW1vdW50LCBvcHRpb25zID0ge30pID0+IHtcbiAgbGV0IGFtb3VudFN0ciA9IFN0cmluZyhhbW91bnQpLnJlcGxhY2UoL1xccy9nLCAnJyk7XG5cbiAgLy8gU3RyaXBzIGFsbCBjb21tYXMgT1IgcmVwbGFjZXMgYWxsIGNvbW1hcyB3aXRoIGRvdHMsIGlmIGNvbW1hIGlzbid0IHVzZWQgYXMgYSB0aG91c2FuZCBzZXBhcmF0b3JcbiAgY29uc3QgcmVwbGFjZVZhbHVlID0gKG9wdGlvbnMudGhvdXNhbmRTZXBhcmF0b3IgIT09ICcsJykgPyAnLicgOiAnJztcbiAgYW1vdW50U3RyID0gYW1vdW50U3RyLnJlcGxhY2UoLywvZywgcmVwbGFjZVZhbHVlKTtcblxuICBjb25zdCB7IG11bHRpcGxpZXIgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IGFtb3VudEZsb2F0ID0gbXVsdGlwbGllciA/IG11bHRpcGxpZXIgKiBwYXJzZUZsb2F0KGFtb3VudFN0cikgOiBwYXJzZUZsb2F0KGFtb3VudFN0cik7XG5cbiAgY29uc3QgZGVjaW1hbHMgPSBvcHRpb25zLmRlY2ltYWxzID09PSB1bmRlZmluZWRcbiAgICA/IGdldEN1cnJlbmN5RGVjaW1hbHMob3B0aW9ucy5jdXJyZW5jeSlcbiAgICA6IG9wdGlvbnMuZGVjaW1hbHM7XG4gIHJldHVybiBOdW1iZXIuaXNOYU4oYW1vdW50RmxvYXQpXG4gICAgPyBhbW91bnRGbG9hdFxuICAgIDogZm9ybWF0TnVtYmVyKGFtb3VudEZsb2F0LCB7IC4uLm9wdGlvbnMsIGRlY2ltYWxzIH0pO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgZGF0ZSB0byBhIGNob3NlbiBmb3JtYXQuXG4gKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZy5cbiAqIE91dHB1dDogZGF0ZSA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzAxLjAxLjIwMTcnLlxuICovXG5leHBvcnQgY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSwgZGF0ZUZvcm1hdCkgPT4ge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5mb3JtYXQoZGF0ZUZvcm1hdCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgbG9jYWxpemVkIGRhdGUgc3RyaW5nIHRvIElTTyB0aW1lc3RhbXAuXG4gKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZyAob3B0aW9uYWwpLCBzaWduIG9mIHN0cmljdCBkYXRlIGZvcm1hdCA6OlxuICogYm9vbGVhbiAob3B0aW9uYWwpLCBkZWZhdWx0IHZhbHVlIDo6IHN0cmluZyAob3B0aW9uYWwpLCBkZWZhdWx0IGRhdGUgZm9ybWF0IDo6XG4gKiBzdHJpbmcgKG9wdGlvbmFsKS5cbiAqIE91dHB1dDogSVNPIHRpbWVzdGFtcCA6OiBzdHJpbmcuXG4gKiBFeGFtcGxlIG9mIGlucHV0OiAnMDEuMDEnLCAnREQuTU0uWVlZWScuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMjAxNy0wMS0wMVQwMDowMDowMC4wMDBaJy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdERhdGVUb0lTTyA9IChcbiAgdmFsdWUsXG4gIGRhdGVGb3JtYXQgPSBudWxsLFxuICBpc1N0cmljdCA9IGZhbHNlLFxuICBkZWZhdWx0VmFsdWUgPSAnJyxcbiAgZGVmYXVsdERhdGVGb3JtYXQgPSBudWxsLFxuKSA9PiB7XG4gIGlmIChpc1N0cmljdCAmJiBtb21lbnQudXRjKHZhbHVlLCBTS0lQUEVEX0RBVEVfRk9STUFULCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgfVxuICBpZiAoZGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICB9XG4gIGlmIChkZWZhdWx0RGF0ZUZvcm1hdCAhPT0gbnVsbCAmJiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkZWZhdWx0RGF0ZUZvcm1hdCwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn07XG5cbi8qKlxuICogRm9ybWF0IGFuIGlucHV0IHRvIGEgZmxvYXQgd2l0aCBmaXhlZCBudW1iZXIgb2YgZGVjaW1hbHMuXG4gKiBJbnB1dDogdmFsdWUgdG8gZm9ybWF0IDo6IFtudW1iZXIsIHN0cmluZ10sIGRlY2ltYWxzIDo6IG51bWJlci5cbiAqIE91dHB1dDogZm9ybWF0dGVkIHZhbHVlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6ICcyMyAwMDAuMWFiYycsICcyJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcyMzAwMC4xMCcuXG4gKi9cbmV4cG9ydCBjb25zdCBmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyA9ICh2YWx1ZSwgZGVjaW1hbHMpID0+IHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovXG4gIGxldCBmbG9hdFZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIC5yZXBsYWNlKC9bXlxcZC4sLV0vZywgJycpXG4gICAgLnJlcGxhY2UoJywnLCAnLicpO1xuICBmbG9hdFZhbHVlID0gaXNOYU4oTnVtYmVyKGZsb2F0VmFsdWUpKSA/IDAgOiBOdW1iZXIoZmxvYXRWYWx1ZSk7XG4gIHJldHVybiBmbG9hdFZhbHVlLnRvRml4ZWQoZGVjaW1hbHMpO1xufTtcblxuLyoqXG4gKiBGb3JtYXQgRlggcmF0ZS5cbiAqIElucHV0OiByYXRlLlxuICogT3V0cHV0OiByYXRlIDo6IHN0cmluZy5cbiAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMTAwMDAnLlxuICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjM0NTY3OC4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjEyMzQ1Njc4Jy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZvcm1hdEZYUmF0ZSA9ICh2YWx1ZSkgPT4gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKGdldEZYUmF0ZURlY2ltYWxzKHZhbHVlKSk7XG4iXX0=