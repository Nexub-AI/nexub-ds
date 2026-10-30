// Reanimated 4.7's own Jest setup needs its web build; our tests check roles,
// haptics and accessibility, not spring physics, so stub the APIs we use.
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  const id = (v) => v;
  // Layout-animation builders: chainable, recording their config so tests can
  // check the presets ride the spring tokens.
  const builder = (name) => {
    const make = (config) => {
      const b = { __name: name, __config: config };
      for (const key of ['springify', 'stiffness', 'damping', 'mass', 'reduceMotion', 'duration', 'delay', 'easing']) {
        b[key] = (v) => make({ ...config, [key]: v === undefined ? true : v });
      }
      return b;
    };
    return make({});
  };
  // Animated.View accepts and drops layout-animation props like the real one.
  const AnimatedView = React.forwardRef(function AnimatedView(
    { entering: _e, exiting: _x, layout: _l, ...props },
    ref,
  ) {
    return React.createElement(View, { ...props, ref });
  });
  const names = [
    'FadeIn', 'FadeOut', 'FadeInDown', 'FadeOutDown', 'FadeInUp', 'FadeOutUp',
    'ZoomIn', 'ZoomOut', 'SlideOutLeft', 'SlideOutRight', 'LinearTransition',
  ];
  const Easing = { bezier: (...p) => ({ bezier: p }), linear: id };
  return {
    Easing,
    __esModule: true,
    default: { View: AnimatedView, createAnimatedComponent: id },
    createAnimatedComponent: id,
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (fn) => fn(),
    useDerivedValue: (fn) => ({ value: fn() }),
    withSpring: id,
    withTiming: id,
    withRepeat: id,
    interpolate: (v) => v,
    LayoutAnimationConfig: ({ children }) => children,
    ReduceMotion: { System: 'system', Always: 'always', Never: 'never' },
    ...Object.fromEntries(names.map((n) => [n, builder(n)])),
  };
});

// Safe-area insets without a native provider.
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
