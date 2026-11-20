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
import { CATEGORY_COLORS, moneyFormatter, type CategoryColor, type ToneValue } from '@nexub/core';
import type { NativeIconProps } from '@nexub/icons/native';
import { Text } from '../primitives/Text';
import { useTheme, type NexubTheme } from '../theme/ThemeProvider';
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

// ─── Category colours (10.9, web 10.3) ───────────────────────────────────────

export interface CategoryPalette {
  /** Text or icon colour on a surface. */
  color: string;
  container: string;
  onContainer: string;
}

/** One of the eight generated hues, or `'accent'` for the product's spot accent. */
export function categoryPalette(theme: NexubTheme, category: CategoryColor): CategoryPalette {
  if (category === 'accent') {
    const { spot, spotContainer, onSpotContainer } = theme.colors;
    return { color: spot, container: spotContainer, onContainer: onSpotContainer };
  }
  return theme.tokens.color.categories[theme.scheme][category];
}

/** The same name always gets the same hue, on web and native (same hash as web Avatar), skipping 'accent'. */
export function autoCategory(name: string | undefined): CategoryColor | undefined {
  if (!name) return undefined;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return CATEGORY_COLORS[1 + (h % (CATEGORY_COLORS.length - 1))];
}

// ─── IconChip ────────────────────────────────────────────────────────────────

export interface IconChipProps extends ViewProps {
  /** Colour of the chip. `'accent'` is the product's spot accent. Without it the chip is neutral. */
  category?: CategoryColor;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default 'square' */
  shape?: 'square' | 'circle';
  /** One icon element, e.g. `<Wallet />`. It takes the chip's colour and size unless it sets its own. */
  children: React.ReactNode;
}

// [tile spacing step, icon size]: 32 / 40 / 48 with a 16 / 20 / 24 icon, as web.
const CHIP = { sm: [8, 'sm'], md: [10, 'md'], lg: [12, 'lg'] } as const;

/**
 * An icon on a tinted tile: the leading mark of a stat card, a list row or a
 * settings section. Decorative unless you give it an `accessibilityLabel`.
 */
export function IconChip({ category, size = 'md', shape = 'square', children, style, accessibilityLabel, ...rest }: IconChipProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const [step, icon] = CHIP[size];
  const side = tokens.spacing[step];
  const pal = category && categoryPalette(theme, category);
  const color = pal ? pal.onContainer : roles['on-surface-variant'];
  const glyph = React.isValidElement<NativeIconProps>(children)
    ? React.cloneElement(children, { color: children.props.color ?? color, size: children.props.size ?? icon })
    : children;
  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}
      style={[
        {
          width: side,
          height: side,
          borderRadius: shape === 'circle' ? side / 2 : tokens.shape.control,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pal ? pal.container : roles['surface-container-high'],
        },
        style,
      ]}
      {...rest}
    >
      {glyph}
    </View>
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
  /** A number to show. Above `max` it reads "99+"; screen readers get the full number. */
  count?: number;
  /** @default 99 */
  max?: number;
  leadingIcon?: React.ComponentType<NativeIconProps>;
  /** A category colour for tags and labels (one per project or team). Wins over `tone`. */
  category?: CategoryColor;
}

/** Status, count or category label. Never tappable; use `Chip` for anything a user toggles. */
export function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot,
  count,
  max = 99,
  leadingIcon: Lead,
  category,
  style,
  ...rest
}: BadgeProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const [bg, fg] = variant === 'solid' ? TONE_ROLES[tone] : TONE_CONTAINERS[tone];
  const fgColor = variant === 'outline' ? TONE_TEXT[tone] : fg;
  // Category (as web): solid and soft share the container pair; outline is the text colour with a 50% border.
  const cat = category && categoryPalette(theme, category);
  const catFg = cat && (variant === 'outline' ? cat.color : cat.onContainer);
  const catText = catFg ? { color: catFg } : undefined;
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
          gap: tokens.spacing[1],
          alignSelf: 'flex-start',
          backgroundColor: variant === 'outline' ? 'transparent' : cat ? cat.container : roles[bg],
        },
        variant === 'outline' && { borderWidth: 1, borderColor: cat ? cat.color + '80' : roles['outline-variant'] },
        style,
      ]}
      {...rest}
    >
      {dot && (
        <View
          style={{
            width: tokens.spacing['1-5'],
            height: tokens.spacing['1-5'],
            borderRadius: tokens.spacing['1-5'] / 2,
            backgroundColor:
              catFg ?? roles[TONE_TEXT[tone] === 'on-surface-variant' ? 'outline' : TONE_TEXT[tone]],
          }}
        />
      )}
      {Lead && <Lead size="xs" color={catFg ?? roles[fgColor]} />}
      {children !== undefined && (
        <Text
          variant={size === 'sm' ? 'label-sm' : 'label-md'}
          color={fgColor}
          tabular
          numberOfLines={1}
          style={catText}
        >
          {String(children)}
        </Text>
      )}
      {count != null && (
        <Text
          variant={size === 'sm' ? 'label-sm' : 'label-md'}
          color={fgColor}
          tabular
          numberOfLines={1}
          style={catText}
          accessibilityLabel={String(count)}
        >
          {count > max ? `${max}+` : String(count)}
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
  /** Presence dot; its name is added to the accessible label ("Ada Lovelace, Away"). */
  status?: AvatarStatus;
  /**
   * Colour of the initials fallback. `'auto'` picks a stable colour from `name`,
   * the same one the web Avatar picks. Without it the avatar is neutral.
   */
  category?: CategoryColor | 'auto';
}

export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

const STATUS_ROLE = { online: 'success', away: 'warning', busy: 'error', offline: 'outline' } as const;

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

export function Avatar({ src, name, size = 'md', badge, status, category: categoryProp, style, ...rest }: AvatarProps) {
  const theme = useTheme();
  const { roles, tokens, messages } = theme;
  const category = categoryProp === 'auto' ? autoCategory(name) : categoryProp;
  const cat = category && categoryPalette(theme, category);
  const label = [name, status && messages.presence[status]].filter(Boolean).join(', ') || undefined;
  const [broken, setBroken] = React.useState(false);
  const px = tokens.size.avatar[size];
  return (
    <View
      accessible={!!label}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
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
          backgroundColor: cat ? cat.container : roles['secondary-container'],
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
            style={[{ fontSize: px * 0.4, lineHeight: px * 0.5 }, cat && { color: cat.onContainer }]}
            maxFontSizeMultiplier={1}
          >
            {initials(name)}
          </Text>
        )}
      </View>
      {(badge || status) && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: px / 4,
            height: px / 4,
            borderRadius: px / 8,
            backgroundColor: roles[status ? STATUS_ROLE[status] : 'success'],
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
