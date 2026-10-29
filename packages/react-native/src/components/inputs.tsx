import * as React from 'react';
import {
  PanResponder,
  Switch as RNSwitch,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { currencySymbol, formatForEditing, parseMoney, type ControlSize } from '@nexub/core';
import {
  Check,
  Eye,
  EyeOff,
  Minus,
  Plus,
  Search,
  X,
  type NativeIconProps,
} from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { fontStyle } from '../theme/fonts';
import { useHaptics, useTheme } from '../theme/ThemeProvider';
import { IconButton } from './actions';
import { controlHeight, disabledOpacity, hitSlopFor } from './shared';

// ─── TextField ───────────────────────────────────────────────────────────────

export interface TextFieldProps extends Omit<TextInputProps, 'style' | 'editable'> {
  ref?: React.Ref<React.ComponentRef<typeof TextInput>>;
  /** Visible label above the field (also its accessible name). */
  label: string;
  /** Hint under the field. Replaced by `error` when set. */
  helperText?: string;
  /** Error message: red outline, announced, replaces the helper text. */
  error?: string;
  disabled?: boolean;
  /** @default 'lg' (48, the mobile field height) */
  size?: Extract<ControlSize, 'md' | 'lg' | 'xl'>;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Labelled text input (web Input + Label + HelperText + FormError in one). */
export function TextField({
  ref,
  label,
  helperText,
  error,
  disabled,
  size = 'lg',
  leading,
  trailing,
  style,
  multiline,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  const { roles, tokens, fonts } = theme;
  const [focused, setFocused] = React.useState(false);
  const body = tokens.type['body-lg'];
  const border = error ? roles.error : focused ? roles.primary : roles.outline;
  return (
    <View style={[{ gap: 6, opacity: disabled ? disabledOpacity(theme) : 1 }, style]}>
      <Text
        variant="label-lg"
        color={error ? 'error' : 'on-surface-variant'}
        importantForAccessibility="no"
      >
        {label}
      </Text>
      <View
        style={{
          minHeight: controlHeight(theme, size),
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          gap: 8,
          paddingHorizontal: 14,
          borderRadius: tokens.shape.field,
          borderWidth: focused || error ? 2 : 1,
          borderColor: border,
          backgroundColor: roles['surface-container-lowest'],
        }}
      >
        {leading}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={error ?? helperText}
          aria-invalid={!!error}
          editable={!disabled}
          multiline={multiline}
          placeholderTextColor={roles['on-surface-muted']}
          selectionColor={roles.primary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            ...fontStyle('sans', 400, fonts),
            fontSize: body.size,
            color: roles['on-surface'],
            paddingVertical: multiline ? 12 : 0,
            minHeight: multiline ? 96 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
          {...rest}
        />
        {trailing}
      </View>
      {(error || helperText) && (
        <Text
          variant="body-sm"
          color={error ? 'error' : 'on-surface-variant'}
          accessibilityLiveRegion={error ? 'polite' : 'none'}
        >
          {error ?? helperText}
        </Text>
      )}
    </View>
  );
}

export interface PasswordInputProps extends Omit<TextFieldProps, 'secureTextEntry' | 'trailing'> {}

/** Password field with a show/hide toggle and the platform autofill hints. */
export function PasswordInput(props: PasswordInputProps) {
  const { messages } = useTheme();
  const [visible, setVisible] = React.useState(false);
  return (
    <TextField
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="current-password"
      textContentType="password"
      trailing={
        <IconButton
          icon={visible ? EyeOff : Eye}
          label={visible ? messages.hidePassword : messages.showPassword}
          size="sm"
          onPress={() => setVisible((v) => !v)}
        />
      }
      {...props}
    />
  );
}

export interface SearchFieldProps extends Omit<TextInputProps, 'style'> {
  /** Accessible name. @default messages.search */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/** Capsule search input with a clear button. */
export function SearchField({
  label,
  value,
  defaultValue,
  onChangeText,
  style,
  ...rest
}: SearchFieldProps) {
  const theme = useTheme();
  const { roles, tokens, fonts, messages } = theme;
  const [text, setText] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onChangeText,
  });
  return (
    <View
      style={[
        {
          height: controlHeight(theme, 'md'),
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingStart: 14,
          paddingEnd: 4,
          borderRadius: tokens.shape.control,
          backgroundColor: roles['surface-container-high'],
        },
        style,
      ]}
    >
      <Search size="sm" color={roles['on-surface-variant']} />
      <TextInput
        accessibilityLabel={label ?? messages.search}
        accessibilityRole="search"
        placeholder={messages.searchPlaceholder}
        placeholderTextColor={roles['on-surface-muted']}
        selectionColor={roles.primary}
        returnKeyType="search"
        value={text}
        onChangeText={setText}
        style={{
          flex: 1,
          ...fontStyle('sans', 400, fonts),
          fontSize: tokens.type['body-md'].size,
          color: roles['on-surface'],
        }}
        {...rest}
      />
      {!!text && (
        <IconButton icon={X} label={messages.clearSearch} size="xs" onPress={() => setText('')} />
      )}
    </View>
  );
}

// ─── MoneyInput ──────────────────────────────────────────────────────────────

export interface MoneyInputProps extends Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'leading' | 'keyboardType'
> {
  currency: string;
  value?: number | null;
  defaultValue?: number | null;
  /** Parsed value (rounded to the currency's minor units), or null when empty. */
  onValueChange?: (value: number | null) => void;
  locale?: string;
}

/** Amount entry: decimal keypad, currency symbol, locale-aware parsing (de-DE "1.234,5" → 1234.5). */
export function MoneyInput({
  currency,
  value,
  defaultValue = null,
  onValueChange,
  locale,
  ...rest
}: MoneyInputProps) {
  const theme = useTheme();
  const loc = locale ?? theme.locale;
  const [amount, setAmount] = useControllableState<number | null>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [text, setText] = React.useState(
    amount == null ? '' : formatForEditing(amount, currency, loc),
  );
  React.useEffect(() => {
    // Follow outside changes without fighting the user's typing.
    if (amount !== parseMoney(text, currency, loc))
      setText(amount == null ? '' : formatForEditing(amount, currency, loc));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, currency, loc]);
  return (
    <TextField
      keyboardType="decimal-pad"
      inputMode="decimal"
      value={text}
      onChangeText={(t) => {
        setText(t);
        setAmount(parseMoney(t, currency, loc));
      }}
      leading={
        <Text variant="body-lg" color="on-surface-variant">
          {currencySymbol(currency, loc)}
        </Text>
      }
      {...rest}
    />
  );
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

export interface StepperProps {
  /** Accessible name of the value, e.g. "Guests". */
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** − value + for small counts. Adjustable with VoiceOver/TalkBack swipe up/down. */
export function Stepper({
  label,
  value,
  defaultValue = 0,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled,
  style,
}: StepperProps) {
  const { messages } = useTheme();
  const play = useHaptics();
  const [n, setN] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped !== n) {
      play('selection');
      setN(clamped);
    }
  };
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{
        now: n,
        min: Number.isFinite(min) ? min : undefined,
        max: Number.isFinite(max) ? max : undefined,
      }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) =>
        set(n + (e.nativeEvent.actionName === 'increment' ? step : -step))
      }
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'flex-start' },
        style,
      ]}
    >
      <IconButton
        icon={Minus}
        label={messages.decrement}
        variant="outlined"
        size="sm"
        disabled={disabled || n <= min}
        onPress={() => set(n - step)}
      />
      <Text variant="title-md" tabular style={{ minWidth: 32, textAlign: 'center' }}>
        {n}
      </Text>
      <IconButton
        icon={Plus}
        label={messages.increment}
        variant="outlined"
        size="sm"
        disabled={disabled || n >= max}
        onPress={() => set(n + step)}
      />
    </View>
  );
}

// ─── Checkbox / Radio ────────────────────────────────────────────────────────

export interface CheckboxProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Checkbox with its label; the whole row is the target. */
export function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  description,
  disabled,
  style,
}: CheckboxProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: on, disabled: !!disabled }}
      disabled={disabled}
      haptic={on ? 'toggleOff' : 'toggleOn'}
      onPress={() => setOn(!on)}
      stateLayer={false}
      pressScale={false}
      style={[
        {
          flexDirection: 'row',
          gap: 12,
          alignItems: 'flex-start',
          minHeight: 44,
          paddingVertical: 10,
          opacity: disabled ? disabledOpacity(theme) : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 22,
          height: 22,
          marginTop: 1,
          borderRadius: tokens.shape.min + 2,
          borderWidth: on ? 0 : 2,
          borderColor: roles.outline,
          backgroundColor: on ? roles.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {on && <Check size={16} strokeWidth={3} color={roles['on-primary']} />}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body-md">{label}</Text>
        {description && (
          <Text variant="body-sm" color="on-surface-variant">
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

interface RadioContext {
  value: string | undefined;
  select: (v: string) => void;
  disabled?: boolean;
}
const RadioCtx = React.createContext<RadioContext | null>(null);

export interface RadioGroupProps {
  /** Accessible name of the group. */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup({
  label,
  value,
  defaultValue,
  onValueChange,
  disabled,
  children,
  style,
}: RadioGroupProps) {
  const [v, setV] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onValueChange as (v: string | undefined) => void,
  });
  return (
    <RadioCtx.Provider value={{ value: v, select: setV, disabled }}>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={style}>
        {children}
      </View>
    </RadioCtx.Provider>
  );
}

export interface RadioProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Radio({ value, label, description, disabled: own }: RadioProps) {
  const theme = useTheme();
  const ctx = React.useContext(RadioCtx);
  if (!ctx) throw new Error('@nexub/react-native: <Radio> must be inside <RadioGroup>.');
  const on = ctx.value === value;
  const disabled = own || ctx.disabled;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: on, disabled: !!disabled }}
      disabled={disabled}
      haptic={on ? undefined : 'selection'}
      onPress={() => ctx.select(value)}
      stateLayer={false}
      pressScale={false}
      style={{
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        minHeight: 44,
        paddingVertical: 10,
        opacity: disabled ? disabledOpacity(theme) : 1,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          marginTop: 1,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: on ? theme.roles.primary : theme.roles.outline,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {on && (
          <View
            style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.roles.primary }}
          />
        )}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body-md">{label}</Text>
        {description && (
          <Text variant="body-sm" color="on-surface-variant">
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

// ─── Switch ──────────────────────────────────────────────────────────────────

export interface SwitchProps {
  /** Accessible name (visible label lives in the ListItem / row next to it). */
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

/** The platform switch (UISwitch / Material), coloured with Nexub roles. The OS plays its haptic. */
export function Switch({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
}: SwitchProps) {
  const { roles } = useTheme();
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  return (
    <RNSwitch
      accessibilityLabel={label}
      value={on}
      onValueChange={setOn}
      disabled={disabled}
      trackColor={{ false: roles['surface-container-highest'], true: roles.primary }}
      ios_backgroundColor={roles['surface-container-highest']}
      thumbColor={roles['surface-container-lowest']}
    />
  );
}

// ─── SegmentedControl ────────────────────────────────────────────────────────

export interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string }[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

/** 2–5 mutually exclusive views of the same content. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  style,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const [v, setV] = useControllableState<T>({
    value,
    defaultValue: defaultValue ?? options[0]!.value,
    onChange: onValueChange,
  });
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={label}
      style={[
        {
          flexDirection: 'row',
          padding: 3,
          borderRadius: tokens.shape.control,
          backgroundColor: roles['surface-container-high'],
        },
        style,
      ]}
    >
      {options.map((o) => {
        const on = o.value === v;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: on }}
            haptic={on ? undefined : 'selection'}
            onPress={() => setV(o.value)}
            stateLayer={on ? false : 'on-surface'}
            style={[
              {
                flex: 1,
                height: controlHeight(theme, 'sm') + 2,
                borderRadius: tokens.shape.control,
                alignItems: 'center',
                justifyContent: 'center',
              },
              on && {
                backgroundColor: roles['surface-container-lowest'],
                boxShadow: theme.elevation(1),
              },
            ]}
          >
            <Text
              variant="label-lg"
              color={on ? 'on-surface' : 'on-surface-variant'}
              numberOfLines={1}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Slider ──────────────────────────────────────────────────────────────────

export interface SliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Announced value text, e.g. (v) => `${v}%`. */
  formatValue?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}

/** Continuous value. Drag anywhere on the track; VoiceOver/TalkBack adjust by `step`. */
export function Slider({
  label,
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  formatValue,
  style,
}: SliderProps) {
  const theme = useTheme();
  const { roles } = theme;
  const [v, setV] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const width = React.useRef(1);
  const snap = (x: number) => {
    const raw = min + Math.min(1, Math.max(0, x / width.current)) * (max - min);
    return Math.min(max, Math.max(min, Math.round(raw / step) * step));
  };
  const current = React.useRef(v);
  current.current = v;
  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => setV(snap(e.nativeEvent.locationX)),
        onPanResponderMove: (e) => {
          const next = snap(e.nativeEvent.locationX);
          if (next !== current.current) setV(next);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, min, max, step],
  );
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: v, text: formatValue?.(v) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) =>
        setV(
          Math.min(
            max,
            Math.max(min, v + (e.nativeEvent.actionName === 'increment' ? step : -step)),
          ),
        )
      }
      onLayout={(e) => (width.current = e.nativeEvent.layout.width || 1)}
      style={[
        { height: 44, justifyContent: 'center', opacity: disabled ? disabledOpacity(theme) : 1 },
        style,
      ]}
      {...responder.panHandlers}
    >
      <View
        pointerEvents="none"
        style={{ height: 6, borderRadius: 3, backgroundColor: roles['surface-container-highest'] }}
      >
        <View
          style={{ width: `${pct}%`, height: 6, borderRadius: 3, backgroundColor: roles.primary }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          start: `${pct}%`,
          marginStart: -12,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: roles['surface-container-lowest'],
          boxShadow: theme.elevation(2),
        }}
      />
    </View>
  );
}

// ─── Chip ────────────────────────────────────────────────────────────────────

export interface ChipProps {
  label: string;
  /** Toggle state (filter chips). */
  selected?: boolean;
  onPress?: () => void;
  /** Shows a remove button (its label is messages.remove). */
  onRemove?: () => void;
  leadingIcon?: React.ComponentType<NativeIconProps>;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Capsule control: a filter, a choice or an input token. */
export function Chip({
  label,
  selected,
  onPress,
  onRemove,
  leadingIcon: Lead,
  disabled,
  style,
}: ChipProps) {
  const theme = useTheme();
  const { roles, tokens, messages } = theme;
  const height = controlHeight(theme, 'sm');
  const fg = selected ? 'on-secondary-container' : 'on-surface-variant';
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          opacity: disabled ? disabledOpacity(theme) : 1,
        },
        style,
      ]}
    >
      <Pressable
        accessibilityRole={selected === undefined ? 'button' : 'checkbox'}
        accessibilityLabel={label}
        accessibilityState={{ checked: selected, disabled: !!disabled }}
        disabled={disabled || !onPress}
        haptic={selected === undefined ? undefined : 'selection'}
        onPress={onPress}
        hitSlop={hitSlopFor(height)}
        stateLayer={fg}
        style={{
          height,
          paddingStart: 12,
          paddingEnd: onRemove ? 32 : 12,
          borderRadius: tokens.shape.control,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          borderWidth: selected ? 0 : 1,
          borderColor: roles['outline-variant'],
          backgroundColor: selected ? roles['secondary-container'] : 'transparent',
        }}
      >
        {selected ? (
          <Check size="sm" color={roles[fg]} />
        ) : (
          Lead && <Lead size="sm" color={roles[fg]} />
        )}
        <Text variant="label-lg" color={fg}>
          {label}
        </Text>
      </Pressable>
      {onRemove && (
        <IconButton
          icon={X}
          label={`${messages.remove} ${label}`}
          size="xs"
          onPress={onRemove}
          style={{ position: 'absolute', end: 4, top: (height - controlHeight(theme, 'xs')) / 2 }}
        />
      )}
    </View>
  );
}

/** A toggleable Chip (selected → check icon). */
export function FilterChip(props: ChipProps & { selected: boolean }) {
  return <Chip {...props} />;
}
