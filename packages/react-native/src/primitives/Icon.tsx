import * as React from 'react';
import type { NativeIconProps } from '@nexub/icons/native';
import { useTheme, type RoleName } from '../theme/ThemeProvider';

export interface IconProps extends Omit<NativeIconProps, 'color'> {
  /** An icon from `@nexub/icons/native`, e.g. `Search`. */
  icon: React.ComponentType<NativeIconProps>;
  /** Colour role. @default 'on-surface-variant' */
  color?: RoleName;
}

/** An `@nexub/icons/native` icon coloured by a role. Decorative unless `label` is set. */
export function Icon({ icon: Glyph, color = 'on-surface-variant', ...rest }: IconProps) {
  return <Glyph color={useTheme().roles[color]} {...rest} />;
}
