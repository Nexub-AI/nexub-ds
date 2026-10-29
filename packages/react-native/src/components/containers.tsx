import * as React from 'react';
import {
  Switch as RNSwitch,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { Check, ChevronDown, ChevronRight } from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Surface, type SurfaceProps } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { Divider } from './display';
import { disabledOpacity } from './shared';

// ─── Card ────────────────────────────────────────────────────────────────────

export interface CardProps extends SurfaceProps {
  /** Makes the whole card one pressable target (navigates to detail). */
  onPress?: () => void;
  /** Accessible name when pressable. */
  accessibilityLabel?: string;
}

/** Content container on a tonal tier. Hierarchy through tone, not shadow (elevation for floating cards only). */
export function Card({
  onPress,
  accessibilityLabel,
  tone = 'surface-container-low',
  radius = 'container',
  style,
  children,
  ...rest
}: CardProps) {
  const { tokens } = useTheme();
  const surface = (
    <Surface
      tone={tone}
      radius={radius}
      style={[{ padding: tokens.spacing[4], gap: tokens.spacing[2] }, style]}
      {...rest}
    >
      {children}
    </Surface>
  );
  if (!onPress) return surface;
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={{ borderRadius: tokens.shape[radius as 'container'] ?? radius }}
    >
      {surface}
    </Pressable>
  );
}

// ─── ListItem ────────────────────────────────────────────────────────────────

export type ListItemVariant =
  'static' | 'navigation' | 'switch' | 'checkbox' | 'radio' | 'button' | 'value';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  /** Icon, Avatar or flag before the text. */
  leading?: React.ReactNode;
  /** Trailing text (variant 'value' or 'navigation'), e.g. "English" or an amount. */
  value?: string;
  /** Custom trailing content (overrides the variant's). */
  trailing?: React.ReactNode;
  /** @default 'navigation' when onPress is set, else 'static' */
  variant?: ListItemVariant;
  /** For switch / checkbox / radio rows. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onPress?: () => void;
  /** Button rows: red, for destructive actions (Sign out, Delete). */
  destructive?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * One row of a list (Wise "List Item" model). The whole row is a single
 * target and a single screen-reader element: "Title, subtitle, value".
 */
export function ListItem({
  title,
  subtitle,
  leading,
  value,
  trailing,
  variant: variantProp,
  checked,
  onCheckedChange,
  onPress,
  destructive,
  disabled,
  style,
}: ListItemProps) {
  const theme = useTheme();
  const { roles, tokens, dir } = theme;
  const variant: ListItemVariant = variantProp ?? (onPress ? 'navigation' : 'static');
  const toggles = variant === 'switch' || variant === 'checkbox' || variant === 'radio';
  const press = toggles ? () => onCheckedChange?.(variant === 'radio' ? true : !checked) : onPress;
  const interactive = !!press && variant !== 'static' && variant !== 'value';
  const role = (
    {
      switch: 'switch',
      checkbox: 'checkbox',
      radio: 'radio',
      navigation: 'button',
      button: 'button',
    } as const
  )[variant as 'switch'];

  const trail =
    trailing ??
    (variant === 'switch' ? (
      <View
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <RNSwitch
          value={!!checked}
          trackColor={{ false: roles['surface-container-highest'], true: roles.primary }}
          ios_backgroundColor={roles['surface-container-highest']}
          thumbColor={roles['surface-container-lowest']}
        />
      </View>
    ) : variant === 'checkbox' || variant === 'radio' ? (
      checked ? (
        <Check size="md" color={roles.primary} />
      ) : null
    ) : variant === 'navigation' ? (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {value && (
          <Text variant="body-md" color="on-surface-variant" tabular numberOfLines={1}>
            {value}
          </Text>
        )}
        <ChevronRight
          size="sm"
          color={roles['on-surface-muted']}
          style={dir === 'rtl' ? { transform: [{ scaleX: -1 }] } : undefined}
        />
      </View>
    ) : variant === 'value' && value ? (
      <Text variant="body-md" color="on-surface-variant" tabular numberOfLines={1}>
        {value}
      </Text>
    ) : null);

  const content = (
    <View
      style={[
        {
          minHeight: subtitle ? 72 : 56,
          paddingHorizontal: tokens.spacing[4],
          paddingVertical: tokens.spacing[3],
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.spacing[3],
          opacity: disabled ? disabledOpacity(theme) : 1,
        },
        style,
      ]}
    >
      {leading}
      <View style={{ flex: 1, gap: 2, alignItems: variant === 'button' ? 'center' : 'flex-start' }}>
        <Text
          variant="body-lg"
          color={variant === 'button' ? (destructive ? 'error' : 'primary') : 'on-surface'}
        >
          {title}
        </Text>
        {subtitle && (
          <Text variant="body-sm" color="on-surface-variant">
            {subtitle}
          </Text>
        )}
      </View>
      {trail}
    </View>
  );

  const a11yLabel = [title, subtitle, variant === 'switch' || toggles ? undefined : value]
    .filter(Boolean)
    .join(', ');
  if (!interactive) {
    return (
      <View accessible accessibilityLabel={a11yLabel}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityLabel={a11yLabel}
      accessibilityState={{ disabled: !!disabled, checked: toggles ? !!checked : undefined }}
      disabled={disabled}
      haptic={
        variant === 'radio' && !checked
          ? 'selection'
          : variant === 'checkbox'
            ? 'selection'
            : undefined
      }
      onPress={press}
      pressScale={false}
    >
      {content}
    </Pressable>
  );
}

// ─── ListSection ─────────────────────────────────────────────────────────────

export interface ListSectionProps extends ViewProps {
  /** Section title above the group. */
  header?: string;
  /** Helper text below the group. */
  footer?: string;
  /** Divider inset: 16 for text rows, 56 when rows have a leading icon. @default 16 */
  inset?: number;
  children: React.ReactNode;
}

/** Inset-grouped rows on a container tier, hairlines between rows only. */
export function ListSection({
  header,
  footer,
  inset = 16,
  children,
  style,
  ...rest
}: ListSectionProps) {
  const { roles, tokens } = useTheme();
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ gap: tokens.spacing[2] }, style]} {...rest}>
      {header && (
        <Text
          variant="title-sm"
          color="on-surface-variant"
          accessibilityRole="header"
          style={{ paddingHorizontal: tokens.spacing[4] }}
        >
          {header}
        </Text>
      )}
      <View
        style={{
          borderRadius: tokens.shape.container,
          overflow: 'hidden',
          backgroundColor: roles['surface-container-lowest'],
        }}
      >
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Divider inset={inset} />}
            {row}
          </React.Fragment>
        ))}
      </View>
      {footer && (
        <Text
          variant="body-sm"
          color="on-surface-variant"
          style={{ paddingHorizontal: tokens.spacing[4] }}
        >
          {footer}
        </Text>
      )}
    </View>
  );
}

// ─── Accordion ───────────────────────────────────────────────────────────────

export interface AccordionProps {
  title: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Disclosure: a header row that shows or hides its content. */
export function Accordion({
  title,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  children,
  style,
}: AccordionProps) {
  const { roles, tokens } = useTheme();
  const [open, setOpen] = useControllableState({
    value: expanded,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
  return (
    <View style={style}>
      <Pressable
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        pressScale={false}
        style={{
          minHeight: 56,
          paddingHorizontal: tokens.spacing[4],
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.spacing[3],
        }}
      >
        <Text variant="title-md" style={{ flex: 1 }}>
          {title}
        </Text>
        <ChevronDown
          size="sm"
          color={roles['on-surface-variant']}
          style={open ? { transform: [{ rotate: '180deg' }] } : undefined}
        />
      </Pressable>
      {open && (
        <View style={{ paddingHorizontal: tokens.spacing[4], paddingBottom: tokens.spacing[4] }}>
          {children}
        </View>
      )}
    </View>
  );
}
