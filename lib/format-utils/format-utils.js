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

  this.parseDate = function (value, dateFormat) {
    var newFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (_moment2.default.utc(value, dateFormat).isValid()) {
      return newFormat === null ? _moment2.default.utc(value, dateFormat).toISOString() : _moment2.default.utc(value, dateFormat).format(newFormat);
    } else if (_moment2.default.utc(value, _moment2.default.ISO_8601).isValid()) {
      return newFormat === null ? _moment2.default.utc(value, _moment2.default.ISO_8601).toISOString() : _moment2.default.utc(value, _moment2.default.ISO_8601).format(newFormat);
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

exports.default = new FormatUtils();