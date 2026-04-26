import * as React from 'react';
import { Command } from 'cmdk';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Command>>(
  ({ className, ...props }, ref) => (
    <Command
      ref={ref}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-lg bg-[var(--color-bg-default)] text-[var(--color-text-primary)]',
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'Combobox.Root';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Command.Input>>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b border-[var(--color-border-default)] px-3">
      <Command.Input
        ref={ref}
        className={cn(
          'flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Input.displayName = 'Combobox.Input';

const List = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Command.List>>(
  ({ className, ...props }, ref) => (
    <Command.List
      ref={ref}
      className={cn('max-h-64 overflow-y-auto overflow-x-hidden p-1', className)}
      {...props}
    />
  ),
);
List.displayName = 'Combobox.List';

const Empty = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Command.Empty>>(
  ({ className, ...props }, ref) => (
    <Command.Empty
      ref={ref}
      className={cn('py-6 text-center text-sm text-[var(--color-text-muted)]', className)}
      {...props}
    />
  ),
);
Empty.displayName = 'Combobox.Empty';

const Group = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Command.Group>>(
  ({ className, ...props }, ref) => (
    <Command.Group
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-[var(--color-text-primary)] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--color-text-muted)]',
        className,
      )}
      {...props}
    />
  ),
);
Group.displayName = 'Combobox.Group';

const Item = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Command.Item>>(
  ({ className, ...props }, ref) => (
    <Command.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none',
        'aria-selected:bg-[var(--color-bg-subtle)] aria-selected:text-[var(--color-text-primary)]',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Item.displayName = 'Combobox.Item';

const Separator = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Command.Separator>>(
  ({ className, ...props }, ref) => (
    <Command.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
      {...props}
    />
  ),
);
Separator.displayName = 'Combobox.Separator';

export const Combobox = { Root, Input, List, Empty, Group, Item, Separator };
