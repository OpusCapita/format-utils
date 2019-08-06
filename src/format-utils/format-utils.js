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
export const getCurrencyDecimals = (currency) => {
  const numberOptions = {
    currency: currency || DEFAULT_CURRENCY,
    style: 'currency',
    currencyDisplay: 'code',
    useGrouping: false,
  };
  try {
    const test = new Intl.NumberFormat('en-GB', numberOptions)
      .format(1.111111)
      .replace(/[^\d.,]/g, '');
    const foundSeparator = test.search(/[.,]/g);
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
export const getFXRateDecimals = (value) => {
  const valueString = String(parseFloat(String(value)));
  const decimalSeparator = valueString.indexOf('.');
  const decimalNumber = valueString.length - decimalSeparator - 1;
  return decimalSeparator === -1 || decimalNumber <= FXRATE_DECIMALS
    ? FXRATE_DECIMALS
    : decimalNumber;
};

/**
 * Get local date and time from ISO 8601 timestamp. It's cross-browser (IE especially!).
 * Input: UTC timestamp :: string.
 * Output: timestamp :: date.
 */
export const getLocalDateTime = (timestamp) => {
  const isoTimestamp = timestamp !== null && timestamp.slice(-1) !== 'Z'
    ? `${timestamp}Z`
    : timestamp;
  const localTime = new Date(isoTimestamp) - new Date(timestamp).getTimezoneOffset();
  const timeToConvert = localTime >= 0 ? localTime : 0;
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
export const formatNumber = (value, options = {}) => {
  const decimals = options.decimals || 0;
  const isTs = typeof options.thousandSeparator === 'string' && options.thousandSeparator.length;
  const isDs = typeof options.decimalSeparator === 'string' && options.decimalSeparator.length;
  const fixedNumber = Number(value).toFixed(decimals);
  if (isTs || isDs) {
    if (decimals > 0) {
      const split = fixedNumber.split('.');
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
export const formatCurrencyAmount = (amount, options = {}) => {
  let amountStr = String(amount).replace(/\s/g, '');

  // Strips all commas OR replaces all commas with dots, if comma isn't used as a thousand separator
  const replaceValue = (options.thousandSeparator !== ',') ? '.' : '';
  amountStr = amountStr.replace(/,/g, replaceValue);
  const { multiplier } = options;
  const amountFloat = multiplier ? multiplier * parseFloat(amountStr) : parseFloat(amountStr);

  const decimals = options.decimals === undefined
    ? getCurrencyDecimals(options.currency)
    : options.decimals;
  return formatNumber(amountFloat, { ...options, decimals });
};

/**
 * Format date to a chosen format.
 * Input: date :: string, date format :: string.
 * Output: date :: string.
 * Example of input: '2017-01-01T00:00:00.000Z', 'DD.MM.YYYY'. Example of output: '01.01.2017'.
 */
export const formatDate = (value, dateFormat) => {
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
export const formatDateToISO = (
  value,
  dateFormat = null,
  isStrict = false,
  defaultValue = '',
  defaultDateFormat = null,
) => {
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
export const formatFloatToFixedDecimals = (value, decimals) => {
  /* eslint-disable no-restricted-globals */
  let floatValue = String(value)
    .replace(/[^\d.,-]/g, '')
    .replace(',', '.');
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
export const formatFXRate = value => Number(value).toFixed(getFXRateDecimals(value));
