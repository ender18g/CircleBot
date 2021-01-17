'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactThreeFiber = require('react-three-fiber');
var core = require('@react-spring/core/index.cjs.js');
var animated$1 = require('@react-spring/animated/index.cjs.js');
var stringInterpolation = require('@react-spring/shared/stringInterpolation');
var colorNames = _interopDefault(require('@react-spring/shared/colors'));
var THREE = require('three');

var primitives = ['primitive'].concat(Object.keys(THREE).filter(function (key) {
  return /^[A-Z]/.test(key);
}).map(function (key) {
  return key[0].toLowerCase() + key.slice(1);
}));

// Let r3f drive the frameloop.
var frameLoop = new core.FrameLoop(function () {
  return reactThreeFiber.invalidate();
});
reactThreeFiber.addEffect(function () {
  frameLoop.advance();
  return true; // Never stop.
});
core.Globals.assign({
  createStringInterpolator: stringInterpolation.createStringInterpolator,
  colorNames: colorNames,
  frameLoop: frameLoop
});
var host = animated$1.createHost(primitives, {
  applyAnimatedValues: reactThreeFiber.applyProps
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
