'use client';

import * as React from 'react';
import { Check, Plus } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Chip } from '../Chip/Chip.js';
import { Combobox } from '../Combobox/Combobox.js';
import { ComboboxLoading, ComboboxPopover } from '../Combobox/ComboboxPopover.js';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  loading?: boolean;
  /** Controlled search text. */
  inputValue?: string;
  /** Called as the user types; options are then shown as given (no built-in filtering). */
  onInputChange?: (text: string) => void;
  /** Adds a "Create “text”" option when the text matches no option exactly. */
  onCreate?: (text: string) => void;
  /** Chips shown before the rest collapse into "+N more". Default 3. */
  maxVisibleChips?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * Pick several options: chips in the field, a filterable list below.
 * Backspace in an empty field removes the last chip.
 */
export function MultiSelect({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder,
  emptyText,
  loading = false,
  inputValue,
  onInputChange,
  onCreate,
  maxVisibleChips = 3,
  disabled,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: MultiSelectProps) {
  const messages = useNexubMessages();
  const [value = [], setValue] = useControllableState<string[]>({
    value: valueProp,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });
  const [innerSearch, setInnerSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const search = inputValue ?? innerSearch;
  const setSearch = (text: string) => {
    setInnerSearch(text);
    onInputChange?.(text);
  };

  // Labels for selected values, even ones no longer in `options` (async search).
  const [labels, setLabels] = React.useState<ReadonlyMap<string, string>>(() => new Map());
  const missing = options.some((o) => labels.get(o.value) !== o.label);
  if (missing) setLabels(new Map([...labels, ...options.map((o) => [o.value, o.label] as const)]));
  const labelOf = (v: string) => labels.get(v) ?? options.find((o) => o.value === v)?.label ?? v;

  const toggle = (v: string) => setValue(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const remove = (v: string) => setValue(value.filter((x) => x !== v));

  const text = search.trim();
  const canCreate =
    !!onCreate && !loading && text !== '' && !options.some((o) => o.label.toLowerCase() === text.toLowerCase());
  const hiddenCount = Math.max(0, value.length - maxVisibleChips);

  const chips = (
    <>
      {value.slice(0, maxVisibleChips).map((v) => (
        <Chip
          key={v}
          size="sm"
          onRemove={disabled ? undefined : () => remove(v)}
          removeLabel={messages.removeOption(labelOf(v))}
        >
          {labelOf(v)}
        </Chip>
      ))}
      {hiddenCount > 0 && <Chip size="sm">+{messages.moreCount(hiddenCount)}</Chip>}
    </>
  );

  return (
    <Combobox.Root
      label={ariaLabel}
      className={cn('overflow-visible rounded-none bg-transparent', className)}
      shouldFilter={!onInputChange}
    >
      <ComboboxPopover
        open={open && !disabled}
        onOpenChange={setOpen}
        before={chips}
        disabled={disabled}
        input={{
          id,
          'aria-label': ariaLabel,
          'aria-labelledby': ariaLabelledBy,
          placeholder: value.length ? undefined : (placeholder ?? messages.searchPlaceholder),
          value: search,
          onValueChange: (t) => {
            setSearch(t);
            setOpen(true);
          },
          onKeyDown: (e) => {
            if (e.key === 'Backspace' && search === '' && value.length) remove(value[value.length - 1]!);
          },
        }}
      >
        <Combobox.List aria-multiselectable="true">
          {loading ? (
            <ComboboxLoading />
          ) : (
            <>
              {!canCreate && <Combobox.Empty>{emptyText ?? messages.noResults}</Combobox.Empty>}
              {options.map((opt) => {
                const checked = value.includes(opt.value);
                return (
                  <Combobox.Item
                    key={opt.value}
                    value={opt.label}
                    keywords={[opt.value]}
                    aria-checked={checked}
                    onSelect={() => {
                      toggle(opt.value);
                      if (search) setSearch('');
                    }}
                    className="gap-2"
                  >
                    <Check size="sm" aria-hidden="true" className={cn(!checked && 'invisible')} />
                    {opt.label}
                  </Combobox.Item>
                );
              })}
              {canCreate && (
                <Combobox.Item
                  forceMount
                  // A value no search matches, so cmdk sorts it last.
                  value={'\u0000'}
                  onSelect={() => {
                    onCreate(text);
                    setSearch('');
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
      </ComboboxPopover>
    </Combobox.Root>
  );
}

MultiSelect.displayName = 'MultiSelect';
