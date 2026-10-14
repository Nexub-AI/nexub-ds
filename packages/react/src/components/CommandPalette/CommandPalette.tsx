import * as React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { Search } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useClassScrollLock } from '../../hooks/useClassScrollLock.js';

export interface CommandPaletteRootProps extends RadixDialog.DialogProps {
  className?: string;
  /** Accessible name of the dialog. @default 'Command palette' */
  label?: string;
  /**
   * How page scroll is locked while open.
   * - `'style'` (default): Radix's lock, which injects a `<style>` tag (blocked by `style-src 'self'`).
   * - `'class'`: the `nexub-scroll-lock` class from `@nexub/themes/base`. Strict-CSP safe.
   */
  scrollLock?: 'style' | 'class';
  /** `false` when the items are already filtered (e.g. async search results). @default true */
  shouldFilter?: boolean;
}

const overlayClasses =
  'fixed inset-0 z-[var(--z-modal)] bg-[var(--color-overlay)] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0';

// Radix's scroll lock lives in Dialog.Overlay, so the class-lock overlay is a
// plain element. Focus trap and Escape live in Dialog.Content and still apply.
function ClassLockOverlay() {
  useClassScrollLock();
  return <div data-state="open" className={overlayClasses} />;
}

const Root = React.forwardRef<HTMLDivElement, CommandPaletteRootProps>(
  ({ children, label = 'Command palette', scrollLock = 'style', shouldFilter, ...props }, ref) => {
  // Radix returns focus to Dialog.Trigger, which a palette (opened by a shortcut
  // or its own button) doesn't have. Return it to whatever had it before.
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  return (
  <RadixDialog.Root {...props}>
    <RadixDialog.Portal>
      {scrollLock === 'class' ? <ClassLockOverlay /> : <RadixDialog.Overlay className={overlayClasses} />}
      <RadixDialog.Content
        ref={ref}
        aria-describedby={undefined}
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null;
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocusRef.current?.focus();
        }}
        className={cn(
          'fixed left-1/2 top-[20%] z-[var(--z-modal)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2',
          'overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-2xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        )}
      >
        <RadixDialog.Title className="sr-only">{label}</RadixDialog.Title>
        <Command
          label={label}
          shouldFilter={shouldFilter}
          loop
          className="flex h-full w-full flex-col overflow-hidden text-[var(--color-text-primary)]"
        >
          {children}
        </Command>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
  );
});
Root.displayName = 'CommandPalette.Root';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Command.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-[var(--color-border-default)] px-3">
    <Search size="sm" className="mr-2 shrink-0 opacity-50" aria-hidden="true" />
    <Command.Input
      ref={ref}
      className={cn(
        'flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));
Input.displayName = 'CommandPalette.Input';

const List = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.List>
>(({ className, ...props }, ref) => (
  <Command.List
    ref={ref}
    className={cn('max-h-[400px] overflow-y-auto overflow-x-hidden p-2', className)}
    {...props}
  />
));
List.displayName = 'CommandPalette.List';

const Empty = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.Empty>
>(({ className, ...props }, ref) => (
  <Command.Empty
    ref={ref}
    className={cn(
      'py-8 text-center text-sm text-[var(--color-text-muted)]',
      className,
    )}
    {...props}
  />
));
Empty.displayName = 'CommandPalette.Empty';

const Group = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.Group>
>(({ className, ...props }, ref) => (
  <Command.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-[var(--color-text-primary)]',
      '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--color-text-muted)]',
      className,
    )}
    {...props}
  />
));
Group.displayName = 'CommandPalette.Group';

const Item = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.Item>
>(({ className, ...props }, ref) => (
  <Command.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none',
      'aria-selected:bg-[var(--color-bg-subtle)] aria-selected:text-[var(--color-text-primary)]',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className,
    )}
    {...props}
  />
));
Item.displayName = 'CommandPalette.Item';

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.Separator>
>(({ className, ...props }, ref) => (
  <Command.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
    {...props}
  />
));
Separator.displayName = 'CommandPalette.Separator';

export const CommandPalette = { Root, Input, List, Empty, Group, Item, Separator };
