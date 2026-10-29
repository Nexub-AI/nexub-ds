import * as React from 'react';
import {
  Pressable as RNPressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableProps as RNPressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { HapticToken } from '../theme/haptics';
import { useHaptics, useTheme, type RoleName } from '../theme/ThemeProvider';

// The touchable itself animates and takes `style`, so layout props (flex,
// position, margins) apply to the element that sits in the parent's layout.
const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);
const AnimatedView = Animated.createAnimatedComponent(View);

export interface PressableProps extends Omit<RNPressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /** Haptic played on press (Apple: not for plain taps — toggles, selections, outcomes). */
  haptic?: HapticToken;
  /** On-colour of the state layer, or false for none. @default 'on-surface' */
  stateLayer?: RoleName | false;
  /** Press-scale target, or false for none. @default 0.97 */
  pressScale?: number | false;
}

/**
 * The base of every Nexub control: a state layer (on-colour at the pressed
 * opacity) and a 0.97 press-scale on the spatial-fast spring. No ripple.
 * Reduce Motion is honoured by Reanimated (ReduceMotion.System).
 */
export function Pressable({
  style,
  children,
  haptic,
  stateLayer = 'on-surface',
  pressScale = 0.97,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: PressableProps) {
  const { roles, tokens } = useTheme();
  const play = useHaptics();
  const pressed = useSharedValue(0);
  const spring = tokens.motion.spring.spatial.fast;
  const opacity = tokens.state.pressed;
  const scale = pressScale === false ? 1 : pressScale;

  const container = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - (1 - scale) * pressed.value }],
  }));
  const layer = useAnimatedStyle(() => ({ opacity: pressed.value * opacity }));
  const radius = StyleSheet.flatten(style)?.borderRadius;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={(e: GestureResponderEvent) => {
        pressed.value = withSpring(1, spring);
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        pressed.value = withSpring(0, spring);
        onPressOut?.(e);
      }}
      onPress={(e: GestureResponderEvent) => {
        if (haptic) play(haptic);
        onPress?.(e);
      }}
      style={[style, container]}
      {...rest}
    >
      {children}
      {stateLayer && (
        <AnimatedView
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: roles[stateLayer], borderRadius: radius }, layer]}
        />
      )}
    </AnimatedPressable>
  );
}
