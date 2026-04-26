import * as React from 'react';
import * as RadixToolbar from '@radix-ui/react-toolbar';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, RadixToolbar.ToolbarProps>(
  ({ className, ...props }, ref) => (
    <RadixToolbar.Root
      ref={ref}
      className={cn(
        'flex items-center gap-1 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-1',
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'Toolbar.Root';

const ToolbarButton = React.forwardRef<HTMLButtonElement, RadixToolbar.ToolbarButtonProps>(
  ({ className, ...props }, ref) => (
    <RadixToolbar.Button
      ref={ref}
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
        'hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)]',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
ToolbarButton.displayName = 'Toolbar.Button';

const Separator = React.forwardRef<HTMLDivElement, RadixToolbar.ToolbarSeparatorProps>(
  ({ className, ...props }, ref) => (
    <RadixToolbar.Separator
      ref={ref}
      className={cn('mx-1 w-px self-stretch bg-[var(--color-border-default)]', className)}
      {...props}
    />
  ),
);
Separator.displayName = 'Toolbar.Separator';

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  RadixToolbar.ToolbarToggleGroupSingleProps | RadixToolbar.ToolbarToggleGroupMultipleProps
>(
  ({ className, ...props }, ref) => (
    <RadixToolbar.ToggleGroup
      ref={ref}
      className={cn('flex items-center gap-0.5', className)}
      {...props}
    />
  ),
);
ToggleGroup.displayName = 'Toolbar.ToggleGroup';

const ToggleItem = React.forwardRef<HTMLButtonElement, RadixToolbar.ToolbarToggleItemProps>(
  ({ className, ...props }, ref) => (
    <RadixToolbar.ToggleItem
      ref={ref}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
        'hover:bg-[var(--color-bg-subtle)] data-[state=on]:bg-[var(--color-bg-subtle)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)]',
        className,
      )}
      {...props}
    />
  ),
);
ToggleItem.displayName = 'Toolbar.ToggleItem';

export const Toolbar = { Root, Button: ToolbarButton, Separator, ToggleGroup, ToggleItem };
