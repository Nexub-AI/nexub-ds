'use client';

import * as React from 'react';
import { Plus } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Combobox } from '../Combobox/Combobox.js';
import { ComboboxLoading, ComboboxPopover } from '../Combobox/ComboboxPopover.js';

export interface AutocompleteOption {
  value: string;
  label: string;
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
  /**
   * `'inline'` (default in 5.x): the list always shows under the input.
   * `'popover'`: a field whose list opens below it while typing. The default from 6.0;
   * set `mode` explicitly to keep either behaviour across the upgrade.
   */
  mode?: 'inline' | 'popover';
  /** Adds a "Create “text”" option when the text matches no option exactly. */
  onCreate?: (text: string) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
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
  mode = 'inline',
  onCreate,
  disabled,
  className,
  'aria-label': ariaLabel,
}: AutocompleteProps) {
  const messages = useNexubMessages();
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
    setInnerSearch(selectedLabel);
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
              keywords={[opt.value]}
              onSelect={() => {
                onValueChange?.(opt.value);
                setSearch(opt.label);
                setOpen(false);
              }}
            >
              {opt.label}
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
    'aria-label': ariaLabel,
    onValueChange: (t: string) => {
      setSearch(t);
      setOpen(true);
    },
  };

  if (mode === 'popover') {
    return (
      <Combobox.Root
        label={ariaLabel}
        className={cn('overflow-visible rounded-none bg-transparent', className)}
        shouldFilter={!onInputChange}
      >
        <ComboboxPopover open={open && !disabled} onOpenChange={setOpen} input={input} disabled={disabled}>
          {list}
        </ComboboxPopover>
      </Combobox.Root>
    );
  }

  return (
    <Combobox.Root label={ariaLabel} className={className} shouldFilter={!onInputChange}>
      <Combobox.Input {...input} disabled={disabled} />
      {list}
    </Combobox.Root>
  );
}

Autocomplete.displayName = 'Autocomplete';
