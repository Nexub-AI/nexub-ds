import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import type { NativeTokens } from '@nexub/tokens/native';
import { useTheme, type RoleName } from '../theme/ThemeProvider';
import type { ShapeName } from './Surface';

export type Space = keyof NativeTokens['spacing'];

export interface BoxProps extends ViewProps {
  /** Padding on every side (spacing token). */
  padding?: Space;
  /** Horizontal padding (start + end, so RTL is free). */
  paddingX?: Space;
  paddingY?: Space;
  /** Gap between children. */
  gap?: Space;
  background?: RoleName;
  radius?: ShapeName;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  flex?: number;
}

function useBoxStyle({ padding, paddingX, paddingY, gap, background, radius, align, justify, flex }: BoxProps): ViewStyle {
  const { tokens, roles } = useTheme();
  const s = (k?: Space) => (k === undefined ? undefined : tokens.spacing[k]);
  return {
    padding: s(padding),
    paddingHorizontal: s(paddingX),
    paddingVertical: s(paddingY),
    gap: s(gap),
    backgroundColor: background && roles[background],
    borderRadius: radius && tokens.shape[radius],
    alignItems: align,
    justifyContent: justify,
    flex,
  };
}

export function Box({ style, ...props }: BoxProps) {
  return <View style={[useBoxStyle(props), style]} {...props} />;
}

/** Children in a column. @default gap '3' */
export function Stack({ gap = '3', style, ...props }: BoxProps) {
  return <View style={[useBoxStyle({ gap, ...props }), style]} {...props} />;
}

/** Children in a row that wraps, centred on the cross axis. @default gap '2' */
export function Inline({ gap = '2', align = 'center', style, ...props }: BoxProps) {
  return <View style={[useBoxStyle({ gap, align, ...props }), { flexDirection: 'row', flexWrap: 'wrap' }, style]} {...props} />;
}
