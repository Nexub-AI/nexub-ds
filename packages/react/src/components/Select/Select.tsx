'use client';

import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible, fieldInvalid } from '../../utils/control.js';
import { floatingSurface, menuLabel, menuSeparator } from '../../utils/surface.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { IconButton } from '../IconButton/IconButton.js';

interface SelectContextValue {
  clearable: boolean;
  hasValue: boolean;
  clear: () => void;
  query: string;
  setQuery: (query: string) => void;
}
const SelectContext = React.createContext<SelectContextValue>({
  clearable: false,
  hasValue: false,
  clear: () => {},
  query: '',
  setQuery: () => {},
});

export interface SelectRootProps extends RadixSelect.SelectProps {
  /** Shows a clear button on the Trigger while there is a value; clearing calls `onValueChange('')` and shows the placeholder. */
  clearable?: boolean;
}

const Root = ({ clearable = false, value, defaultValue, onValueChange, onOpenChange, ...props }: SelectRootProps) => {
  const [current, setCurrent] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const [query, setQuery] = React.useState('');
  const ctx = React.useMemo(
    () => ({ clearable, hasValue: Boolean(current), clear: () => setCurrent(''), query, setQuery }),
    [clearable, current, setCurrent, query],
  );
  return (
    <SelectContext.Provider value={ctx}>
      <RadixSelect.Root
        {...props}
        // Clearing needs the value in our hands; otherwise Radix keeps its own state as before.
        {...(clearable ? { value: current ?? '', onValueChange: setCurrent } : { value, defaultValue, onValueChange })}
        onOpenChange={(open) => {
          if (!open) setQuery('');
          onOpenChange?.(open);
        }}
      />
    </SelectContext.Provider>
  );
};
Root.displayName = 'Select.Root';
const Group = RadixSelect.Group;
const Value = RadixSelect.Value;

const Trigger = React.forwardRef<HTMLButtonElement, RadixSelect.SelectTriggerProps & { invalid?: boolean }>(
  ({ className, children, invalid, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    const messages = useNexubMessages();
    const innerRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRefs(ref, innerRef);
    const showClear = ctx.clearable && ctx.hasValue && !props.disabled;
    const trigger = (
      <RadixSelect.Trigger
        ref={mergedRef}
        className={cn(
          'flex h-control-md w-full items-center justify-between gap-2 px-3.5 text-body-md',
          field,
          fieldFocusVisible,
          // Open reads like focus: the 2px primary border.
          'data-[state=open]:border-[var(--color-primary)] data-[state=open]:shadow-[inset_0_0_0_1px_var(--color-primary)]',
          'data-[placeholder]:text-[var(--color-on-surface-muted)]',
          'disabled:cursor-not-allowed disabled:border-[var(--color-outline-variant)] disabled:bg-[var(--color-surface-container-low)] disabled:text-[var(--color-text-disabled)]',
          invalid && fieldInvalid,
          '[&>span]:line-clamp-1',
          className,
        )}
        {...props}
      >
        {children}
        {/* Room for the clear button, which sits over this spot outside the trigger (no button in a button). */}
        {showClear && <span aria-hidden="true" className="ms-auto w-control-xs shrink-0" />}
        <RadixSelect.Icon asChild>
          <ChevronDown size="sm" className="shrink-0 text-[var(--color-on-surface-variant)]" aria-hidden="true" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
    );
    if (!ctx.clearable) return trigger;
    return (
      <div className="relative w-full">
        {trigger}
        {showClear && (
          <IconButton
            size="xs"
            label={messages.clearSelection}
            className="absolute end-9.5 top-1/2 -translate-y-1/2"
            onClick={() => {
              ctx.clear();
              innerRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        )}
      </div>
    );
  },
);
Trigger.displayName = 'Select.Trigger';

const ScrollUpButton = React.forwardRef<HTMLDivElement, RadixSelect.SelectScrollUpButtonProps>(
  ({ className, ...props }, ref) => (
    <RadixSelect.ScrollUpButton
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronUp size="sm" aria-hidden="true" />
    </RadixSelect.ScrollUpButton>
  ),
);
ScrollUpButton.displayName = 'Select.ScrollUpButton';

const ScrollDownButton = React.forwardRef<HTMLDivElement, RadixSelect.SelectScrollDownButtonProps>(
  ({ className, ...props }, ref) => (
    <RadixSelect.ScrollDownButton
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronDown size="sm" aria-hidden="true" />
    </RadixSelect.ScrollDownButton>
  ),
);
ScrollDownButton.displayName = 'Select.ScrollDownButton';

export interface SelectContentProps extends RadixSelect.SelectContentProps {
  /** A filter field at the top; items whose text (or `textValue`) doesn't match are hidden. Typing on an item moves to the field. */
  searchable?: boolean;
}

const Content = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = 'popper', searchable, onKeyDown, ...props }, ref) => {
    const ctx = React.useContext(SelectContext);
    const messages = useNexubMessages();
    const searchRef = React.useRef<HTMLInputElement>(null);
    return (
      <RadixSelect.Portal>
        <RadixSelect.Content
          ref={ref}
          className={cn(
            'relative z-[var(--z-popover)] max-h-96 min-w-32 overflow-hidden',
            floatingSurface,
            'nx-motion nx-pop origin-[var(--radix-select-content-transform-origin)]',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 w-[var(--radix-select-trigger-width)]',
            className,
          )}
          position={position}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            // Searchable: printable keys filter instead of typeahead. preventDefault skips Radix's typeahead.
            if (searchable && !e.defaultPrevented && e.target !== searchRef.current && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              const input = searchRef.current;
              if (!input) return;
              e.preventDefault();
              input.focus();
              // Append at the end and let React see it as a normal change.
              input.setRangeText(e.key, input.value.length, input.value.length, 'end');
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }}
          {...props}
        >
          {searchable && (
            <div className="p-1.5 pb-0">
              <input
                ref={searchRef}
                type="text"
                value={ctx.query}
                onChange={(e) => ctx.setQuery(e.target.value)}
                // Keep typing and caret keys in the field; arrows still move to the items.
                onKeyDown={(e) => {
                  if (e.key.length === 1 || e.key === 'Home' || e.key === 'End') e.stopPropagation();
                }}
                placeholder={messages.searchPlaceholder}
                aria-label={messages.search}
                className={cn('h-control-sm w-full px-3 text-body-sm', field, fieldFocusVisible)}
              />
            </div>
          )}
          <ScrollUpButton />
          <RadixSelect.Viewport
            className={cn(
              'p-1.5',
              position === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
            )}
          >
            {children}
          </RadixSelect.Viewport>
          <ScrollDownButton />
        </RadixSelect.Content>
      </RadixSelect.Portal>
    );
  },
);
Content.displayName = 'Select.Content';

const Label = React.forwardRef<HTMLDivElement, RadixSelect.SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <RadixSelect.Label
      ref={ref}
      className={cn(menuLabel, className)}
      {...props}
    />
  ),
);
Label.displayName = 'Select.Label';

export interface SelectItemProps extends RadixSelect.SelectItemProps {
  /** A secondary line under the label: the option's accessible description, not part of its name. */
  description?: React.ReactNode;
}

const Item = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, description, ...props }, ref) => {
    const { query } = React.useContext(SelectContext);
    const descriptionId = React.useId();
    const text = props.textValue ?? (typeof children === 'string' ? children : undefined);
    // Hidden, not unmounted: the selected item's text must stay mounted for Select.Value.
    const filtered = Boolean(query.trim()) && text !== undefined && !text.toLowerCase().includes(query.trim().toLowerCase());
    return (
      <RadixSelect.Item
        ref={ref}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-[10px] py-2 ps-8 pe-2 text-body-sm text-[var(--color-on-surface)] outline-none',
          // Highlight = the on-surface state layer at hover opacity.
          'focus:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
          'data-[disabled]:pointer-events-none data-[disabled]:text-[var(--color-text-disabled)]',
          className,
          filtered && 'hidden',
        )}
        {...props}
      >
        <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
          <RadixSelect.ItemIndicator>
            <Check size="xs" aria-hidden="true" />
          </RadixSelect.ItemIndicator>
        </span>
        {description ? (
          <span className="flex flex-col">
            <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
            <span id={descriptionId} className="text-label-sm text-[var(--color-on-surface-muted)]">
              {description}
            </span>
          </span>
        ) : (
          <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        )}
      </RadixSelect.Item>
    );
  },
);
Item.displayName = 'Select.Item';

const Separator = React.forwardRef<HTMLDivElement, RadixSelect.SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <RadixSelect.Separator
      ref={ref}
      className={cn(menuSeparator, className)}
      {...props}
    />
  ),
);
Separator.displayName = 'Select.Separator';

export const Select = {
  Root,
  Group,
  Value,
  Trigger,
  ScrollUpButton,
  ScrollDownButton,
  Content,
  Label,
  Item,
  Separator,
};
