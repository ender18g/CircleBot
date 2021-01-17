import { View, Text, Image, StyleSheet } from 'react-native';
import { AnimatedObject, createHost } from '@react-spring/animated';
import { createStringInterpolator } from '@react-spring/shared/stringInterpolation';
import { each, getFluidValue, Globals, is } from '@react-spring/shared';
import colorNames from '@react-spring/shared/colors';
import _extends from '@babel/runtime/helpers/esm/extends';
export * from '@react-spring/core';

const primitives = {
  View: View,
  Text: Text,
  Image
};

class AnimatedTransform extends AnimatedObject {
  constructor(source) {
    super(source);
    this.source = void 0;
  }

  getValue() {
    return this.source ? this.source.map(source => {
      const transform = {};
      each(source, (source, key) => {
        transform[key] = getFluidValue(source);
      });
      return transform;
    }) : [];
  }

  setValue(source) {
    this.source = source;
    this.payload = this._makePayload(source);
  }

  _makePayload(source) {
    if (!source) return [];
    const payload = new Set();
    each(source, transform => each(transform, this._addToPayload, payload));
    return Array.from(payload);
  }

}

class AnimatedStyle extends AnimatedObject {
  constructor(style) {
    super(style || null);
  }

  setValue(style) {
    super.setValue(style && style.transform ? _extends(_extends({}, style), {}, {
      transform: new AnimatedTransform(style.transform)
    }) : style);
  }

}

Globals.assign({
  colorNames,
  createStringInterpolator
});
const host = createHost(primitives, {
  applyAnimatedValues(instance, props) {
    if (is.und(props.children) && instance.setNativeProps) {
      instance.setNativeProps(props);
      return true;
    }

    return false;
  },

  createAnimatedStyle(styles) {
    styles = StyleSheet.flatten(styles);

    if (is.obj(styles.shadowOffset)) {
      styles.shadowOffset = new AnimatedObject(styles.shadowOffset);
    }

    return new AnimatedStyle(styles);
  }

});
const animated = host.animated;

export { animated as a, animated };
//# sourceMappingURL=index.js.map
