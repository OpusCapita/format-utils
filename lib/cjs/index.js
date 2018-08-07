'use strict';

exports.__esModule = true;

var _formatUtils = require('./format-utils/format-utils');

Object.keys(_formatUtils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _formatUtils[key];
    }
  });
});

var FormatUtils = _interopRequireWildcard(_formatUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = FormatUtils;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJGb3JtYXRVdGlscyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUdBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7SUFIWUEsVzs7OztrQkFFR0EsVyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEZvcm1hdFV0aWxzIGZyb20gJy4vZm9ybWF0LXV0aWxzL2Zvcm1hdC11dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1hdFV0aWxzO1xuZXhwb3J0ICogZnJvbSAnLi9mb3JtYXQtdXRpbHMvZm9ybWF0LXV0aWxzJztcbiJdfQ==