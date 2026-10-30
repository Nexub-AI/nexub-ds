// Reanimated 4.7's own Jest setup needs its web build; our tests check roles,
// haptics and accessibility, not spring physics, so stub the APIs we use.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const id = (v) => v;
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: id },
    createAnimatedComponent: id,
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (fn) => fn(),
    useDerivedValue: (fn) => ({ value: fn() }),
    withSpring: id,
    withTiming: id,
    withRepeat: id,
    FadeIn: {},
    FadeOut: {},
    FadeInDown: {},
    FadeOutDown: {},
    interpolate: (v) => v,
    ReduceMotion: { System: 'system', Always: 'always', Never: 'never' },
  };
});

// Safe-area insets without a native provider.
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
