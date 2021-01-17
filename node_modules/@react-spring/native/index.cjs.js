'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactNative = require('react-native');
var animated$1 = require('@react-spring/animated/index.cjs.js');
var stringInterpolation = require('@react-spring/shared/stringInterpolation');
var shared = require('@react-spring/shared');
var colorNames = _interopDefault(require('@react-spring/shared/colors'));
var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var core = require('@react-spring/core/index.cjs.js');

var primitives = {
  View: reactNative.View,
  Text: reactNative.Text,
  Image: reactNative.Image
};

var AnimatedTransform = /*#__PURE__*/function (_AnimatedObject) {
  _inheritsLoose(AnimatedTransform, _AnimatedObject);

  function AnimatedTransform(source) {
    var _this;

    _this = _AnimatedObject.call(this, source) || this;
    _this.source = void 0;
    return _this;
  }

  var _proto = AnimatedTransform.prototype;

  _proto.getValue = function getValue() {
    return this.source ? this.source.map(function (source) {
      var transform = {};
      shared.each(source, function (source, key) {
        transform[key] = shared.getFluidValue(source);
      });
      return transform;
    }) : [];
  };

  _proto.setValue = function setValue(source) {
    this.source = source;
    this.payload = this._makePayload(source);
  };

  _proto._makePayload = function _makePayload(source) {
    var _this2 = this;

    if (!source) return [];
    var payload = new Set();
    shared.each(source, function (transform) {
      return shared.each(transform, _this2._addToPayload, payload);
    });
    return Array.from(payload);
  };

  return AnimatedTransform;
}(animated$1.AnimatedObject);

var AnimatedStyle = /*#__PURE__*/function (_AnimatedObject) {
  _inheritsLoose(AnimatedStyle, _AnimatedObject);

  function AnimatedStyle(style) {
    return _AnimatedObject.call(this, style || null) || this;
  }

  var _proto = AnimatedStyle.prototype;

  _proto.setValue = function setValue(style) {
    _AnimatedObject.prototype.setValue.call(this, style && style.transform ? _extends(_extends({}, style), {}, {
      transform: new AnimatedTransform(style.transform)
    }) : style);
  };

  return AnimatedStyle;
}(animated$1.AnimatedObject);

shared.Globals.assign({
  colorNames: colorNames,
  createStringInterpolator: stringInterpolation.createStringInterpolator
});
var host = animated$1.createHost(primitives, {
  applyAnimatedValues: function applyAnimatedValues(instance, props) {
    if (shared.is.und(props.children) && instance.setNativeProps) {
      instance.setNativeProps(props);
      return true;
    }

    return false;
  },
  createAnimatedStyle: function createAnimatedStyle(styles) {
    styles = reactNative.StyleSheet.flatten(styles);

    if (shared.is.obj(styles.shadowOffset)) {
      styles.shadowOffset = new animated$1.AnimatedObject(styles.shadowOffset);
    }

    return new AnimatedStyle(styles);
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
