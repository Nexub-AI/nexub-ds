// @nexub/react-native — native chrome, Nexub content (MOBILE_PLAN.md).

// Theme
export { NexubNativeProvider, useTheme, useRoles, useHaptics, useNexubMessages } from './theme/ThemeProvider';
export type { NexubNativeProviderProps, NexubTheme, Roles, RoleName, Scheme, ElevationLevel } from './theme/ThemeProvider';
export { nexubFonts, fontStyle } from './theme/fonts';
export type { FontFamily, FontSource } from './theme/fonts';
export { playHaptic } from './theme/haptics';
export type { HapticToken } from './theme/haptics';
export { useControllableState } from './hooks/useControllableState';

// Primitives
export { Text, Heading } from './primitives/Text';
export type { TextProps, HeadingProps } from './primitives/Text';
export { Pressable } from './primitives/Pressable';
export type { PressableProps } from './primitives/Pressable';
export { Surface } from './primitives/Surface';
export type { SurfaceProps, SurfaceTone, ShapeName } from './primitives/Surface';
export { Box, Stack, Inline } from './primitives/Layout';
export type { BoxProps, Space } from './primitives/Layout';
export { Icon } from './primitives/Icon';
export type { IconProps } from './primitives/Icon';
export { ScreenContainer } from './primitives/ScreenContainer';
export type { ScreenContainerProps } from './primitives/ScreenContainer';

// Shared with @nexub/react
export { defaultMessages, directionOf } from '@nexub/core';
export type { NexubMessages, Direction, ToneValue, Product, GlassMode, ContrastLevel, ControlSize } from '@nexub/core';
