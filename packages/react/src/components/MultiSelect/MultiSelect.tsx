'use client';

import * as React from 'react';
import { Check, Plus } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';
import type { SheetProp } from '../../utils/popper.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Chip } from '../Chip/Chip.js';
import { Combobox } from '../Combobox/Combobox.js';
import { ComboboxLoading, ComboboxPopover } from '../Combobox/ComboboxPopover.js';
import { VIRTUALIZE_ABOVE, useWindowedOptions } from '../Combobox/optionWindow.js';

export interface MultiSelectOption {
  value: string;
  label: string;
  /** 11.2: a second line under the label (an email, a role). Also searched. */
  description?: string;
  /** 11.2: listed but can't be picked (a chip already picked stays removable). */
  disabled?: boolean;
  /** 11.2: shown before the label in the list and on the chip, e.g. `<Avatar size="xs" … />` for people. */
  avatar?: React.ReactNode;
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
  /**
   * 11.2: async search, the same as `onInputChange` (named as on ComboboxField): called with the
   * typed text; show what the server returned in `options` and set `loading` meanwhile. Picked
   * values keep their labels and avatars when they drop out of `options`.
   */
  onSearch?: (text: string) => void;
  /** Adds a "Create “text”" option when the text matches no option exactly. */
  onCreate?: (text: string) => void;
  /**
   * 12.1: with more options than this, only the rows in view render (search, keys and screen
   * readers still see every option). @default 100
   */
  virtualizeAbove?: number;
  /** Chips shown before the rest collapse into "+N more". Default 3. */
  maxVisibleChips?: number;
  disabled?: boolean;
  /** Shows the chips but nothing can be added or removed; stays focusable. */
  readOnly?: boolean;
  /** @default 'md' */
  size?: Size;
  /** `true`: bottom sheet. `'auto'`: bottom sheet below the `md` breakpoint, a popover above. @default 'auto' (pass `sheet={false}` to keep a popover on small screens) */
  sheet?: SheetProp;
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
  onInputChange: onInputChangeProp,
  onSearch,
  onCreate,
  maxVisibleChips = 3,
  virtualizeAbove = VIRTUALIZE_ABOVE,
  disabled,
  readOnly,
  size,
  sheet,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: MultiSelectProps) {
  const messages = useNexubMessages();
  const onInputChange =
    onInputChangeProp || onSearch
      ? (text: string) => {
          onInputChangeProp?.(text);
          onSearch?.(text);
        }
      : undefined;
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
  const [known, setKnown] = React.useState<ReadonlyMap<string, MultiSelectOption>>(() => new Map());
  const missing = options.some((o) => known.get(o.value) !== o);
  if (missing) setKnown(new Map([...known, ...options.map((o) => [o.value, o] as const)]));
  const optionOf = (v: string) => options.find((o) => o.value === v) ?? known.get(v);
  const labelOf = (v: string) => optionOf(v)?.label ?? v;

  const toggle = (v: string) =>
    setValue(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const remove = (v: string) => setValue(value.filter((x) => x !== v));

  const text = search.trim();
  const canCreate =
    !!onCreate &&
    !loading &&
    text !== '' &&
    !options.some((o) => o.label.toLowerCase() === text.toLowerCase());
  const hiddenCount = Math.max(0, value.length - maxVisibleChips);

  // 12.1: long lists rank here (cmdk's own scorer) and render only the rows in view.
  const list = useWindowedOptions({
    items: options,
    threshold: virtualizeAbove,
    search,
    filter: !onInputChange,
    text: (o) => ({
      value: o.label,
      keywords: o.description ? [o.value, o.description] : [o.value],
    }),
    valueOf: (o) => o.value,
    disabled: (o) => !!o.disabled,
    active: open && !loading,
  });

  const renderOption = (
    opt: MultiSelectOption,
    aria?: { 'aria-setsize': number; 'aria-posinset': number },
  ) => {
    const checked = value.includes(opt.value);
    return (
      <Combobox.Item
        key={opt.value}
        // A windowed row is found by its value (unique); otherwise cmdk filters on the label.
        value={list.windowed ? opt.value : opt.label}
        keywords={opt.description ? [opt.value, opt.description] : [opt.value]}
        disabled={opt.disabled}
        aria-checked={checked}
        {...aria}
        onSelect={() => {
          toggle(opt.value);
          if (search) setSearch('');
        }}
        className="gap-2"
      >
        <Check size="sm" aria-hidden="true" className={cn('shrink-0', !checked && 'invisible')} />
        {opt.avatar}
        {opt.description ? (
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate">{opt.label}</span>
            <span className="truncate text-label-sm font-normal text-on-surface-muted">
              {opt.description}
            </span>
          </span>
        ) : (
          opt.label
        )}
      </Combobox.Item>
    );
  };

  const chips = (
    <>
      {value.slice(0, maxVisibleChips).map((v) => (
        <Chip
          key={v}
          size="sm"
          onRemove={disabled || readOnly ? undefined : () => remove(v)}
          removeLabel={messages.removeOption(labelOf(v))}
        >
          {optionOf(v)?.avatar ? (
            <span className="inline-flex items-center gap-1.5">
              {optionOf(v)!.avatar}
              {labelOf(v)}
            </span>
          ) : (
            labelOf(v)
          )}
        </Chip>
      ))}
      {hiddenCount > 0 && <Chip size="sm">+{messages.moreCount(hiddenCount)}</Chip>}
    </>
  );

  return (
    <Combobox.Root
      label={ariaLabel}
      className={cn('overflow-visible rounded-none bg-transparent', className)}
      shouldFilter={!onInputChange && !list.windowed}
      {...list.rootProps}
    >
      <ComboboxPopover
        open={open && !disabled}
        onOpenChange={setOpen}
        before={chips}
        disabled={disabled}
        readOnly={readOnly}
        size={size}
        sheet={sheet}
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
            if (open) list.onKeyDown(e);
            if (
              e.key === 'Backspace' &&
              !readOnly &&
              !(e.nativeEvent.isComposing || e.keyCode === 229) &&
              search === '' &&
              value.length
            )
              remove(value[value.length - 1]!);
          },
        }}
      >
        <Combobox.List aria-multiselectable="true" ref={list.listRef}>
          {loading ? (
            <ComboboxLoading />
          ) : (
            <>
              {!canCreate && <Combobox.Empty>{emptyText ?? messages.noResults}</Combobox.Empty>}
              {list.windowed ? list.render(renderOption) : options.map((opt) => renderOption(opt))}
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
