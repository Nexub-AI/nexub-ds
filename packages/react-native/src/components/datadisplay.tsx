import * as React from 'react';
import { View, useWindowDimensions, type ViewProps } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { CategoryColor } from '@nexub/core';
import { Text } from '../primitives/Text';
import { fontStyle } from '../theme/fonts';
import { TABLET_MIN } from '../theme/layout';
import { useSpringValue } from '../theme/motion';
import { useTheme } from '../theme/ThemeProvider';
import { categoryPalette } from './display';

// ─── DescriptionList ─────────────────────────────────────────────────────────

export interface DescriptionListProps extends ViewProps {
  /** `inline`: label at the start, value at the end of one row. `stacked`: label above the value. @default 'inline' */
  layout?: 'inline' | 'stacked';
  /** Pairs per row. Phones always show one; from 600pt of window width, up to two. @default 1 */
  columns?: 1 | 2 | 3;
  /** A hairline between rows. */
  divided?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
}
/** The web name of the root's props. */
export type DescriptionListRootProps = DescriptionListProps;

export interface DescriptionListItemProps extends Omit<ViewProps, 'children'> {
  label: React.ReactNode;
  /** The value. */
  children?: React.ReactNode;
  /** A total: stronger label and value, and a rule above. */
  emphasis?: boolean;
  /** Where the value sits. @default 'end' in the inline layout, 'start' when stacked */
  align?: 'start' | 'end';
  /** A small muted line under the label. */
  helpText?: React.ReactNode;
}

const ListContext = React.createContext<{ layout: 'inline' | 'stacked'; size: 'sm' | 'md' }>({ layout: 'inline', size: 'md' });
const isText = (node: React.ReactNode): node is string | number => typeof node === 'string' || typeof node === 'number';

function Root({ layout = 'inline', columns = 1, divided, size = 'md', children, style, ...rest }: DescriptionListProps) {
  const { roles, tokens } = useTheme();
  const { width } = useWindowDimensions();
  const cols = columns > 1 && width >= TABLET_MIN ? 2 : 1;
  const context = React.useMemo(() => ({ layout, size }), [layout, size]);
  const items = React.Children.toArray(children);
  return (
    <ListContext.Provider value={context}>
      <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, style]} {...rest}>
        {items.map((child, i) => {
          const gutter = cols === 1 ? 0 : tokens.spacing[4];
          const hairline = divided && !(cols === 1 && i === items.length - 1);
          return (
            <View
              key={React.isValidElement(child) && child.key != null ? child.key : i}
              style={{
                width: cols === 1 ? '100%' : '50%',
                paddingStart: i % cols ? gutter : 0,
                paddingEnd: i % cols ? 0 : gutter,
              }}
            >
              <View style={hairline ? { borderBottomWidth: 1, borderBottomColor: roles['outline-variant'] } : undefined}>{child}</View>
            </View>
          );
        })}
      </View>
    </ListContext.Provider>
  );
}

function Item({ label, children, emphasis, align, helpText, style, ...rest }: DescriptionListItemProps) {
  const { roles, tokens, fonts, dir } = useTheme();
  const { layout, size } = React.useContext(ListContext);
  const stacked = layout === 'stacked';
  const atEnd = (align ?? (stacked ? 'start' : 'end')) === 'end';
  const variant = size === 'sm' ? 'body-sm' : 'body-md';
  const weight = (w: number) => fontStyle('sans', w, fonts);
  // Physical alignment of the logical end, since React Native's textAlign has no 'end'.
  const endAlign = dir === 'rtl' ? 'left' : 'right';
  return (
    <View
      // A row of plain text reads as one element: "Fee, $1.00".
      accessible={isText(label) && isText(children) ? true : undefined}
      style={[
        {
          paddingVertical: tokens.spacing[size === 'sm' ? 2 : 3],
          flexDirection: stacked ? 'column' : 'row',
          flexWrap: stacked ? 'nowrap' : 'wrap',
          alignItems: stacked ? 'stretch' : 'baseline',
          columnGap: tokens.spacing[4],
          rowGap: tokens.spacing[1],
        },
        // The rule sits on the hairline of the row above when the list is divided.
        emphasis && { marginTop: -1, borderTopWidth: 1, borderTopColor: roles.outline },
        style,
      ]}
      {...rest}
    >
      <View style={{ flexShrink: 1 }}>
        {isText(label) ? (
          <Text variant={variant} color={emphasis ? 'on-surface' : 'on-surface-muted'} style={emphasis ? weight(600) : undefined}>
            {label}
          </Text>
        ) : (
          label
        )}
        {helpText != null &&
          (isText(helpText) ? (
            <Text variant="body-sm" color="on-surface-muted">
              {helpText}
            </Text>
          ) : (
            helpText
          ))}
      </View>
      <View style={[{ flexShrink: 1 }, atEnd ? { marginStart: 'auto', alignItems: 'flex-end' } : !stacked && { flex: 1 }]}>
        {isText(children) ? (
          <Text variant={variant} tabular style={[weight(emphasis ? 600 : 500), atEnd && { textAlign: endAlign }]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

/**
 * Key–value rows (web DescriptionList): a receipt, a fee breakdown, the details
 * of a record. Plain-text rows read as one element to screen readers.
 */
export const DescriptionList = { Root, Item };

// ─── ComparisonBar ───────────────────────────────────────────────────────────

export interface ComparisonBarSide {
  /** Who or what this side is, e.g. "Team A". */
  label: string;
  value: number;
  /** A stable identity colour. With it the side keeps this colour whether it is ahead or behind. */
  color?: CategoryColor;
}

export interface ComparisonBarProps extends Omit<ViewProps, 'children'> {
  /** What is compared, e.g. "Orders". */
  label: string;
  /** The side at the inline start (the left in left-to-right text). */
  left: ComparisonBarSide;
  /** The side at the inline end. */
  right: ComparisonBarSide;
  /** @default String */
  valueFormat?: (value: number) => string;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** The two values and the label above the bar. @default true */
  showValues?: boolean;
  /** The two side labels under the bar. Turn off for every bar but one in a group. @default true */
  showLabels?: boolean;
  /** `higher`: the larger side takes the accent and the other is muted; equal values look the same. @default 'higher' */
  highlight?: 'higher' | 'none';
  /** Replaces the text alternative built from the props ("Orders: Team A 3, Team B 1"). */
  accessibilityLabel?: string;
}

/** Smallest share of the bar a side gets, in percent, so a zero is still visible. */
const MIN_SHARE = 4;

/**
 * Two values on one split bar (web ComparisonBar). The numbers are always there
 * as text and the whole thing is one image with a text alternative, so colour is
 * never the only signal. The split glides on the spatial spring.
 */
export function ComparisonBar({
  label,
  left,
  right,
  valueFormat = String,
  size = 'md',
  showValues = true,
  showLabels = true,
  highlight = 'higher',
  accessibilityLabel,
  style,
  ...rest
}: ComparisonBarProps) {
  const theme = useTheme();
  const { roles, tokens, fonts, dir } = theme;
  const l = Math.max(0, left.value) || 0;
  const r = Math.max(0, right.value) || 0;
  const share = l + r > 0 ? Math.min(100 - MIN_SHARE, Math.max(MIN_SHARE, (l / (l + r)) * 100)) : 50;
  const shown = useSpringValue(share, 'spatial', 'default');
  const startStyle = useAnimatedStyle(() => ({ flexGrow: shown.value }));
  const endStyle = useAnimatedStyle(() => ({ flexGrow: 100 - shown.value }));
  const sides = [
    { side: left, behind: highlight === 'higher' && l < r, grow: startStyle },
    { side: right, behind: highlight === 'higher' && r < l, grow: endStyle },
  ];
  const text = size === 'sm' ? 'label-sm' : 'label-md';
  const endAlign = dir === 'rtl' ? 'left' : 'right';
  const height = tokens.spacing[size === 'sm' ? '1-5' : '2-5'];
  const value = (i: 0 | 1) => (
    <Text
      variant={size === 'sm' ? 'label-md' : 'label-lg'}
      tabular
      color={sides[i]!.behind ? 'on-surface-variant' : 'on-surface'}
      style={sides[i]!.behind ? undefined : fontStyle('sans', 600, fonts)}
    >
      {valueFormat(sides[i]!.side.value)}
    </Text>
  );
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? `${label}: ${left.label} ${valueFormat(left.value)}, ${right.label} ${valueFormat(right.value)}`}
      style={[{ gap: tokens.spacing[1] }, style]}
      {...rest}
    >
      {showValues && (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: tokens.spacing[3] }}>
          {value(0)}
          <Text variant={text} color="on-surface-variant" style={{ flexShrink: 1, textAlign: 'center' }}>
            {label}
          </Text>
          {value(1)}
        </View>
      )}
      <View style={{ flexDirection: 'row', height, gap: tokens.spacing['0-5'] }}>
        {sides.map(({ side, behind, grow }, i) => (
          <Animated.View
            key={i}
            testID={i === 0 ? 'comparison-bar-start' : 'comparison-bar-end'}
            style={[
              {
                flexBasis: 0,
                borderRadius: tokens.radius.full,
                backgroundColor: side.color ? categoryPalette(theme, side.color).color : behind ? roles.outline : roles.primary,
              },
              grow,
            ]}
          />
        ))}
      </View>
      {showLabels && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: tokens.spacing[3] }}>
          <Text variant={text} color="on-surface-muted" style={{ flexShrink: 1 }}>
            {left.label}
          </Text>
          <Text variant={text} color="on-surface-muted" style={{ flexShrink: 1, textAlign: endAlign }}>
            {right.label}
          </Text>
        </View>
      )}
    </View>
  );
}
