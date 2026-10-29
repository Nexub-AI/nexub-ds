import * as React from 'react';
import { ScrollView, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import { useTheme, type RoleName } from '../theme/ThemeProvider';
import type { Space } from './Layout';

export interface ScreenContainerProps extends Omit<ScrollViewProps, 'contentContainerStyle'> {
  /** Scrolls (and lets a native large title collapse). @default true */
  scroll?: boolean;
  /** Safe-area edges to pad. A native header already covers 'top'. @default ['left', 'right', 'bottom'] */
  edges?: Edge[];
  /** @default 'surface' */
  background?: RoleName;
  /** Content padding. @default '4' */
  padding?: Space;
  /** Gap between children. @default '4' */
  gap?: Space;
  contentStyle?: ViewStyle;
}

/**
 * The root of every screen: background, edge-to-edge safe-area insets and
 * content padding. With `scroll`, iOS adjusts insets itself
 * (contentInsetAdjustmentBehavior) so native large titles collapse.
 */
export function ScreenContainer({
  scroll = true,
  edges = ['left', 'right', 'bottom'],
  background = 'surface',
  padding = '4',
  gap = '4',
  contentStyle,
  children,
  style,
  ...rest
}: ScreenContainerProps) {
  const { roles, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const pad = tokens.spacing[padding];
  const inner: ViewStyle = {
    paddingTop: pad + (edges.includes('top') ? insets.top : 0),
    paddingBottom: pad + (edges.includes('bottom') ? insets.bottom : 0),
    paddingStart: pad + (edges.includes('left') ? insets.left : 0),
    paddingEnd: pad + (edges.includes('right') ? insets.right : 0),
    gap: tokens.spacing[gap],
  };
  if (!scroll) {
    return <View style={[{ flex: 1, backgroundColor: roles[background] }, inner, contentStyle, style]}>{children}</View>;
  }
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={[{ flex: 1, backgroundColor: roles[background] }, style]}
      contentContainerStyle={[inner, contentStyle]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
