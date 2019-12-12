"use strict";

exports.__esModule = true;
var _exportNames = {};
exports["default"] = void 0;

var FormatUtils = _interopRequireWildcard(require("./format-utils/format-utils"));

Object.keys(FormatUtils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = FormatUtils[key];
});

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = FormatUtils;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJGb3JtYXRVdGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7O2VBRGVBLFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBGb3JtYXRVdGlscyBmcm9tICcuL2Zvcm1hdC11dGlscy9mb3JtYXQtdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBGb3JtYXRVdGlscztcbmV4cG9ydCAqIGZyb20gJy4vZm9ybWF0LXV0aWxzL2Zvcm1hdC11dGlscyc7XG4iXX0=