webpackHotUpdate(0,{

/***/ "../src/format-utils/format-utils.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(\"../node_modules/moment/moment.js\");\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__format_utils_constants__ = __webpack_require__(\"../src/format-utils/format-utils.constants.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n\n\n\n\nvar FormatUtils = function () {\n  function FormatUtils() {\n    var _this = this;\n\n    _classCallCheck(this, FormatUtils);\n\n    this.getCurrencyDecimals = function () {\n      return _this.__getCurrencyDecimals__REACT_HOT_LOADER__.apply(_this, arguments);\n    };\n\n    this.getFXRateDecimals = function () {\n      return _this.__getFXRateDecimals__REACT_HOT_LOADER__.apply(_this, arguments);\n    };\n\n    this.getLocalDateTime = function () {\n      return _this.__getLocalDateTime__REACT_HOT_LOADER__.apply(_this, arguments);\n    };\n\n    this.formatCurrencyAmount = function () {\n      return _this.__formatCurrencyAmount__REACT_HOT_LOADER__.apply(_this, arguments);\n    };\n\n    this.formatDate = function () {\n      return _this.__formatDate__REACT_HOT_LOADER__.apply(_this, arguments);\n    };\n\n    this.formatDateToISO = function () {\n      return _this.__formatDateToISO__REACT_HOT_LOADER__.apply(_this, arguments);\n    };\n\n    this.formatFloatToFixedDecimals = function () {\n      return _this.__formatFloatToFixedDecimals__REACT_HOT_LOADER__.apply(_this, arguments);\n    };\n\n    this.formatFXRate = function () {\n      return _this.__formatFXRate__REACT_HOT_LOADER__.apply(_this, arguments);\n    };\n  }\n  /**\n   * Get a number of decimal digits for a currency.\n   * Input: currency code :: string.\n   * Output: decimals :: number.\n   * Example of input: 'EUR'. Example of output: 2.\n   * Example of input: 'JPY'. Example of output: 0.\n   */\n\n\n  /**\n   * Get a number of decimal digits for a FX rate.\n   * Input: rate :: [number, string].\n   * Output: decimals :: number.\n   * Example of input: 1.11. Example of output: 6.\n   * Example of input: 1.12345678. Example of output: 8.\n   */\n  FormatUtils.prototype.__getCurrencyDecimals__REACT_HOT_LOADER__ = function __getCurrencyDecimals__REACT_HOT_LOADER__(currency) {\n    var numberOptions = {\n      currency: currency,\n      style: 'currency',\n      currencyDisplay: 'code',\n      useGrouping: false\n    };\n    var test = new Intl.NumberFormat('en-GB', numberOptions).format(1.111111).replace(/[^\\d.,]/g, '');\n    var foundSeparator = test.search(/[.,]/g);\n    if (foundSeparator === -1) {\n      return 0;\n    }\n    return test.length - foundSeparator - 1;\n  };\n\n  /**\n   * Get local date and time from ISO 8601 timestamp. It's cross-browser (IE especially!).\n    * Input: UTC timestamp :: string.\n    * Output: timestamp :: date.\n    */\n  FormatUtils.prototype.__getFXRateDecimals__REACT_HOT_LOADER__ = function __getFXRateDecimals__REACT_HOT_LOADER__(value) {\n    var valueString = String(parseFloat(String(value)));\n    var decimalSeparator = valueString.indexOf('.');\n    var decimalNumber = valueString.length - decimalSeparator - 1;\n    return decimalSeparator === -1 || decimalNumber <= __WEBPACK_IMPORTED_MODULE_1__format_utils_constants__[\"a\" /* FXRATE_DECIMALS */] ? __WEBPACK_IMPORTED_MODULE_1__format_utils_constants__[\"a\" /* FXRATE_DECIMALS */] : decimalNumber;\n  };\n\n  /**\n   * Format amount according to its currency.\n   * Input: amount :: [number, string], currency code :: string.\n   * Output: amount :: string.\n   * Example of input: 1, 'EUR'. Example of output: '1.00'.\n   * Example of input: 1.123, 'JPY'. Example of output: '1'.\n   */\n  FormatUtils.prototype.__getLocalDateTime__REACT_HOT_LOADER__ = function __getLocalDateTime__REACT_HOT_LOADER__(timestamp) {\n    var isoTimestamp = timestamp !== null && timestamp.slice(-1) !== 'Z' ? timestamp + 'Z' : timestamp;\n    var localTime = new Date(isoTimestamp) - new Date(timestamp).getTimezoneOffset();\n    var timeToConvert = localTime >= 0 ? localTime : 0;\n    return new Date(timeToConvert);\n  };\n\n  /**\n   * Format date to a chosen format.\n   * Input: date :: string, date format :: string.\n   * Output: date :: string.\n   * Example of input: '2017-01-01T00:00:00.000Z', 'DD.MM.YYYY'. Example of output: '01.01.2017'.\n   */\n  FormatUtils.prototype.__formatCurrencyAmount__REACT_HOT_LOADER__ = function __formatCurrencyAmount__REACT_HOT_LOADER__(value, currency) {\n    return Number(value).toFixed(this.getCurrencyDecimals(currency));\n  };\n\n  /**\n   * Format localized date string to ISO timestamp.\n   * Input: date :: string, date format :: string (optional), sign of strict date format ::\n   * boolean (optional), default value :: string (optional), default date format ::\n   * string (optional).\n   * Output: ISO timestamp :: string.\n   * Example of input: '01.01', 'DD.MM.YYYY'. Example of output: '2017-01-01T00:00:00.000Z'.\n   */\n  FormatUtils.prototype.__formatDate__REACT_HOT_LOADER__ = function __formatDate__REACT_HOT_LOADER__(value, dateFormat) {\n    if (value === null) {\n      return '';\n    }\n    if (__WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, __WEBPACK_IMPORTED_MODULE_1__format_utils_constants__[\"b\" /* SKIPPED_DATE_FORMAT */], true).isValid()) {\n      return value;\n    }\n    if (__WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, __WEBPACK_IMPORTED_MODULE_0_moment___default.a.ISO_8601, true).isValid()) {\n      return __WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, __WEBPACK_IMPORTED_MODULE_0_moment___default.a.ISO_8601, true).format(dateFormat);\n    }\n    return value;\n  };\n\n  /**\n   * Format an input to a float with fixed number of decimals.\n   * Input: value to format :: [number, string], decimals :: number.\n   * Output: formatted value :: string.\n   * Example of input: '23 000.1abc', '2'. Example of output: '23000.10'.\n   */\n  FormatUtils.prototype.__formatDateToISO__REACT_HOT_LOADER__ = function __formatDateToISO__REACT_HOT_LOADER__(value) {\n    var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n    var isStrict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n    var defaultValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';\n    var defaultDateFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;\n\n    if (isStrict && __WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, __WEBPACK_IMPORTED_MODULE_1__format_utils_constants__[\"b\" /* SKIPPED_DATE_FORMAT */], isStrict).isValid()) {\n      return value;\n    }\n    if (__WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, __WEBPACK_IMPORTED_MODULE_0_moment___default.a.ISO_8601, isStrict).isValid()) {\n      return __WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, __WEBPACK_IMPORTED_MODULE_0_moment___default.a.ISO_8601, isStrict).toISOString();\n    }\n    if (dateFormat !== null && __WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, dateFormat, isStrict).isValid()) {\n      return __WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, dateFormat, isStrict).toISOString();\n    }\n    if (defaultDateFormat !== null && __WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, defaultDateFormat, isStrict).isValid()) {\n      return __WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(value, defaultDateFormat, isStrict).toISOString();\n    }\n    return defaultValue;\n  };\n\n  /**\n   * Format FX rate.\n   * Input: rate.\n   * Output: rate :: string.\n   * Example of input: 1.11. Example of output: '1.110000'.\n   * Example of input: 1.12345678. Example of output: '1.12345678'.\n   */\n  FormatUtils.prototype.__formatFloatToFixedDecimals__REACT_HOT_LOADER__ = function __formatFloatToFixedDecimals__REACT_HOT_LOADER__(value, decimals) {\n    /* eslint-disable no-restricted-globals */\n    var floatValue = String(value).replace(/[^\\d.,-]/g, '').replace(',', '.');\n    floatValue = isNaN(Number(floatValue)) ? 0 : Number(floatValue);\n    return floatValue.toFixed(decimals);\n  };\n\n  FormatUtils.prototype.__formatFXRate__REACT_HOT_LOADER__ = function __formatFXRate__REACT_HOT_LOADER__(value) {\n    return Number(value).toFixed(this.getFXRateDecimals(value));\n  };\n\n  return FormatUtils;\n}();\n\nvar _default = new FormatUtils();\n\n/* harmony default export */ __webpack_exports__[\"a\"] = (_default);\n;\n\nvar _temp = function () {\n  if (typeof __REACT_HOT_LOADER__ === 'undefined') {\n    return;\n  }\n\n  __REACT_HOT_LOADER__.register(FormatUtils, 'FormatUtils', 'C:/SRC_GIT/ocfrontend/format-utils/src/format-utils/format-utils.js');\n\n  __REACT_HOT_LOADER__.register(_default, 'default', 'C:/SRC_GIT/ocfrontend/format-utils/src/format-utils/format-utils.js');\n}();\n\n;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vc3JjL2Zvcm1hdC11dGlscy9mb3JtYXQtdXRpbHMuanM/Y2MwMiJdLCJuYW1lcyI6WyJGb3JtYXRVdGlscyIsImdldEN1cnJlbmN5RGVjaW1hbHMiLCJnZXRGWFJhdGVEZWNpbWFscyIsImdldExvY2FsRGF0ZVRpbWUiLCJmb3JtYXRDdXJyZW5jeUFtb3VudCIsImZvcm1hdERhdGUiLCJmb3JtYXREYXRlVG9JU08iLCJmb3JtYXRGbG9hdFRvRml4ZWREZWNpbWFscyIsImZvcm1hdEZYUmF0ZSIsImN1cnJlbmN5IiwibnVtYmVyT3B0aW9ucyIsInN0eWxlIiwiY3VycmVuY3lEaXNwbGF5IiwidXNlR3JvdXBpbmciLCJ0ZXN0IiwiSW50bCIsIk51bWJlckZvcm1hdCIsImZvcm1hdCIsInJlcGxhY2UiLCJmb3VuZFNlcGFyYXRvciIsInNlYXJjaCIsImxlbmd0aCIsInZhbHVlIiwidmFsdWVTdHJpbmciLCJTdHJpbmciLCJwYXJzZUZsb2F0IiwiZGVjaW1hbFNlcGFyYXRvciIsImluZGV4T2YiLCJkZWNpbWFsTnVtYmVyIiwidGltZXN0YW1wIiwiaXNvVGltZXN0YW1wIiwic2xpY2UiLCJsb2NhbFRpbWUiLCJEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJ0aW1lVG9Db252ZXJ0IiwiTnVtYmVyIiwidG9GaXhlZCIsImRhdGVGb3JtYXQiLCJtb21lbnQiLCJ1dGMiLCJpc1ZhbGlkIiwiSVNPXzg2MDEiLCJpc1N0cmljdCIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHREYXRlRm9ybWF0IiwidG9JU09TdHJpbmciLCJkZWNpbWFscyIsImZsb2F0VmFsdWUiLCJpc05hTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7QUFFQTs7SUFLTUEsVzs7Ozs7O1NBUUpDLG1COzs7O1NBc0JBQyxpQjs7OztTQWFBQyxnQjs7OztTQWVBQyxvQjs7OztTQVNBQyxVOzs7O1NBcUJBQyxlOzs7O1NBc0JBQywwQjs7OztTQWNBQyxZOzs7O0FBM0hBOzs7Ozs7Ozs7QUFzQkE7Ozs7Ozs7dUhBZnVCQyxRLEVBQWE7QUFDbEMsUUFBTUMsZ0JBQWdCO0FBQ3BCRCx3QkFEb0I7QUFFcEJFLGFBQU8sVUFGYTtBQUdwQkMsdUJBQWlCLE1BSEc7QUFJcEJDLG1CQUFhO0FBSk8sS0FBdEI7QUFNQSxRQUFNQyxPQUFPLElBQUlDLEtBQUtDLFlBQVQsQ0FBc0IsT0FBdEIsRUFBK0JOLGFBQS9CLEVBQThDTyxNQUE5QyxDQUFxRCxRQUFyRCxFQUErREMsT0FBL0QsQ0FBdUUsVUFBdkUsRUFBbUYsRUFBbkYsQ0FBYjtBQUNBLFFBQU1DLGlCQUFpQkwsS0FBS00sTUFBTCxDQUFZLE9BQVosQ0FBdkI7QUFDQSxRQUFJRCxtQkFBbUIsQ0FBQyxDQUF4QixFQUEyQjtBQUN6QixhQUFPLENBQVA7QUFDRDtBQUNELFdBQU9MLEtBQUtPLE1BQUwsR0FBY0YsY0FBZCxHQUErQixDQUF0QztBQUNELEc7O0FBaUJEOzs7OzttSEFScUJHLEssRUFBVTtBQUM3QixRQUFNQyxjQUFjQyxPQUFPQyxXQUFXRCxPQUFPRixLQUFQLENBQVgsQ0FBUCxDQUFwQjtBQUNBLFFBQU1JLG1CQUFtQkgsWUFBWUksT0FBWixDQUFvQixHQUFwQixDQUF6QjtBQUNBLFFBQU1DLGdCQUFnQkwsWUFBWUYsTUFBWixHQUFxQkssZ0JBQXJCLEdBQXdDLENBQTlEO0FBQ0EsV0FBUUEscUJBQXFCLENBQUMsQ0FBdEIsSUFBMkJFLGlCQUFpQixnRkFBN0MsR0FDTCxnRkFESyxHQUNhQSxhQURwQjtBQUVELEc7O0FBZUQ7Ozs7Ozs7aUhBUm9CQyxTLEVBQWM7QUFDaEMsUUFBTUMsZUFBZ0JELGNBQWMsSUFBZCxJQUFzQkEsVUFBVUUsS0FBVixDQUFnQixDQUFDLENBQWpCLE1BQXdCLEdBQS9DLEdBQ2hCRixTQURnQixTQUNEQSxTQURwQjtBQUVBLFFBQU1HLFlBQVksSUFBSUMsSUFBSixDQUFTSCxZQUFULElBQXlCLElBQUlHLElBQUosQ0FBU0osU0FBVCxFQUFvQkssaUJBQXBCLEVBQTNDO0FBQ0EsUUFBTUMsZ0JBQWdCSCxhQUFhLENBQWIsR0FBaUJBLFNBQWpCLEdBQTZCLENBQW5EO0FBQ0EsV0FBTyxJQUFJQyxJQUFKLENBQVNFLGFBQVQsQ0FBUDtBQUNELEc7O0FBWUQ7Ozs7Ozt5SEFId0JiLEssRUFBT2IsUTtXQUM3QjJCLE9BQU9kLEtBQVAsRUFBY2UsT0FBZCxDQUFzQixLQUFLcEMsbUJBQUwsQ0FBeUJRLFFBQXpCLENBQXRCLEM7OztBQXFCRjs7Ozs7Ozs7cUdBYmNhLEssRUFBT2dCLFUsRUFBZTtBQUNsQyxRQUFJaEIsVUFBVSxJQUFkLEVBQW9CO0FBQ2xCLGFBQU8sRUFBUDtBQUNEO0FBQ0QsUUFBSSw4Q0FBQWlCLENBQU9DLEdBQVAsQ0FBV2xCLEtBQVgsRUFBa0Isb0ZBQWxCLEVBQXVDLElBQXZDLEVBQTZDbUIsT0FBN0MsRUFBSixFQUE0RDtBQUMxRCxhQUFPbkIsS0FBUDtBQUNEO0FBQ0QsUUFBSSw4Q0FBQWlCLENBQU9DLEdBQVAsQ0FBV2xCLEtBQVgsRUFBa0IsOENBQUFpQixDQUFPRyxRQUF6QixFQUFtQyxJQUFuQyxFQUF5Q0QsT0FBekMsRUFBSixFQUF3RDtBQUN0RCxhQUFPLDhDQUFBRixDQUFPQyxHQUFQLENBQVdsQixLQUFYLEVBQWtCLDhDQUFBaUIsQ0FBT0csUUFBekIsRUFBbUMsSUFBbkMsRUFBeUN6QixNQUF6QyxDQUFnRHFCLFVBQWhELENBQVA7QUFDRDtBQUNELFdBQU9oQixLQUFQO0FBQ0QsRzs7QUEwQkQ7Ozs7OzsrR0FoQm1CQSxLLEVBQTRGO0FBQUEsUUFBckZnQixVQUFxRix1RUFBeEUsSUFBd0U7QUFBQSxRQUFsRUssUUFBa0UsdUVBQXZELEtBQXVEO0FBQUEsUUFBaERDLFlBQWdELHVFQUFqQyxFQUFpQztBQUFBLFFBQTdCQyxpQkFBNkIsdUVBQVQsSUFBUzs7QUFDN0csUUFBSUYsWUFBWSw4Q0FBQUosQ0FBT0MsR0FBUCxDQUFXbEIsS0FBWCxFQUFrQixvRkFBbEIsRUFBdUNxQixRQUF2QyxFQUFpREYsT0FBakQsRUFBaEIsRUFBNEU7QUFDMUUsYUFBT25CLEtBQVA7QUFDRDtBQUNELFFBQUksOENBQUFpQixDQUFPQyxHQUFQLENBQVdsQixLQUFYLEVBQWtCLDhDQUFBaUIsQ0FBT0csUUFBekIsRUFBbUNDLFFBQW5DLEVBQTZDRixPQUE3QyxFQUFKLEVBQTREO0FBQzFELGFBQU8sOENBQUFGLENBQU9DLEdBQVAsQ0FBV2xCLEtBQVgsRUFBa0IsOENBQUFpQixDQUFPRyxRQUF6QixFQUFtQ0MsUUFBbkMsRUFBNkNHLFdBQTdDLEVBQVA7QUFDRDtBQUNELFFBQUlSLGVBQWUsSUFBZixJQUF1Qiw4Q0FBQUMsQ0FBT0MsR0FBUCxDQUFXbEIsS0FBWCxFQUFrQmdCLFVBQWxCLEVBQThCSyxRQUE5QixFQUF3Q0YsT0FBeEMsRUFBM0IsRUFBOEU7QUFDNUUsYUFBTyw4Q0FBQUYsQ0FBT0MsR0FBUCxDQUFXbEIsS0FBWCxFQUFrQmdCLFVBQWxCLEVBQThCSyxRQUE5QixFQUF3Q0csV0FBeEMsRUFBUDtBQUNEO0FBQ0QsUUFBSUQsc0JBQXNCLElBQXRCLElBQThCLDhDQUFBTixDQUFPQyxHQUFQLENBQVdsQixLQUFYLEVBQWtCdUIsaUJBQWxCLEVBQXFDRixRQUFyQyxFQUErQ0YsT0FBL0MsRUFBbEMsRUFBNEY7QUFDMUYsYUFBTyw4Q0FBQUYsQ0FBT0MsR0FBUCxDQUFXbEIsS0FBWCxFQUFrQnVCLGlCQUFsQixFQUFxQ0YsUUFBckMsRUFBK0NHLFdBQS9DLEVBQVA7QUFDRDtBQUNELFdBQU9GLFlBQVA7QUFDRCxHOztBQWVEOzs7Ozs7O3FJQVA4QnRCLEssRUFBT3lCLFEsRUFBYTtBQUNoRDtBQUNBLFFBQUlDLGFBQWF4QixPQUFPRixLQUFQLEVBQWNKLE9BQWQsQ0FBc0IsV0FBdEIsRUFBbUMsRUFBbkMsRUFBdUNBLE9BQXZDLENBQStDLEdBQS9DLEVBQW9ELEdBQXBELENBQWpCO0FBQ0E4QixpQkFBYUMsTUFBTWIsT0FBT1ksVUFBUCxDQUFOLElBQTRCLENBQTVCLEdBQWdDWixPQUFPWSxVQUFQLENBQTdDO0FBQ0EsV0FBT0EsV0FBV1gsT0FBWCxDQUFtQlUsUUFBbkIsQ0FBUDtBQUNELEc7O3lHQVNjekIsSztXQUFTYyxPQUFPZCxLQUFQLEVBQWNlLE9BQWQsQ0FBc0IsS0FBS25DLGlCQUFMLENBQXVCb0IsS0FBdkIsQ0FBdEIsQzs7Ozs7O2VBR1gsSUFBSXRCLFdBQUosRTs7QUFBZjs7Ozs7Ozs7Z0NBL0hNQSxXIiwiZmlsZSI6Ii4uL3NyYy9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQge1xuICBGWFJBVEVfREVDSU1BTFMsXG4gIFNLSVBQRURfREFURV9GT1JNQVQsXG59IGZyb20gJy4vZm9ybWF0LXV0aWxzLmNvbnN0YW50cyc7XG5cbmNsYXNzIEZvcm1hdFV0aWxzIHtcbiAgLyoqXG4gICAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBjdXJyZW5jeS5cbiAgICogSW5wdXQ6IGN1cnJlbmN5IGNvZGUgOjogc3RyaW5nLlxuICAgKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJ0VVUicuIEV4YW1wbGUgb2Ygb3V0cHV0OiAyLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAnSlBZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6IDAuXG4gICAqL1xuICBnZXRDdXJyZW5jeURlY2ltYWxzID0gKGN1cnJlbmN5KSA9PiB7XG4gICAgY29uc3QgbnVtYmVyT3B0aW9ucyA9IHtcbiAgICAgIGN1cnJlbmN5LFxuICAgICAgc3R5bGU6ICdjdXJyZW5jeScsXG4gICAgICBjdXJyZW5jeURpc3BsYXk6ICdjb2RlJyxcbiAgICAgIHVzZUdyb3VwaW5nOiBmYWxzZSxcbiAgICB9O1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoJ2VuLUdCJywgbnVtYmVyT3B0aW9ucykuZm9ybWF0KDEuMTExMTExKS5yZXBsYWNlKC9bXlxcZC4sXS9nLCAnJyk7XG4gICAgY29uc3QgZm91bmRTZXBhcmF0b3IgPSB0ZXN0LnNlYXJjaCgvWy4sXS9nKTtcbiAgICBpZiAoZm91bmRTZXBhcmF0b3IgPT09IC0xKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRlc3QubGVuZ3RoIC0gZm91bmRTZXBhcmF0b3IgLSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyBmb3IgYSBGWCByYXRlLlxuICAgKiBJbnB1dDogcmF0ZSA6OiBbbnVtYmVyLCBzdHJpbmddLlxuICAgKiBPdXRwdXQ6IGRlY2ltYWxzIDo6IG51bWJlci5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMS4gRXhhbXBsZSBvZiBvdXRwdXQ6IDYuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTIzNDU2NzguIEV4YW1wbGUgb2Ygb3V0cHV0OiA4LlxuICAgKi9cbiAgZ2V0RlhSYXRlRGVjaW1hbHMgPSAodmFsdWUpID0+IHtcbiAgICBjb25zdCB2YWx1ZVN0cmluZyA9IFN0cmluZyhwYXJzZUZsb2F0KFN0cmluZyh2YWx1ZSkpKTtcbiAgICBjb25zdCBkZWNpbWFsU2VwYXJhdG9yID0gdmFsdWVTdHJpbmcuaW5kZXhPZignLicpO1xuICAgIGNvbnN0IGRlY2ltYWxOdW1iZXIgPSB2YWx1ZVN0cmluZy5sZW5ndGggLSBkZWNpbWFsU2VwYXJhdG9yIC0gMTtcbiAgICByZXR1cm4gKGRlY2ltYWxTZXBhcmF0b3IgPT09IC0xIHx8IGRlY2ltYWxOdW1iZXIgPD0gRlhSQVRFX0RFQ0lNQUxTKSA/XG4gICAgICBGWFJBVEVfREVDSU1BTFMgOiBkZWNpbWFsTnVtYmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBsb2NhbCBkYXRlIGFuZCB0aW1lIGZyb20gSVNPIDg2MDEgdGltZXN0YW1wLiBJdCdzIGNyb3NzLWJyb3dzZXIgKElFIGVzcGVjaWFsbHkhKS5cbiAgICAqIElucHV0OiBVVEMgdGltZXN0YW1wIDo6IHN0cmluZy5cbiAgICAqIE91dHB1dDogdGltZXN0YW1wIDo6IGRhdGUuXG4gICAgKi9cbiAgZ2V0TG9jYWxEYXRlVGltZSA9ICh0aW1lc3RhbXApID0+IHtcbiAgICBjb25zdCBpc29UaW1lc3RhbXAgPSAodGltZXN0YW1wICE9PSBudWxsICYmIHRpbWVzdGFtcC5zbGljZSgtMSkgIT09ICdaJykgP1xuICAgICAgYCR7dGltZXN0YW1wfVpgIDogdGltZXN0YW1wO1xuICAgIGNvbnN0IGxvY2FsVGltZSA9IG5ldyBEYXRlKGlzb1RpbWVzdGFtcCkgLSBuZXcgRGF0ZSh0aW1lc3RhbXApLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgY29uc3QgdGltZVRvQ29udmVydCA9IGxvY2FsVGltZSA+PSAwID8gbG9jYWxUaW1lIDogMDtcbiAgICByZXR1cm4gbmV3IERhdGUodGltZVRvQ29udmVydCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZvcm1hdCBhbW91bnQgYWNjb3JkaW5nIHRvIGl0cyBjdXJyZW5jeS5cbiAgICogSW5wdXQ6IGFtb3VudCA6OiBbbnVtYmVyLCBzdHJpbmddLCBjdXJyZW5jeSBjb2RlIDo6IHN0cmluZy5cbiAgICogT3V0cHV0OiBhbW91bnQgOjogc3RyaW5nLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLCAnRVVSJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcxLjAwJy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogMS4xMjMsICdKUFknLiBFeGFtcGxlIG9mIG91dHB1dDogJzEnLlxuICAgKi9cbiAgZm9ybWF0Q3VycmVuY3lBbW91bnQgPSAodmFsdWUsIGN1cnJlbmN5KSA9PlxuICAgIE51bWJlcih2YWx1ZSkudG9GaXhlZCh0aGlzLmdldEN1cnJlbmN5RGVjaW1hbHMoY3VycmVuY3kpKTtcblxuICAvKipcbiAgICogRm9ybWF0IGRhdGUgdG8gYSBjaG9zZW4gZm9ybWF0LlxuICAgKiBJbnB1dDogZGF0ZSA6OiBzdHJpbmcsIGRhdGUgZm9ybWF0IDo6IHN0cmluZy5cbiAgICogT3V0cHV0OiBkYXRlIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicsICdERC5NTS5ZWVlZJy4gRXhhbXBsZSBvZiBvdXRwdXQ6ICcwMS4wMS4yMDE3Jy5cbiAgICovXG4gIGZvcm1hdERhdGUgPSAodmFsdWUsIGRhdGVGb3JtYXQpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIHRydWUpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAobW9tZW50LnV0Yyh2YWx1ZSwgbW9tZW50LklTT184NjAxLCB0cnVlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpLmZvcm1hdChkYXRlRm9ybWF0KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGb3JtYXQgbG9jYWxpemVkIGRhdGUgc3RyaW5nIHRvIElTTyB0aW1lc3RhbXAuXG4gICAqIElucHV0OiBkYXRlIDo6IHN0cmluZywgZGF0ZSBmb3JtYXQgOjogc3RyaW5nIChvcHRpb25hbCksIHNpZ24gb2Ygc3RyaWN0IGRhdGUgZm9ybWF0IDo6XG4gICAqIGJvb2xlYW4gKG9wdGlvbmFsKSwgZGVmYXVsdCB2YWx1ZSA6OiBzdHJpbmcgKG9wdGlvbmFsKSwgZGVmYXVsdCBkYXRlIGZvcm1hdCA6OlxuICAgKiBzdHJpbmcgKG9wdGlvbmFsKS5cbiAgICogT3V0cHV0OiBJU08gdGltZXN0YW1wIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzAxLjAxJywgJ0RELk1NLllZWVknLiBFeGFtcGxlIG9mIG91dHB1dDogJzIwMTctMDEtMDFUMDA6MDA6MDAuMDAwWicuXG4gICAqL1xuICBmb3JtYXREYXRlVG9JU08gPSAodmFsdWUsIGRhdGVGb3JtYXQgPSBudWxsLCBpc1N0cmljdCA9IGZhbHNlLCBkZWZhdWx0VmFsdWUgPSAnJywgZGVmYXVsdERhdGVGb3JtYXQgPSBudWxsKSA9PiB7XG4gICAgaWYgKGlzU3RyaWN0ICYmIG1vbWVudC51dGModmFsdWUsIFNLSVBQRURfREFURV9GT1JNQVQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuIG1vbWVudC51dGModmFsdWUsIG1vbWVudC5JU09fODYwMSwgaXNTdHJpY3QpLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChkYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRhdGVGb3JtYXQsIGlzU3RyaWN0KS5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybiBtb21lbnQudXRjKHZhbHVlLCBkYXRlRm9ybWF0LCBpc1N0cmljdCkudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKGRlZmF1bHREYXRlRm9ybWF0ICE9PSBudWxsICYmIG1vbWVudC51dGModmFsdWUsIGRlZmF1bHREYXRlRm9ybWF0LCBpc1N0cmljdCkuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm4gbW9tZW50LnV0Yyh2YWx1ZSwgZGVmYXVsdERhdGVGb3JtYXQsIGlzU3RyaWN0KS50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGb3JtYXQgYW4gaW5wdXQgdG8gYSBmbG9hdCB3aXRoIGZpeGVkIG51bWJlciBvZiBkZWNpbWFscy5cbiAgICogSW5wdXQ6IHZhbHVlIHRvIGZvcm1hdCA6OiBbbnVtYmVyLCBzdHJpbmddLCBkZWNpbWFscyA6OiBudW1iZXIuXG4gICAqIE91dHB1dDogZm9ybWF0dGVkIHZhbHVlIDo6IHN0cmluZy5cbiAgICogRXhhbXBsZSBvZiBpbnB1dDogJzIzIDAwMC4xYWJjJywgJzInLiBFeGFtcGxlIG9mIG91dHB1dDogJzIzMDAwLjEwJy5cbiAgICovXG4gIGZvcm1hdEZsb2F0VG9GaXhlZERlY2ltYWxzID0gKHZhbHVlLCBkZWNpbWFscykgPT4ge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAqL1xuICAgIGxldCBmbG9hdFZhbHVlID0gU3RyaW5nKHZhbHVlKS5yZXBsYWNlKC9bXlxcZC4sLV0vZywgJycpLnJlcGxhY2UoJywnLCAnLicpO1xuICAgIGZsb2F0VmFsdWUgPSBpc05hTihOdW1iZXIoZmxvYXRWYWx1ZSkpID8gMCA6IE51bWJlcihmbG9hdFZhbHVlKTtcbiAgICByZXR1cm4gZmxvYXRWYWx1ZS50b0ZpeGVkKGRlY2ltYWxzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgRlggcmF0ZS5cbiAgICogSW5wdXQ6IHJhdGUuXG4gICAqIE91dHB1dDogcmF0ZSA6OiBzdHJpbmcuXG4gICAqIEV4YW1wbGUgb2YgaW5wdXQ6IDEuMTEuIEV4YW1wbGUgb2Ygb3V0cHV0OiAnMS4xMTAwMDAnLlxuICAgKiBFeGFtcGxlIG9mIGlucHV0OiAxLjEyMzQ1Njc4LiBFeGFtcGxlIG9mIG91dHB1dDogJzEuMTIzNDU2NzgnLlxuICAgKi9cbiAgZm9ybWF0RlhSYXRlID0gdmFsdWUgPT4gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKHRoaXMuZ2V0RlhSYXRlRGVjaW1hbHModmFsdWUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEZvcm1hdFV0aWxzKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2Zvcm1hdC11dGlscy9mb3JtYXQtdXRpbHMuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../src/format-utils/format-utils.js\n");

/***/ })

})