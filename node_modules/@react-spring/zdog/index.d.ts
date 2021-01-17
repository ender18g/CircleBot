import * as Zdog from 'react-zdog';
import { ElementType, ForwardRefExoticComponent, ComponentPropsWithRef } from 'react';
import { FluidValue } from '@react-spring/shared';
export * from '@react-spring/core';

declare type ZdogExports = typeof Zdog;
declare type ZdogElements = {
    [P in keyof ZdogExports]: P extends 'Illustration' ? never : ZdogExports[P] extends ElementType ? P : never;
}[keyof ZdogExports];
declare const primitives: ZdogElements[];

declare type Primitives = typeof primitives[number];
declare type AnimatedPrimitives = {
    [P in Primitives]: AnimatedComponent<typeof Zdog[P]>;
};
/** The type of the `animated()` function */
declare type WithAnimated = {
    <T extends ElementType>(wrappedComponent: T): AnimatedComponent<T>;
} & AnimatedPrimitives;
/** The type of an `animated()` component */
declare type AnimatedComponent<T extends ElementType> = ForwardRefExoticComponent<AnimatedProps<ComponentPropsWithRef<T>>>;
/** The props of an `animated()` component */
declare type AnimatedProps<Props extends object> = {
    [P in keyof Props]: P extends 'ref' | 'key' ? Props[P] : AnimatedProp<Props[P]>;
};
declare type AnimatedProp<T> = [T, T] extends [infer T, infer DT] ? [DT] extends [never] ? never : DT extends void ? undefined : DT extends object ? AnimatedStyle<T> : DT | AnimatedLeaf<T> : never;
declare type AnimatedStyle<T> = [T, T] extends [infer T, infer DT] ? DT extends void ? undefined : [DT] extends [never] ? never : DT extends object ? {
    [P in keyof DT]: AnimatedStyle<DT[P]>;
} : DT | AnimatedLeaf<T> : never;
declare type AnimatedLeaf<T> = Exclude<T, object | void> | Extract<T, ReadonlyArray<number | string>> extends infer U ? [U] extends [never] ? never : FluidValue<U | Exclude<T, object | void>> : never;

declare const animated: WithAnimated;

export { AnimatedComponent, AnimatedProps, WithAnimated, animated as a, animated };
