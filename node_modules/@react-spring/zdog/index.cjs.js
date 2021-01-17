'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactZdog = require('react-zdog');
var core = require('@react-spring/core/index.cjs.js');
var animated$1 = require('@react-spring/animated/index.cjs.js');
var stringInterpolation = require('@react-spring/shared/stringInterpolation');
var colorNames = _interopDefault(require('@react-spring/shared/colors'));

var primitives = ['Anchor', 'Shape', 'Group', 'Rect', 'RoundedRect', 'Ellipse', 'Polygon', 'Hemisphere', 'Cylinder', 'Cone', 'Box'];

core.Globals.assign({
  createStringInterpolator: stringInterpolation.createStringInterpolator,
  colorNames: colorNames
});
var host = animated$1.createHost(primitives, {
  applyAnimatedValues: reactZdog.applyProps
});
var animated = host.animated;

Object.keys(core).forEach(function (k) {
  if (k !== 'default') Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return core[k];
    }
  });
});
exports.a = animated;
exports.animated = animated;
//# sourceMappingURL=index.cjs.js.map
