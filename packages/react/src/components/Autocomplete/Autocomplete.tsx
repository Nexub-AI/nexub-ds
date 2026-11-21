'use client';

import * as React from 'react';
import { Plus, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { pressable, type Size } from '../../utils/control.js';
import type { SheetProp } from '../../utils/popper.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Combobox } from '../Combobox/Combobox.js';
import { ComboboxLoading, ComboboxPopover } from '../Combobox/ComboboxPopover.js';
import { labelVariants } from '../Label/Label.js';

export interface AutocompleteOption {
  value: string;
  label: string;
  /** 11.2: a second line under the label (an email, a code). Also searched. */
  description?: string;
  /** 11.2 */
  disabled?: boolean;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  loading?: boolean;
  /** Controlled input text. */
  inputValue?: string;
  /**
   * Called as the user types. When set, the options are taken as already
   * filtered (fetched for this text), so the built-in filtering is off.
   */
  onInputChange?: (text: string) => void;
  /** Adds a "Create “text”" option when the text matches no option exactly. */
  onCreate?: (text: string) => void;
  disabled?: boolean;
  /** Shows the value but it can't be changed; stays focusable. */
  readOnly?: boolean;
  /** @default 'md' */
  size?: Size;
  /** `true`: bottom sheet. `'auto'`: bottom sheet below the `md` breakpoint, a popover above. @default 'auto' (pass `sheet={false}` to keep a popover on small screens) */
  sheet?: SheetProp;
  className?: string;
  'aria-label'?: string;
  /** 11.2: a visible label above the field. */
  label?: React.ReactNode;
  /** 11.2: the input's id (the label points at it). */
  id?: string;
  /**
   * 11.2: "add" mode: after a pick the text empties and the field is ready for the next one
   * (add a person, add a tag). The value stays yours to keep in a list.
   */
  clearOnSelect?: boolean;
  /**
   * 11.2: called when the person clears the field (the clear button, or deleting all the text) so
   * the page can drop the value. With it, a clear button shows while there is text.
   */
  onClear?: () => void;
}

export function Autocomplete({
  options,
  value,
  onValueChange,
  placeholder,
  emptyText,
  loading = false,
  inputValue,
  onInputChange,
  onCreate,
  disabled,
  readOnly,
  size,
  sheet,
  className,
  'aria-label': ariaLabel,
  label,
  id: idProp,
  clearOnSelect,
  onClear,
}: AutocompleteProps) {
  const messages = useNexubMessages();
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const labelId = `${id}-label`;
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';
  // Input text. Follows the selected option's label when `value` changes from
  // outside (adjusted during render, not in an effect).
  const [innerSearch, setInnerSearch] = React.useState(selectedLabel);
  const [prevValue, setPrevValue] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const search = inputValue ?? innerSearch;
  const setSearch = (text: string) => {
    setInnerSearch(text);
    onInputChange?.(text);
  };
  if (value !== prevValue) {
    setPrevValue(value);
    setInnerSearch(clearOnSelect ? '' : selectedLabel);
  }

  const text = search.trim();
  const canCreate =
    !!onCreate && !loading && text !== '' && !options.some((o) => o.label.toLowerCase() === text.toLowerCase());

  const list = (
    <Combobox.List>
      {loading ? (
        <ComboboxLoading />
      ) : (
        <>
          {!canCreate && <Combobox.Empty>{emptyText ?? messages.noResults}</Combobox.Empty>}
          {options.map((opt) => (
            <Combobox.Item
              key={opt.value}
              // cmdk filters on `value`, so match the visible label (id as keyword).
              value={opt.label}
              keywords={opt.description ? [opt.value, opt.description] : [opt.value]}
              disabled={opt.disabled}
              onSelect={() => {
                onValueChange?.(opt.value);
                setSearch(clearOnSelect ? '' : opt.label);
                setOpen(false);
              }}
            >
              {opt.description ? (
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{opt.label}</span>
                  <span className="truncate text-label-sm font-normal text-on-surface-muted">{opt.description}</span>
                </span>
              ) : (
                opt.label
              )}
            </Combobox.Item>
          ))}
          {canCreate && (
            <Combobox.Item
              forceMount
              // A value no search matches, so cmdk sorts it last.
              value={'\u0000'}
              onSelect={() => {
                onCreate(text);
                setOpen(false);
              }}
              className="gap-2"
            >
              <Plus size="sm" aria-hidden="true" />
              {messages.createOption(text)}
            </Combobox.Item>
          )}
        </>
      )}
    </Combobox.List>
  );

  const input = {
    placeholder: placeholder ?? messages.searchPlaceholder,
    value: search,
    id,
    'aria-label': label ? undefined : ariaLabel,
    'aria-labelledby': label ? labelId : undefined,
    onValueChange: (t: string) => {
      setSearch(t);
      setOpen(true);
      if (t === '' && search !== '') onClear?.();
    },
  };

  const clearButton =
    onClear && search !== '' && !disabled && !readOnly ? (
      <button
        type="button"
        aria-label={messages.clear}
        className={cn(pressable, '-me-1.5 inline-flex h-6 w-6 shrink-0 items-center justify-center text-on-surface-variant')}
        onClick={() => {
          setSearch('');
          onClear();
        }}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    ) : null;

  const field = (
    <Combobox.Root
      label={label ? undefined : ariaLabel}
      className={cn('overflow-visible rounded-none bg-transparent', !label && className)}
      shouldFilter={!onInputChange}
    >
      <ComboboxPopover open={open && !disabled} onOpenChange={setOpen} input={input} after={clearButton} disabled={disabled} readOnly={readOnly} size={size} sheet={sheet}>
        {list}
      </ComboboxPopover>
    </Combobox.Root>
  );
  if (!label) return field;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label id={labelId} htmlFor={id} className={labelVariants({ disabled })}>
        {label}
      </label>
      {field}
    </div>
  );
}

Autocomplete.displayName = 'Autocomplete';
