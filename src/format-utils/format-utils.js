import moment from 'moment';

class FormatUtils {

  CURRENCY_OPTIONS = { style: 'currency', currencyDisplay: 'code', useGrouping: false };
  DEFAULT_LOCALE = 'en-GB';
  FXRATE_DECIMALS = 6;
  SKIPPED_DATE_FORMAT = 'YYYY-MM';
  
  intlFormatNumber = (value, options, locale) =>
    new Intl.NumberFormat(locale, options).format(value);

  /**
   * Get a number of decimal digits for a currency.
   * Input: currency code, react-intl formatNumber function (optional), locale (optional).
   * Output: decimals :: number.
   * Example of input: 'EUR'. Example of output: 2.
   * Example of input: 'JPY'. Example of output: 0.
   */
  getCurrencyDecimals = (currency, formatNumber = null, locale = DEFAULT_LOCALE) => {
    const numberOptions = { ...CURRENCY_OPTIONS, currency };
    const numberTest = 1.111111;
    let test = formatNumber !== null ? formatNumber(numberTest, numberOptions) :
      intlFormatNumber(numberTest, numberOptions, locale);
    test = test.replace(/[^\d.,]/g, '');
    const foundSeparator = test.search(/[.,]/g);
    if (foundSeparator === -1) {
      return 0;
    }
    return test.length - foundSeparator - 1;
  }

  /**
   * Get a number of decimal digits for a FX rate.
   * Input: rate.
   * Output: decimals :: number.
   * Example of input: 1.11. Example of output: 6.
   * Example of input: 1.12345678. Example of output: 8.
   */
  getFXRateDecimals = (value) => {
    const valueString = String(parseFloat(String(value)));
    const decimalSeparator = valueString.indexOf('.');
    const decimalNumber = valueString.length - decimalSeparator - 1;
    return (decimalSeparator === -1 || decimalNumber <= FXRATE_DECIMALS) ?
      FXRATE_DECIMALS : decimalNumber;
  }

  /**
   * Get local date and time from ISO 8601 timestamp. It's cross-browser compatible (IE especially!).
    * Input: UTC timestamp.
    * Output: timestamp.
    */
  getLocalDateTime = (timestamp) => {
    const isoTimestamp = (timestamp !== null && timestamp.slice(-1) !== 'Z') ?
      `${timestamp}Z` : timestamp;
    const localTime = new Date(isoTimestamp) - new Date(timestamp).getTimezoneOffset();
    const timeToConvert = localTime >= 0 ? localTime : 0;
    return new Date(timeToConvert);
  };

  /**
   * Format amount according to its currency.
   * Input: amount, currency code, react-intl formatNumber function (optional), locale (optional).
   * Output: amount :: string.
   * Example of input: 1, 'EUR'. Example of output: '1.00'.
   * Example of input: 1.123, 'JPY'. Example of output: '1'.
   */
  formatCurrencyAmount = (value, currency, formatNumber = null, locale = DEFAULT_LOCALE) =>
    Number(value).toFixed(getCurrencyDecimals(currency, formatNumber, locale));

  /**
   * Format FX rate.
   * Input: rate.
   * Output: rate :: string.
   * Example of input: 1.11. Example of output: '1.110000'.
   * Example of input: 1.12345678. Example of output: '1.12345678'.
   */
  formatFXRate = (value) => Number(value).toFixed(getFXRateDecimals(value));

  /**
   * Format an input to a float with fixed number of decimals.
   * Input: value to format, number of decimals.
   * Output: formatted value :: string.
   * Example of input: '23 000.1abc', '2'. Example of output: '23000.10'.
   */
  formatFloatToFixedDecimals = (value, decimals) => {
    let floatValue = String(value).replace(/[^\d.,-]/g, '').replace(',', '.');
    floatValue = isNaN(Number(floatValue)) ? 0 : Number(floatValue);
    return floatValue.toFixed(decimals);
  }

  /**
   * Format ISO timestamp to a chosen format.
   * Input: ISO timestamp, date format string.
   * Output: localized date :: string.
   * Example of input: '2017-01-01T00:00:00.000Z', 'DD.MM.YYYY'. Example of output: '01.01.2017'.
   */
  formatDate = (value, dateFormat) => {
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
   * Input: localized date string, date format (optional), sign of strict date format (optional),
   * default value (optional), default date format (optional).
   * Output: ISO timestamp :: string.
   * Example of input: '01.01', 'DD.MM.YYYY'. Example of output: '2017-01-01T00:00:00.000Z'.
   */
  formatDateToISO = (value, dateFormat = null, isStrict = false, defaultValue = '', defaultDateFormat = null) => {
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
  
  parseDate = (value, dateFormat, newFormat = null) => {
    if (moment.utc(value, dateFormat).isValid()) {
      return newFormat === null ? moment.utc(value, dateFormat).toISOString() :
        moment.utc(value, dateFormat).format(newFormat);
    } else if (moment.utc(value, moment.ISO_8601).isValid()) {
      return newFormat === null ? moment.utc(value, moment.ISO_8601).toISOString() :
        moment.utc(value, moment.ISO_8601).format(newFormat);
    }
    return null;
  }

  parseFloat = (value, decimalSeparator) => {
    if (!value || String(value).length === 0) {
      return value;
    }
    return String(value).replace(decimalSeparator, '.');
  }

  parseNumber = value => (String(value).replace(/[^\d-]/g, '') || '');

}

export default new FormatUtils();
