import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

/** The same drawings as `Illustration` in @nexub/react, by the same names. */
export type IllustrationKind =
  | 'noData'
  | 'noResults'
  | 'noAccess'
  | 'serverError'
  | 'offline'
  | 'notFound'
  | 'maintenance'
  | 'success';

export interface IllustrationProps extends Omit<ViewProps, 'children'> {
  /** Which drawing: empty (noData, noResults), noAccess, serverError, offline, notFound, maintenance or success. */
  kind: IllustrationKind;
  /** 80, 120 or 160 pt wide (5:4). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Names the drawing (an image to screen readers). Without it the drawing is decorative and hidden. */
  title?: string;
}

// Paint by role: b backdrop, a accent fill, s shape (fill + outline), l outline stroke,
// p spot stroke, d spot fill, ap accent fill with a spot stroke.
type Paint = 'b' | 'a' | 's' | 'l' | 'p' | 'd' | 'ap';
/** One shape: path data, paint, stroke width (default 2), square ends. */
type Shape = [d: string, paint: Paint, width?: number, butt?: 1];

// Rounded rectangle and circle as path data, so every shape is one <Path>.
const rect = (x: number, y: number, w: number, h: number, q: number) => {
  const c = (dx: number, dy: number) => `a${q} ${q} 0 0 1 ${dx} ${dy}`;
  return `M${x + q} ${y}h${w - 2 * q}${c(q, q)}v${h - 2 * q}${c(-q, q)}h${2 * q - w}${c(-q, -q)}v${2 * q - h}${c(q, -q)}z`;
};
const disc = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;

// The geometry mirrors packages/react/src/components/Illustration/Illustration.tsx (viewBox 120 × 96).
const ART: Record<IllustrationKind, Shape[]> = {
  noData: [
    [rect(47, 10, 26, 30, 3), 'a'],
    ['M53 17h14M53 23h9', 'p'],
    ['M30 52l10-22h40l10 22v20a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4z', 's'],
    ['M30 52h18a12 12 0 0 0 24 0h18', 'l'],
  ],
  noResults: [
    [rect(24, 30, 40, 8, 4), 's'],
    [rect(24, 48, 28, 8, 4), 's'],
    [disc(70, 46, 17), 'ap'],
    ['M82 58l12 12', 'p', 4],
    ['M64 40l12 12M76 40L64 52', 'p'],
  ],
  noAccess: [
    ['M48 44V34a12 12 0 0 1 24 0v10', 'l', 4],
    [rect(38, 44, 44, 32, 6), 'a'],
    [disc(60, 57, 4), 'd'],
    ['M60 60v7', 'p'],
  ],
  serverError: [
    [rect(28, 22, 60, 20, 5), 's'],
    [rect(28, 48, 60, 20, 5), 's'],
    ['M48 32h18M48 58h12', 'l'],
    [disc(38, 32, 2.5) + disc(38, 58, 2.5), 'd'],
    [disc(88, 68, 13), 'a'],
    ['M88 61v8', 'p', 3],
    [disc(88, 74.5, 1.75), 'd'],
  ],
  offline: [
    ['M40 64a14 14 0 0 1 2-28 20 20 0 0 1 38 4 12 12 0 0 1-2 24z', 's'],
    [disc(84, 66, 13), 'a'],
    ['M79 61l10 10M89 61L79 71', 'p', 3],
  ],
  notFound: [
    ['M40 14h26l16 16v48a4 4 0 0 1-4 4H40a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z', 's'],
    ['M66 14v16h16', 'l'],
    [disc(59, 56, 14), 'a'],
    ['M54.5 52a5 5 0 1 1 7 4.5c-1.5 1-2 2-2 3.5', 'p', 3],
    [disc(59.5, 64.5, 1.75), 'd'],
  ],
  maintenance: [
    ['M46 72l10-50h8l10 50z', 'a'],
    ['M53.5 40h13M50 56h20', 'p', 5, 1],
    [rect(34, 70, 52, 8, 4), 's'],
    ['M28 44l-7-2M30 33l-5-5M92 44l7-2M90 33l5-5', 'l'],
  ],
  success: [
    [disc(60, 48, 24), 'a'],
    ['M49 48l8 8 15-16', 'p', 4],
    ['M26 24v10M21 29h10M92 62v8M88 66h8', 'l'],
    [disc(92, 26, 2.5), 'd'],
  ],
};
const BACKDROP: Shape = ['M14 50a46 38 0 1 0 92 0a46 38 0 1 0-92 0z', 'b'];

const WIDTH = { sm: 80, md: 120, lg: 160 } as const;

/**
 * 12.3: a spot illustration for an empty, error, offline or success state, drawn with
 * react-native-svg in the theme's colour roles, so it follows light, dark, high contrast and
 * the product accent. Decorative (hidden from screen readers) unless given a `title`.
 */
export function Illustration({ kind, size = 'md', title, style, ...rest }: IllustrationProps) {
  const { roles, colors } = useTheme();
  const line = roles.outline;
  const accent = colors.spotContainer;
  const spot = colors.spot;
  const fill: Partial<Record<Paint, string>> = { b: roles['surface-container-high'], a: accent, ap: accent, s: roles['surface-container-highest'], d: spot };
  const stroke: Partial<Record<Paint, string>> = { s: line, l: line, p: spot, ap: spot };
  const w = WIDTH[size];
  const h = (w * 4) / 5;
  const a11y = title
    ? ({ accessible: true, accessibilityRole: 'image', accessibilityLabel: title } as const)
    : ({ accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' } as const);
  return (
    <View style={[{ width: w, height: h }, style]} {...a11y} {...rest}>
      <Svg width={w} height={h} viewBox="0 0 120 96">
        <G fill="none" strokeLinecap="round" strokeLinejoin="round">
          {[BACKDROP, ...ART[kind]].map(([d, p, sw = 2, butt], i) => (
            <Path key={i} d={d} fill={fill[p] ?? 'none'} stroke={stroke[p]} strokeWidth={sw} strokeLinecap={butt ? 'butt' : undefined} />
          ))}
        </G>
      </Svg>
    </View>
  );
}
