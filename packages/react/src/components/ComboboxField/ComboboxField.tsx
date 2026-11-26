'use client';

import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { Check, ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import {
  field,
  fieldFocusVisible,
  fieldInvalid,
  fieldReadOnly,
  type Size,
} from '../../utils/control.js';
import { COLLISION_PADDING, type SheetProp } from '../../utils/popper.js';
import { floatingSurface } from '../../utils/surface.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Combobox } from '../Combobox/Combobox.js';
import { VIRTUALIZE_ABOVE, useWindowedOptions } from '../Combobox/optionWindow.js';
import { FormField } from '../FormField/FormField.js';

/** One choice in a ComboboxField or ComboboxPicker. */
export interface ComboboxOption {
  value: string;
  label: string;
  /** A second line under the label (an email, a code, a role). Also searched. */
  description?: string;
  /** More text the option is found by (a job title, a former name, an ISO code). */
  keywords?: string[];
  disabled?: boolean;
  /** A heading the option is listed under. Groups appear in the order of their first option. */
  group?: string;
}

export interface ComboboxPickerProps {
  options: ComboboxOption[];
  /** The picked option's value; `null` (or `undefined` when uncontrolled) for none. */
  value?: string | null;
  defaultValue?: string | null;
  /** Called with the picked value, or `null` when the "none" option is picked. */
  onValueChange?: (value: string | null) => void;
  /** Shown when nothing is picked. @default 'Select…' */
  placeholder?: string;
  /** The search box's placeholder. @default 'Search…' */
  searchPlaceholder?: string;
  /** Shown when the search finds nothing. @default 'No results found.' */
  emptyText?: React.ReactNode;
  /** A first option that clears the value (`null`), labelled with this text, e.g. "No manager". */
  noneOption?: string;
  /**
   * Async search: called with the typed text (debounce on your side). While set, the list is
   * not filtered here: show what the server returned in `options`.
   */
  onSearch?: (text: string) => void;
  /** The options are loading (async search). */
  loading?: boolean;
  /**
   * 12.1: with more options than this, only the rows in view render (search, keys and screen
   * readers still see every option). @default 100
   */
  virtualizeAbove?: number;
  /**
   * The picked option when it may not be in `options` (async search: the current value's
   * label before any search has run).
   */
  selectedOption?: ComboboxOption;
  disabled?: boolean;
  /** Shows the value; the list can't open. Stays focusable. */
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** @default 'md' */
  size?: Size;
  /** @default 'auto' (a bottom sheet below 768px) */
  sheet?: SheetProp;
  /** With `name`, a hidden input carries the value, so a plain `<form>` posts it. */
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
}

const triggerSizes: Record<Size, string> = {
  sm: 'h-control-sm px-3 gap-1.5 text-body-sm',
  md: 'h-control-md px-3.5 gap-2 text-body-md',
  lg: 'h-control-lg px-4 gap-2 text-body-md',
};

/** Options under their group headings, in the order each group first appears. */
function groupOptions(
  options: ComboboxOption[],
): { heading?: string; options: ComboboxOption[] }[] {
  const groups: { heading?: string; options: ComboboxOption[] }[] = [];
  const byHeading = new Map<string | undefined, { heading?: string; options: ComboboxOption[] }>();
  for (const option of options) {
    let group = byHeading.get(option.group);
    if (!group) {
      group = { heading: option.group, options: [] };
      byHeading.set(option.group, group);
      groups.push(group);
    }
    group.options.push(option);
  }
  return groups;
}

const NONE = '\u0000none';

/**
 * 11.1: a searchable single choice that looks like a Select: a field-styled button that opens a
 * search box and a list (a bottom sheet on phones). Use it for lists longer than about ten
 * options; Select stays for short ones. `ComboboxField` adds the label, description and error.
 */
export const ComboboxPicker = React.forwardRef<HTMLButtonElement, ComboboxPickerProps>(
  function ComboboxPicker(
    {
      options,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      placeholder,
      searchPlaceholder,
      emptyText,
      noneOption,
      onSearch,
      loading,
      virtualizeAbove = VIRTUALIZE_ABOVE,
      selectedOption,
      disabled,
      readOnly,
      invalid,
      required,
      size = 'md',
      sheet = 'auto',
      name,
      id,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
    },
    ref,
  ) {
    const messages = useNexubMessages();
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [internal, setInternal] = React.useState<string | null>(defaultValue);
    const controlled = valueProp !== undefined;
    const value = controlled ? valueProp : internal;
    const picked =
      value == null
        ? undefined
        : (options.find((o) => o.value === value) ??
          (selectedOption?.value === value ? selectedOption : undefined));
    const listId = React.useId();

    const choose = (next: string | null) => {
      if (!controlled) setInternal(next);
      onValueChange?.(next);
      setOpen(false);
    };

    const onOpenChange = (next: boolean) => {
      if (readOnly && next) return;
      setOpen(next);
      if (!next && search) {
        setSearch('');
        onSearch?.('');
      }
    };

    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

    // 12.1: long lists rank here (cmdk's own scorer) and render only the rows in view. The "none"
    // option is the list's first row there too.
    const rows = React.useMemo<ComboboxOption[]>(
      () => (noneOption ? [{ value: NONE, label: noneOption }, ...options] : options),
      [noneOption, options],
    );
    const list = useWindowedOptions({
      items: rows,
      threshold: virtualizeAbove,
      search,
      filter: !onSearch,
      text: (o) => ({
        value: o.value,
        keywords: [o.label, ...(o.description ? [o.description] : []), ...(o.keywords ?? [])],
      }),
      valueOf: (o) => o.value,
      groupOf: (o) => o.group,
      disabled: (o) => !!o.disabled,
      active: open && !loading,
    });
    const renderOption = (
      o: ComboboxOption,
      aria?: { 'aria-setsize': number; 'aria-posinset': number },
    ) =>
      o.value === NONE ? (
        <Combobox.Item
          key={NONE}
          value={NONE}
          keywords={[o.label]}
          onSelect={() => choose(null)}
          {...aria}
        >
          <span className="flex-1 text-on-surface-muted">{o.label}</span>
          {value === null && <Check size="sm" aria-hidden="true" />}
        </Combobox.Item>
      ) : (
        <Combobox.Item
          key={o.value}
          value={o.value}
          keywords={[o.label, ...(o.description ? [o.description] : []), ...(o.keywords ?? [])]}
          disabled={o.disabled}
          onSelect={() => choose(o.value)}
          {...aria}
        >
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate">{o.label}</span>
            {o.description && (
              <span className="truncate text-label-sm font-normal text-on-surface-muted">
                {o.description}
              </span>
            )}
          </span>
          {o.value === value && <Check size="sm" className="shrink-0" aria-hidden="true" />}
        </Combobox.Item>
      );

    return (
      <>
        <RadixPopover.Root open={open && !readOnly} onOpenChange={onOpenChange}>
          <RadixPopover.Trigger asChild>
            <button
              ref={ref}
              id={id}
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={open ? listId : undefined}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
              aria-invalid={isInvalid || undefined}
              aria-required={required || ariaRequired || undefined}
              aria-readonly={readOnly || undefined}
              disabled={disabled}
              data-readonly={readOnly ? '' : undefined}
              data-placeholder={picked ? undefined : ''}
              onKeyDown={(e) => {
                if (readOnly && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' '))
                  e.preventDefault();
              }}
              className={cn(
                'flex w-full items-center justify-between text-start',
                triggerSizes[size],
                field,
                fieldFocusVisible,
                fieldReadOnly,
                'data-[state=open]:border-primary data-[state=open]:shadow-[inset_0_0_0_1px_var(--color-primary)]',
                'data-[placeholder]:text-on-surface-muted',
                'disabled:cursor-not-allowed disabled:border-outline-variant disabled:bg-surface-container-low disabled:text-[var(--color-text-disabled)]',
                isInvalid && fieldInvalid,
                className,
              )}
            >
              <span className="line-clamp-1">
                {picked
                  ? picked.label
                  : value == null && noneOption
                    ? noneOption
                    : (placeholder ?? messages.selectPlaceholder)}
              </span>
              <ChevronDown
                size="sm"
                className="shrink-0 text-on-surface-variant"
                aria-hidden="true"
              />
            </button>
          </RadixPopover.Trigger>
          <RadixPopover.Portal>
            <RadixPopover.Content
              align="start"
              sideOffset={4}
              collisionPadding={COLLISION_PADDING}
              data-nx-sheet={sheet || undefined}
              className={cn(
                'z-[var(--z-popover)] w-[var(--radix-popover-trigger-width)] min-w-64 overflow-hidden p-0 outline-none',
                floatingSurface,
                'nx-motion nx-pop origin-[var(--radix-popover-content-transform-origin)]',
              )}
            >
              <Combobox.Root
                label={ariaLabel ?? placeholder ?? messages.selectPlaceholder}
                shouldFilter={!onSearch && !list.windowed}
                className="bg-transparent"
                {...list.rootProps}
              >
                <Combobox.Input
                  placeholder={searchPlaceholder ?? messages.searchPlaceholder}
                  value={search}
                  onValueChange={(text) => {
                    setSearch(text);
                    onSearch?.(text);
                  }}
                  aria-controls={listId}
                  onKeyDown={list.onKeyDown}
                  size={size}
                  autoFocus
                />
                <Combobox.List id={listId} ref={list.listRef} loading={loading}>
                  <Combobox.Empty>{emptyText ?? messages.noResults}</Combobox.Empty>
                  {list.windowed ? (
                    !loading && list.render(renderOption)
                  ) : (
                    <>
                      {noneOption && renderOption({ value: NONE, label: noneOption })}
                      {groupOptions(options).map((group, gi) => {
                        const items = group.options.map((o) => renderOption(o));
                        return group.heading ? (
                          <Combobox.Group key={group.heading} heading={group.heading}>
                            {items}
                          </Combobox.Group>
                        ) : (
                          <React.Fragment key={`ungrouped-${gi}`}>{items}</React.Fragment>
                        );
                      })}
                    </>
                  )}
                </Combobox.List>
              </Combobox.Root>
            </RadixPopover.Content>
          </RadixPopover.Portal>
        </RadixPopover.Root>
        {name && <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />}
      </>
    );
  },
);

export interface ComboboxFieldProps extends Omit<ComboboxPickerProps, 'aria-labelledby'> {
  label: React.ReactNode;
  /** Help under the field. */
  description?: React.ReactNode;
  /** The error under the field; also marks the field invalid. */
  error?: React.ReactNode;
}

/**
 * 11.1: a labelled ComboboxPicker on FormField: label, description and inline error, with `id`
 * for an ErrorSummary link. Inside a `Form`, `name` also picks up the form's error.
 */
export const ComboboxField = React.forwardRef<HTMLButtonElement, ComboboxFieldProps>(
  function ComboboxField(
    { label, description, error, id, name, required, disabled, invalid, className, ...picker },
    ref,
  ) {
    return (
      <FormField.Root
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        invalid={invalid ?? (error ? true : undefined)}
        className={className}
      >
        <FormField.Label>{label}</FormField.Label>
        <FormField.Control>
          <ComboboxPicker ref={ref} name={name} {...picker} />
        </FormField.Control>
        {description && <FormField.Description>{description}</FormField.Description>}
        <FormField.Error>{error}</FormField.Error>
      </FormField.Root>
    );
  },
);
