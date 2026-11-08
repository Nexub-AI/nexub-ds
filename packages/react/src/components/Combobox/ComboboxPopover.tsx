'use client';

// Internal: the popover shell shared by Autocomplete and
// MultiSelect. Not exported from the package.

import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { cn } from '../../utils/cn.js';
import { floatingSurface } from '../../utils/surface.js';
import { field, fieldDisabled, fieldFocusWithin } from '../../utils/control.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Skeleton } from '../Skeleton/Skeleton.js';

export interface ComboboxPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Rendered inside the field, before the input (MultiSelect chips). */
  before?: React.ReactNode;
  input: React.ComponentProps<typeof Command.Input>;
  disabled?: boolean;
  /** The list (a Combobox.List). */
  children: React.ReactNode;
}

/**
 * A field that keeps focus in its input while a list opens below it.
 * The list is not portalled: cmdk finds its items inside the Command root.
 */
export function ComboboxPopover({ open, onOpenChange, before, input, disabled, children }: ComboboxPopoverProps) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // cmdk hard-codes aria-expanded="true" and its own aria-labelledby after
  // spreading props. React doesn't rewrite an attribute whose prop didn't
  // change, so set the real values here. (aria-label goes through Command's
  // `label`, which is what cmdk's aria-labelledby points at.)
  const labelledBy = input['aria-labelledby'];
  useIsomorphicLayoutEffect(() => {
    inputRef.current?.setAttribute('aria-expanded', String(open));
    if (labelledBy) inputRef.current?.setAttribute('aria-labelledby', labelledBy);
  });

  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Anchor asChild>
        <div
          ref={anchorRef}
          className={cn(
            field,
            fieldFocusWithin,
            'flex min-h-control-md w-full flex-wrap items-center gap-1.5 px-3 py-1',
            disabled && fieldDisabled,
          )}
          onPointerDown={(e) => {
            if (disabled) return;
            // Clicks on the field (not a chip's button) focus the input and open the list.
            if ((e.target as HTMLElement).closest('button')) return;
            if (e.target !== inputRef.current) e.preventDefault();
            inputRef.current?.focus();
            onOpenChange(true);
          }}
        >
          {before}
          <Command.Input
            ref={inputRef}
            disabled={disabled}
            {...input}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' && !open) onOpenChange(true);
              input.onKeyDown?.(e);
            }}
            className={cn(
              'min-w-8 flex-1 bg-transparent text-body-md outline-none placeholder:text-[var(--color-on-surface-muted)]',
              input.className,
            )}
          />
        </div>
      </RadixPopover.Anchor>
      <RadixPopover.Content
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
        }}
        className={cn(
          'z-[var(--z-popover)] w-[var(--radix-popover-trigger-width)] overflow-hidden p-0 outline-none',
          floatingSurface,
          'nx-motion nx-pop origin-[var(--radix-popover-content-transform-origin)]',
        )}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
}

/** Three placeholder rows while options load; the word "Loading" is read out. */
export function ComboboxLoading() {
  const messages = useNexubMessages();
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-2 px-2.5 py-2">
      <span className="sr-only">{messages.loading}</span>
      <Skeleton className="w-3/4" aria-hidden="true" />
      <Skeleton className="w-1/2" aria-hidden="true" />
      <Skeleton className="w-2/3" aria-hidden="true" />
    </div>
  );
}
