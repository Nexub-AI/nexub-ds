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
      for (const key of ['springify', 'stiffness', 'damping', 'mass', 'reduceMotion', 'duration', 'delay']) {
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
  return {
    __esModule: true,
    default: { View: AnimatedView, createAnimatedComponent: id },
    createAnimatedComponent: id,
    // Stable across renders, like the real hook (effects list shared values as deps).
    useSharedValue: (value) => React.useState(() => ({ value }))[0],
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

// react-native exposes Modal, KeyboardAvoidingView, PanResponder and ScrollView as
// lazy getters: the first access requires (and, on a cold Jest cache, Babel-
// transforms) the whole module graph, ~0.6s locally and several seconds on a busy
// CI runner. That landed inside whichever test first opened a sheet ("Select: opens
// a sheet" hit the 5s timeout). Load them here, outside any test's timeout.
{
  const RN = require('react-native');
  void [RN.Modal, RN.KeyboardAvoidingView, RN.PanResponder, RN.ScrollView, RN.FlatList];
}
