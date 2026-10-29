import * as React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import type { NativeTypeRole } from '@nexub/tokens/native';
import { fontStyle, type FontFamily } from '../theme/fonts';
import { useTheme, type RoleName } from '../theme/ThemeProvider';

type Ramp = NonNullable<RNTextProps['dynamicTypeRamp']>;

// iOS Dynamic Type: each role follows its Apple text style's scaling curve.
const RAMP: Record<NativeTypeRole, Ramp> = {
  'display-lg': 'largeTitle',
  'display-md': 'largeTitle',
  'display-sm': 'largeTitle',
  'headline-lg': 'title1',
  'headline-md': 'title2',
  'headline-sm': 'title3',
  'title-lg': 'title3',
  'title-md': 'headline',
  'title-sm': 'subheadline',
  'body-lg': 'body',
  'body-md': 'body',
  'body-sm': 'footnote',
  'label-lg': 'subheadline',
  'label-md': 'footnote',
  'label-sm': 'caption1',
};

// Big type already reads at large sizes; cap it so it doesn't push content off
// screen. Body, title and label roles scale without a cap (WCAG 1.4.4).
const cap = (role: NativeTypeRole) =>
  role.startsWith('display') ? 1.3 : role.startsWith('headline') ? 1.6 : undefined;

export interface TextProps extends RNTextProps {
  /** Type role. @default 'body-md' */
  variant?: NativeTypeRole;
  /** Colour role. @default 'on-surface' */
  color?: RoleName;
  /** Tabular figures, for numbers that line up. */
  tabular?: boolean;
  /** Overrides the role's family (e.g. 'mono' for codes). */
  family?: FontFamily;
}

export function Text({
  variant = 'body-md',
  color = 'on-surface',
  tabular,
  family,
  style,
  ...rest
}: TextProps) {
  const { roles, tokens, fonts } = useTheme();
  const t = tokens.type[variant];
  return (
    <RNText
      dynamicTypeRamp={RAMP[variant]}
      maxFontSizeMultiplier={cap(variant)}
      style={[
        {
          ...fontStyle(family ?? t.family, t.weight, fonts),
          fontSize: t.size,
          lineHeight: t.lineHeight,
          letterSpacing: t.letterSpacing,
          color: roles[color],
        },
        tabular && { fontVariant: ['tabular-nums'] },
        style,
      ]}
      {...rest}
    />
  );
}

export interface HeadingProps extends TextProps {}

/** Text announced as a heading. @default variant 'headline-sm' */
export function Heading({ variant = 'headline-sm', ...rest }: HeadingProps) {
  return <Text accessibilityRole="header" variant={variant} {...rest} />;
}
