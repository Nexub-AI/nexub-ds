'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Switch, type SwitchProps } from '../Switch/Switch.js';
import { Checkbox, type CheckboxProps } from '../Checkbox/Checkbox.js';
import { Label, labelVariants } from '../Label/Label.js';
import { HelperText } from '../HelperText/HelperText.js';
import { FormError } from '../FormError/FormError.js';

interface ChoiceFieldText {
  label: React.ReactNode;
  /** Help under the label. */
  description?: React.ReactNode;
  /** The error under the field; also marks the control invalid. */
  error?: React.ReactNode;
}

/** Ids for the control, its description and its error, wired into aria-describedby. */
function useChoiceIds(idProp: string | undefined, description: React.ReactNode, error: React.ReactNode, describedBy?: string) {
  const own = React.useId();
  const id = idProp ?? own;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const ariaDescribedBy = [describedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  return { id, descriptionId, errorId, ariaDescribedBy };
}

export interface SwitchFieldProps extends Omit<SwitchProps, 'children'>, ChoiceFieldText {
  /**
   * `'end'`: label first, the switch at the row's end (settings lists). `'start'`: the switch
   * first, then the label, compact for tight rows and headings. @default 'end'
   */
  layout?: 'start' | 'end';
}

/** 11.1: a Switch with its label, description and error, the label clickable. */
export const SwitchField = React.forwardRef<HTMLButtonElement, SwitchFieldProps>(function SwitchField(
  { label, description, error, layout = 'end', id: idProp, size, disabled, invalid, className, 'aria-describedby': describedBy, ...props },
  ref,
) {
  const { id, descriptionId, errorId, ariaDescribedBy } = useChoiceIds(idProp, description, error, describedBy);
  const control = (
    <Switch
      ref={ref}
      id={id}
      size={size}
      disabled={disabled}
      invalid={invalid ?? (error ? true : undefined)}
      aria-describedby={ariaDescribedBy}
      className={cn('shrink-0', layout === 'start' && size !== 'sm' && 'mt-px')}
      {...props}
    />
  );
  const text = (
    <span className={cn('flex min-w-0 flex-col gap-0.5', layout === 'end' && 'flex-1')}>
      <Label htmlFor={id} disabled={disabled} className={cn('font-normal', size === 'sm' ? 'text-body-sm' : 'text-body-md', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
        {label}
      </Label>
      {description && <HelperText id={descriptionId}>{description}</HelperText>}
    </span>
  );
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className={cn('flex items-start', layout === 'end' ? 'justify-between gap-4' : 'gap-3')}>
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
      </div>
      {error && <FormError id={errorId}>{error}</FormError>}
    </div>
  );
});

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'children'>, ChoiceFieldText {
  /** At the row's end: a price, a count. */
  aside?: React.ReactNode;
}

/**
 * 11.1: a Checkbox with its label, description and error, the label clickable. `checked` takes
 * `'indeterminate'` for a parent of a partly picked list.
 */
export const CheckboxField = React.forwardRef<HTMLButtonElement, CheckboxFieldProps>(function CheckboxField(
  { label, description, error, aside, id: idProp, size, disabled, invalid, className, 'aria-describedby': describedBy, ...props },
  ref,
) {
  const { id, descriptionId, errorId, ariaDescribedBy } = useChoiceIds(idProp, description, error, describedBy);
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-start gap-2.5">
        <Checkbox
          ref={ref}
          id={id}
          size={size}
          disabled={disabled}
          invalid={invalid ?? (error ? true : undefined)}
          aria-describedby={ariaDescribedBy}
          className="mt-0.5"
          {...props}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Label htmlFor={id} disabled={disabled} className={cn('font-normal', size === 'sm' ? 'text-body-sm' : 'text-body-md', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
            {label}
          </Label>
          {description && <HelperText id={descriptionId}>{description}</HelperText>}
        </span>
        {aside && <span className="shrink-0 text-body-md tabular-nums text-on-surface">{aside}</span>}
      </div>
      {error && <FormError id={errorId}>{error}</FormError>}
    </div>
  );
});

export interface CheckboxGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupFieldProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'>, ChoiceFieldText {
  options: CheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** @default 'column' */
  orientation?: 'row' | 'column';
  required?: boolean;
  readOnly?: boolean;
  /** Each box's `name`: picked values post with a plain `<form>` as repeated fields. */
  name?: string;
}

/** 11.1: several on/off choices under one question: a fieldset with its legend and one error for all. */
export const CheckboxGroupField = React.forwardRef<HTMLFieldSetElement, CheckboxGroupFieldProps>(function CheckboxGroupField(
  { label, description, error, options, value: valueProp, defaultValue, onValueChange, orientation = 'column', required, disabled, readOnly, name, id: idProp, className, ...props },
  ref,
) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? internal;
  const { id, descriptionId, errorId, ariaDescribedBy } = useChoiceIds(idProp, description, error);
  const toggle = (option: string, on: boolean) => {
    const next = on ? [...value.filter((v) => v !== option), option] : value.filter((v) => v !== option);
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <fieldset
      ref={ref}
      id={id}
      disabled={disabled}
      aria-describedby={ariaDescribedBy}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      className={cn('m-0 flex min-w-0 flex-col gap-2 border-0 p-0', className)}
      {...props}
    >
      <legend className={cn('mb-1 p-0 text-on-surface', labelVariants({ disabled }))}>
        {label}
        {required && (
          <span aria-hidden="true" className="leading-none text-error">
            *
          </span>
        )}
      </legend>
      {description && <HelperText id={descriptionId} className="-mt-1">{description}</HelperText>}
      <div className={cn('flex gap-x-5 gap-y-2', orientation === 'row' ? 'flex-wrap' : 'flex-col')}>
        {options.map((o) => (
          <CheckboxField
            key={o.value}
            label={o.label}
            description={o.description}
            name={name}
            value={o.value}
            checked={value.includes(o.value)}
            disabled={disabled || o.disabled}
            readOnly={readOnly}
            invalid={error ? true : undefined}
            onCheckedChange={(on) => toggle(o.value, on === true)}
          />
        ))}
      </div>
      {error && <FormError id={errorId}>{error}</FormError>}
    </fieldset>
  );
});
