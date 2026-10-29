import * as React from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import type { NativeTokens } from '@nexub/tokens/native';
import { useTheme, type ElevationLevel, type RoleName } from '../theme/ThemeProvider';

// Optional peer: native Liquid Glass on iOS 26+. Everything else gets the solid fallback.
let Glass: typeof import('expo-glass-effect') | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional peer, must not fail when absent
  Glass = require('expo-glass-effect');
} catch {
  Glass = undefined;
}
const liquidGlass = Platform.OS === 'ios' && !!Glass?.isLiquidGlassAvailable();

export type SurfaceTone = Extract<RoleName, `surface${string}`>;
export type ShapeName = keyof NativeTokens['shape'];

export interface SurfaceProps extends ViewProps {
  /** Tonal tier. @default 'surface' */
  tone?: SurfaceTone;
  /** @default 0 */
  elevation?: ElevationLevel;
  /** 'glass' is for the control layer only (bars, floating controls), never content. @default 'solid' */
  material?: 'solid' | 'glass';
  /** Corner radius: a shape token or dp. */
  radius?: ShapeName | number;
}

/**
 * A tonal surface. `material="glass"` is native Liquid Glass on iOS 26+, and
 * `surface-elevated` + hairline elsewhere, or whenever glass is 'off' (user
 * setting or Reduce Transparency).
 */
export function Surface({ tone = 'surface', elevation = 0, material = 'solid', radius, style, ...rest }: SurfaceProps) {
  const theme = useTheme();
  const borderRadius = typeof radius === 'string' ? theme.tokens.shape[radius] : radius;
  const glass = material === 'glass' && theme.glass !== 'off';

  if (glass && liquidGlass && Glass) {
    return (
      <Glass.GlassView
        glassEffectStyle={theme.glass === 'clear' ? 'clear' : 'regular'}
        tintColor={theme.glass === 'tinted' ? theme.roles['surface-elevated'] : undefined}
        colorScheme={theme.scheme}
        style={[{ borderRadius, boxShadow: theme.elevation(elevation) }, style]}
        {...rest}
      />
    );
  }
  return (
    <View
      style={[
        {
          backgroundColor: theme.roles[material === 'glass' ? 'surface-elevated' : tone],
          borderRadius,
          boxShadow: theme.elevation(elevation),
        },
        material === 'glass' && { borderWidth: StyleSheet.hairlineWidth, borderColor: theme.roles['outline-variant'] },
        style,
      ]}
      {...rest}
    />
  );
}
