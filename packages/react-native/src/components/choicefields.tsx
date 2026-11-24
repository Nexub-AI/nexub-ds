import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { Checkbox, Switch, type CheckboxProps, type SwitchProps } from './inputs';
import { disabledOpacity } from './shared';

// 11.8: the web ChoiceFields (11.1) on native: a control with its label, description and error.

/** The error under a choice field, announced politely when it appears. */
function FieldError({ children }: { children: string }) {
  return (
    <Text variant="body-sm" color="error" accessibilityLiveRegion="polite">
      {children}
    </Text>
  );
}

/** What screen readers say after the label: the description, then the error. */
const hintOf = (description?: string, error?: string) =>
  [description, error].filter(Boolean).join('. ') || undefined;

export interface SwitchFieldProps extends Omit<SwitchProps, 'accessibilityHint'> {
  /** Visible label, also the switch's accessible name. Pressing it toggles the switch. */
  label: string;
  /** Help under the label, read after the label by screen readers. */
  description?: string;
  /** The error under the field; also marks the switch invalid. */
  error?: string;
  /**
   * `'end'`: label first, the switch at the row's end (settings lists). `'start'`: the switch
   * first, then the label, compact for tight rows. @default 'end'
   */
  layout?: 'start' | 'end';
  style?: StyleProp<ViewStyle>;
}

/** A Switch with its label, description and error; pressing the label toggles it. */
export function SwitchField({
  label,
  description,
  error,
  layout = 'end',
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  readOnly,
  loading,
  invalid,
  size,
  style,
  ...rest
}: SwitchFieldProps) {
  const theme = useTheme();
  const { tokens } = theme;
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const locked = disabled || readOnly || loading;
  const control = (
    <Switch
      {...rest}
      label={label}
      accessibilityHint={hintOf(description, error)}
      checked={on}
      onCheckedChange={setOn}
      disabled={disabled}
      readOnly={readOnly}
      loading={loading}
      invalid={invalid ?? (error ? true : undefined)}
      size={size}
    />
  );
  // The text is a second target for the same switch, hidden from screen readers (the switch
  // carries the label and hint), like web's <label htmlFor>.
  const text = (
    <Pressable
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      disabled={locked}
      onPress={() => setOn(!on)}
      stateLayer={false}
      pressScale={false}
      style={{ flex: layout === 'end' ? 1 : undefined, flexShrink: 1, gap: tokens.spacing['0-5'] }}
    >
      <Text variant={size === 'sm' ? 'body-sm' : 'body-md'}>{label}</Text>
      {description && (
        <Text variant="body-sm" color="on-surface-variant">
          {description}
        </Text>
      )}
    </Pressable>
  );
  return (
    <View style={[{ gap: tokens.spacing[1], opacity: disabled ? disabledOpacity(theme) : 1 }, style]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: layout === 'end' ? tokens.spacing[4] : tokens.spacing[3],
        }}
      >
        {layout === 'start' ? (
          <>
            {control}
            {text}
          </>
        ) : (
          <>
            {text}
            {control}
          </>
        )}
      </View>
      {error && <FieldError>{error}</FieldError>}
    </View>
  );
}

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'accessibilityHint'> {
  /** The error under the field; also marks the checkbox invalid. */
  error?: string;
  /** At the row's end: a price, a count. */
  aside?: React.ReactNode;
}

/** A Checkbox with its label, description and error; the whole row is the target. */
export function CheckboxField({ error, aside, invalid, description, style, ...rest }: CheckboxFieldProps) {
  const { tokens } = useTheme();
  return (
    <View style={[{ gap: tokens.spacing[1] }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: tokens.spacing[3] }}>
        <Checkbox
          {...rest}
          description={description}
          accessibilityHint={hintOf(description, error)}
          invalid={invalid ?? (error ? true : undefined)}
          style={{ flex: 1 }}
        />
        {aside != null && (
          <View style={{ paddingVertical: tokens.spacing['2-5'] }}>
            {typeof aside === 'string' || typeof aside === 'number' ? (
              <Text variant="body-md" tabular>
                {aside}
              </Text>
            ) : (
              aside
            )}
          </View>
        )}
      </View>
      {error && <FieldError>{error}</FieldError>}
    </View>
  );
}

export interface CheckboxGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxGroupFieldProps {
  /** The question the choices answer; the group's accessible name. */
  label: string;
  /** Help under the label. */
  description?: string;
  /** One error for the whole group, under it; also marks every box invalid. */
  error?: string;
  options: CheckboxGroupOption[];
  /** The picked values (controlled). */
  value?: string[];
  /** The values picked at first, when `value` isn't set. */
  defaultValue?: string[];
  /** Called with the picked values, in the order they were picked. */
  onValueChange?: (value: string[]) => void;
  /** @default 'column' */
  orientation?: 'row' | 'column';
  /** Shows a required marker after the label. */
  required?: boolean;
  /** Disables every box. */
  disabled?: boolean;
  /** Every box can be read but not changed. */
  readOnly?: boolean;
  /** Box and label size of every option. @default 'md' */
  size?: CheckboxProps['size'];
  style?: StyleProp<ViewStyle>;
}

/** Several on/off choices under one question: a labelled group with one error for all. */
export function CheckboxGroupField({
  label,
  description,
  error,
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = 'column',
  required,
  disabled,
  readOnly,
  size,
  style,
}: CheckboxGroupFieldProps) {
  const { tokens } = useTheme();
  const [picked, setPicked] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });
  const toggle = (option: string, on: boolean) =>
    setPicked(on ? [...picked.filter((v) => v !== option), option] : picked.filter((v) => v !== option));
  return (
    <View
      role="group"
      accessibilityLabel={label}
      accessibilityHint={hintOf(description, error)}
      accessibilityState={{ disabled: !!disabled }}
      aria-invalid={!!error}
      style={[{ gap: tokens.spacing[2] }, style]}
    >
      <Text variant="label-lg" color="on-surface" importantForAccessibility="no">
        {label}
        {required && <Text color="error">{' *'}</Text>}
      </Text>
      {description && (
        <Text variant="body-sm" color="on-surface-variant" importantForAccessibility="no">
          {description}
        </Text>
      )}
      <View
        style={
          orientation === 'row'
            ? { flexDirection: 'row', flexWrap: 'wrap', columnGap: tokens.spacing[5] }
            : undefined
        }
      >
        {options.map((o) => (
          <Checkbox
            key={o.value}
            label={o.label}
            description={o.description}
            checked={picked.includes(o.value)}
            onCheckedChange={(on) => toggle(o.value, on)}
            disabled={disabled || o.disabled}
            readOnly={readOnly}
            invalid={error ? true : undefined}
            size={size}
          />
        ))}
      </View>
      {error && <FieldError>{error}</FieldError>}
    </View>
  );
}
