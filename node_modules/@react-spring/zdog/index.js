import { applyProps } from 'react-zdog';
import { Globals } from '@react-spring/core';
export * from '@react-spring/core';
import { createHost } from '@react-spring/animated';
import { createStringInterpolator } from '@react-spring/shared/stringInterpolation';
import colorNames from '@react-spring/shared/colors';

const primitives = ['Anchor', 'Shape', 'Group', 'Rect', 'RoundedRect', 'Ellipse', 'Polygon', 'Hemisphere', 'Cylinder', 'Cone', 'Box'];

Globals.assign({
  createStringInterpolator,
  colorNames
});
const host = createHost(primitives, {
  applyAnimatedValues: applyProps
});
const animated = host.animated;

export { animated as a, animated };
//# sourceMappingURL=index.js.map
