'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var shared = require('@react-spring/shared');
var stringInterpolation = require('@react-spring/shared/stringInterpolation');
var colorNames = _interopDefault(require('@react-spring/shared/colors'));
var animated$1 = require('@react-spring/animated/index.cjs.js');
var core = require('@react-spring/core/index.cjs.js');

var primitives = ['Arc', 'Arrow', 'Circle', 'Ellipse', 'FastLayer', 'Group', 'Image', 'Label', 'Layer', 'Line', 'Path', 'Rect', 'RegularPolygon', 'Ring', 'Shape', 'Sprite', 'Star', 'Tag', 'Text', 'TextPath', 'Transformer', 'Wedge'];

shared.Globals.assign({
  createStringInterpolator: stringInterpolation.createStringInterpolator,
  colorNames: colorNames
});
var host = animated$1.createHost(primitives, {
  applyAnimatedValues: function applyAnimatedValues(instance, props) {
    if (!instance.nodeType) return false;

    instance._applyProps(instance, props);
  }
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
