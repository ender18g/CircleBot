import { Globals } from '@react-spring/shared';
import { createStringInterpolator } from '@react-spring/shared/stringInterpolation';
import colorNames from '@react-spring/shared/colors';
import { createHost } from '@react-spring/animated';
export * from '@react-spring/core';

const primitives = ['Arc', 'Arrow', 'Circle', 'Ellipse', 'FastLayer', 'Group', 'Image', 'Label', 'Layer', 'Line', 'Path', 'Rect', 'RegularPolygon', 'Ring', 'Shape', 'Sprite', 'Star', 'Tag', 'Text', 'TextPath', 'Transformer', 'Wedge'];

Globals.assign({
  createStringInterpolator,
  colorNames
});
const host = createHost(primitives, {
  applyAnimatedValues(instance, props) {
    if (!instance.nodeType) return false;

    instance._applyProps(instance, props);
  }

});
const animated = host.animated;

export { animated as a, animated };
//# sourceMappingURL=index.js.map
