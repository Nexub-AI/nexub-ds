import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible, fieldInvalid } from '../../utils/control.js';
import { floatingSurface, menuLabel, menuSeparator } from '../../utils/surface.js';

const Root = RadixSelect.Root;
const Group = RadixSelect.Group;
const Value = RadixSelect.Value;

const Trigger = React.forwardRef<HTMLButtonElement, RadixSelect.SelectTriggerProps & { invalid?: boolean }>(
  ({ className, children, invalid, ...props }, ref) => (
    <RadixSelect.Trigger
      ref={ref}
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
      <RadixSelect.Icon asChild>
        <ChevronDown size="sm" className="shrink-0 text-[var(--color-on-surface-variant)]" aria-hidden="true" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  ),
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

const Content = React.forwardRef<HTMLDivElement, RadixSelect.SelectContentProps>(
  ({ className, children, position = 'popper', ...props }, ref) => (
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
        {...props}
      >
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
  ),
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

const Item = React.forwardRef<HTMLDivElement, RadixSelect.SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <RadixSelect.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-[10px] py-2 ps-8 pe-2 text-body-sm text-[var(--color-on-surface)] outline-none',
        // Highlight = the on-surface state layer at hover opacity.
        'focus:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
        'data-[disabled]:pointer-events-none data-[disabled]:text-[var(--color-text-disabled)]',
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
        <RadixSelect.ItemIndicator>
          <Check size="xs" aria-hidden="true" />
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  ),
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
