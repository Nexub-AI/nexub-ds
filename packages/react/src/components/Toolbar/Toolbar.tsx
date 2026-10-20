import * as React from 'react';
import * as RadixToolbar from '@radix-ui/react-toolbar';
import { cn } from '../../utils/cn.js';
import { glassSurfaceClass } from '../../utils/glass.js';

export interface ToolbarRootProps extends RadixToolbar.ToolbarProps {
  /**
   * Floating toolbar (Apple / M3 Expressive): a glass capsule for the control
   * layer above content, e.g. editor or selection actions.
   */
  floating?: boolean;
  /** With `floating`: pin it to the bottom centre of the viewport. */
  placement?: 'bottom';
}

const Root = React.forwardRef<HTMLDivElement, ToolbarRootProps>(
  ({ className, floating = false, placement, ...props }, ref) => (
    <RadixToolbar.Root
      ref={ref}
      data-material={floating ? 'glass' : undefined}
      className={cn(
        'flex items-center gap-1 p-1',
        floating
          ? ['rounded-shape-control p-1.5', glassSurfaceClass]
          : 'rounded-shape-container bg-[var(--color-surface-container-low)]',
        floating && placement === 'bottom' && 'fixed bottom-6 left-1/2 z-[var(--z-sticky,1100)] -translate-x-1/2',
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'Toolbar.Root';

// Items: capsule state-layer buttons on the control ladder; focus = the global ring.
const item = [
  'nx-state-layer nx-press relative inline-flex h-control-sm items-center justify-center gap-1.5 rounded-shape-control text-label-lg text-[var(--color-on-surface)] select-none',
  'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
].join(' ');

const ToolbarButton = React.forwardRef<HTMLButtonElement, RadixToolbar.ToolbarButtonProps>(
  ({ className, ...props }, ref) => (
    <RadixToolbar.Button ref={ref} className={cn(item, 'px-3', className)} {...props} />
  ),
);
ToolbarButton.displayName = 'Toolbar.Button';

const Separator = React.forwardRef<HTMLDivElement, RadixToolbar.ToolbarSeparatorProps>(
  ({ className, ...props }, ref) => (
    <RadixToolbar.Separator
      ref={ref}
      className={cn('mx-1 h-5 w-px bg-[var(--color-outline-variant)]', className)}
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
        item,
        'w-control-sm data-[state=on]:bg-[var(--color-secondary-container)] data-[state=on]:text-[var(--color-on-secondary-container)]',
        className,
      )}
      {...props}
    />
  ),
);
ToggleItem.displayName = 'Toolbar.ToggleItem';

export const Toolbar = { Root, Button: ToolbarButton, Separator, ToggleGroup, ToggleItem };
