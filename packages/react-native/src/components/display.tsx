import * as React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated';
import { moneyFormatter, type ToneValue } from '@nexub/core';
import type { NativeIconProps } from '@nexub/icons/native';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { nxEnter } from '../theme/motion';
import { TONE_CONTAINERS, TONE_ROLES, TONE_TEXT } from './shared';

// ─── Amount ──────────────────────────────────────────────────────────────────

export interface AmountProps {
  /**
   * Animate value changes: the new figure rises in on the spatial spring.
   * Wraps the text in a view, so leave it off when Amount sits inside other text.
   * @default false
   */
  animate?: boolean;
  value: number;
  /** ISO 4217 code, e.g. 'USD', 'EUR', 'INR'. */
  currency: string;
  /** BCP 47 locale. @default the provider's */
  locale?: string;
  /** `display`: a hero figure in the brand face with a quieter symbol and minor units. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'display';
  /** `auto` colours gains success and losses error (use with signDisplay). @default 'neutral' */
  tone?: 'neutral' | 'auto';
  /** e.g. 'exceptZero' to show "+" on gains. */
  signDisplay?: Intl.NumberFormatOptions['signDisplay'];
  style?: StyleProp<ViewStyle>;
}

const AMOUNT_TYPE = {
  sm: 'body-sm',
  md: 'body-md',
  lg: 'title-lg',
  display: 'display-sm',
} as const;

/** Money, formatted by Intl with tabular figures. Same API as web `Amount`. */
export function Amount({
  value,
  currency,
  locale,
  size = 'md',
  tone = 'neutral',
  signDisplay,
  animate = false,
  style,
}: AmountProps) {
  const figure = (
    <AmountFigure value={value} currency={currency} locale={locale} size={size} tone={tone} signDisplay={signDisplay} style={style} />
  );
  if (!animate) return figure;
  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View key={value} entering={nxEnter('up', 'fast')} style={{ alignSelf: 'flex-start' }}>
        {figure}
      </Animated.View>
    </LayoutAnimationConfig>
  );
}

function AmountFigure({
  value,
  currency,
  locale,
  size = 'md',
  tone = 'neutral',
  signDisplay,
  style,
}: Omit<AmountProps, 'animate'>) {
  const theme = useTheme();
  const fmt = moneyFormatter(currency, locale ?? theme.locale, signDisplay ? { signDisplay } : {});
  const color = tone === 'auto' && value !== 0 ? (value > 0 ? 'success' : 'error') : 'on-surface';
  const variant = AMOUNT_TYPE[size];
  // Hermes on iOS has no formatToParts: show the hero figure as one string there.
  if (size !== 'display' || typeof fmt.formatToParts !== 'function') {
    return (
      <Text variant={variant} color={color} tabular style={style as never}>
        {fmt.format(value)}
      </Text>
    );
  }
  // Hero figure: symbol and minor units quieter, like web.
  const minor = (t: string) => t === 'currency' || t === 'decimal' || t === 'fraction';
  return (
    <Text
      variant={variant}
      color={color}
      tabular
      accessibilityLabel={fmt.format(value)}
      style={style as never}
    >
      {fmt.formatToParts(value).map((p, i) =>
        minor(p.type) ? (
          <Text key={i} variant="title-lg" color="on-surface-variant">
            {p.value}
          </Text>
        ) : (
          p.value
        ),
      )}
    </Text>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

export interface BadgeProps extends ViewProps {
  children?: string | number;
  /** @default 'neutral' */
  tone?: ToneValue;
  /** @default 'soft' */
  variant?: 'solid' | 'soft' | 'outline';
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** A status dot before the label (replaces web StatusPill). */
  dot?: boolean;
  leadingIcon?: React.ComponentType<NativeIconProps>;
}

/** Status, count or category label. Never tappable; use `Chip` for anything a user toggles. */
export function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot,
  leadingIcon: Lead,
  style,
  ...rest
}: BadgeProps) {
  const { roles, tokens } = useTheme();
  const [bg, fg] = variant === 'solid' ? TONE_ROLES[tone] : TONE_CONTAINERS[tone];
  const fgColor = variant === 'outline' ? TONE_TEXT[tone] : fg;
  const height = size === 'sm' ? 20 : 24;
  return (
    <View
      style={[
        {
          height,
          minWidth: height,
          paddingHorizontal: size === 'sm' ? 6 : 8,
          borderRadius: tokens.shape.control,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          alignSelf: 'flex-start',
          backgroundColor: variant === 'outline' ? 'transparent' : roles[bg],
        },
        variant === 'outline' && { borderWidth: 1, borderColor: roles['outline-variant'] },
        style,
      ]}
      {...rest}
    >
      {dot && (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor:
              roles[TONE_TEXT[tone] === 'on-surface-variant' ? 'outline' : TONE_TEXT[tone]],
          }}
        />
      )}
      {Lead && <Lead size="xs" color={roles[fgColor]} />}
      {children !== undefined && (
        <Text
          variant={size === 'sm' ? 'label-sm' : 'label-md'}
          color={fgColor}
          tabular
          numberOfLines={1}
        >
          {String(children)}
        </Text>
      )}
    </View>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends ViewProps {
  /** Image URL. Falls back to initials when missing or broken. */
  src?: string;
  /** Person or org name: initials and the accessible name. */
  name?: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** Online/status dot. */
  badge?: boolean;
}

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

export function Avatar({ src, name, size = 'md', badge, style, ...rest }: AvatarProps) {
  const { roles, tokens } = useTheme();
  const [broken, setBroken] = React.useState(false);
  const px = tokens.size.avatar[size];
  return (
    <View
      accessible={!!name}
      accessibilityRole={name ? 'image' : undefined}
      accessibilityLabel={name}
      style={[{ width: px, height: px }, style]}
      {...rest}
    >
      <View
        style={{
          width: px,
          height: px,
          borderRadius: px / 2,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: roles['secondary-container'],
        }}
      >
        {src && !broken ? (
          <Image
            source={{ uri: src }}
            style={StyleSheet.absoluteFill}
            onError={() => setBroken(true)}
          />
        ) : (
          <Text
            variant={px >= 48 ? 'title-md' : 'label-md'}
            color="on-secondary-container"
            style={{ fontSize: px * 0.4, lineHeight: px * 0.5 }}
            maxFontSizeMultiplier={1}
          >
            {initials(name)}
          </Text>
        )}
      </View>
      {badge && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: px / 4,
            height: px / 4,
            borderRadius: px / 8,
            backgroundColor: roles.success,
            borderWidth: 2,
            borderColor: roles.surface,
          }}
        />
      )}
    </View>
  );
}

export interface AvatarGroupProps extends ViewProps {
  children: React.ReactElement<AvatarProps>[];
  /** Avatars shown before "+N". @default 4 */
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ children, max = 4, size = 'sm', style, ...rest }: AvatarGroupProps) {
  const { roles, tokens, messages } = useTheme();
  const px = tokens.size.avatar[size];
  const shown = children.slice(0, max);
  const extra = children.length - shown.length;
  const ring = { borderWidth: 2, borderColor: roles.surface, borderRadius: px / 2 + 2 };
  return (
    <View style={[{ flexDirection: 'row' }, style]} {...rest}>
      {shown.map((child, i) => (
        <View key={i} style={[ring, i > 0 && { marginStart: -px / 3 }]}>
          {React.cloneElement(child, { size })}
        </View>
      ))}
      {extra > 0 && (
        <View
          accessible
          accessibilityLabel={messages.moreCount(extra)}
          style={[
            ring,
            {
              marginStart: -px / 3,
              width: px + 4,
              height: px + 4,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: roles['surface-container-high'],
            },
          ]}
        >
          <Text variant="label-sm" color="on-surface-variant" tabular>
            +{extra}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export interface DividerProps extends ViewProps {
  /** Indent from the start edge (aligns with list text after a leading icon). */
  inset?: number;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

/** Hairline separator. Prefer spacing and tonal tiers first (Calm Depth: remove dividers before adding them). */
export function Divider({ inset = 0, orientation = 'horizontal', style, ...rest }: DividerProps) {
  const { roles } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        orientation === 'horizontal'
          ? { height: StyleSheet.hairlineWidth, marginStart: inset, alignSelf: 'stretch' }
          : { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' },
        { backgroundColor: roles['outline-variant'] },
        style,
      ]}
      {...rest}
    />
  );
}
