import moment from 'moment';

class FormatUtils {

  CURRENCY_OPTIONS = { style: 'currency', currencyDisplay: 'code', useGrouping: false };
  DEFAULT_LOCALE = 'en-GB';
  FXRATE_DECIMALS = 6;
  
  intlFormatNumber = (value, options = {}) => new Intl.NumberFormat(DEFAULT_LOCALE, options).format(value);

  /**
   * Get a number of decimal digits for a currency.
   * Input: currency code, react-intl formatNumber function.
   * Output: decimals :: number.
   * Example of input: 'EUR'. Example of output: 2
   * Example of input: 'JPY'. Example of output: 0
   */
  getCurrencyDecimals = (currency, formatNumber = null) => {
    const format = formatNumber || intlFormatNumber;
    const test = format(1.111111, { ...CURRENCY_OPTIONS, currency }).replace(/[^\d.,]/g, '');
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
   * Example of input: 1.11. Example of output: 6
   * Example of input: 1.12345678. Example of output: 8
   */
  getFXRateDecimals = (value) => {
    const valueString = String(parseFloat(String(value)));
    const decimalSeparator = valueString.indexOf('.');
    const decimalNumber = valueString.length - decimalSeparator - 1;
    return (decimalSeparator === -1 || decimalNumber <= FXRATE_DECIMALS) ?
      FXRATE_DECIMALS : decimalNumber;
  }

  /**
   * Format amount according to its currency.
   * Input: amount, currency code, react-intl formatNumber function.
   * Output: amount :: string.
   * Example of input: 1, 'EUR'. Example of output: '1.00'
   * Example of input: 1.123, 'JPY'. Example of output: '1'
   */
  formatCurrencyAmount = (value, currency, formatNumber = null) =>
    Number(value).toFixed(getCurrencyDecimals(currency, formatNumber));

  /**
   * Format FX rate.
   * Input: rate.
   * Output: rate :: string.
   * Example of input: 1.11. Example of output: '1.110000'
   * Example of input: 1.12345678. Example of output: '1.12345678'
   */
  formatFXRate = (value) => Number(value).toFixed(getFXRateDecimals(value));

  formatFloatToFixedDecimals = (value, decimals) => {
    let floatValue = String(value).replace(/[^\d.,-]/g, '').replace(',', '.');
    floatValue = isNaN(Number(floatValue)) ? 0 : Number(floatValue);
    return floatValue.toFixed(decimals);
  }

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

}

export default new FormatUtils();
