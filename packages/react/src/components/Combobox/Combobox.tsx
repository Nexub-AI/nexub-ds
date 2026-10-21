import * as React from 'react';
import { Command } from 'cmdk';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Command>>(
  ({ className, ...props }, ref) => (
    <Command
      ref={ref}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-shape-container bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]',
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'Combobox.Root';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Command.Input>>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b border-[var(--color-outline-variant)] px-3.5">
      <Command.Input
        ref={ref}
        className={cn(
          'flex h-control-md w-full bg-transparent text-body-md outline-none placeholder:text-[var(--color-on-surface-muted)] disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]',
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
      className={cn('py-6 text-center text-body-sm text-[var(--color-on-surface-muted)]', className)}
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
        'overflow-hidden p-1 text-[var(--color-on-surface)] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--color-on-surface-muted)]',
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
        'relative flex cursor-default select-none items-center rounded-[10px] px-2.5 py-2 text-body-sm outline-none',
        // Highlight = the on-surface state layer at hover opacity.
        'aria-selected:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:text-[var(--color-text-disabled)]',
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
      className={cn('-mx-1 my-1 h-px bg-[var(--color-outline-variant)]', className)}
      {...props}
    />
  ),
);
Separator.displayName = 'Combobox.Separator';

export const Combobox = { Root, Input, List, Empty, Group, Item, Separator };
