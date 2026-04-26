import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

const Root = RadixSelect.Root;
const Group = RadixSelect.Group;
const Value = RadixSelect.Value;

const Trigger = React.forwardRef<HTMLButtonElement, RadixSelect.SelectTriggerProps & { invalid?: boolean }>(
  ({ className, children, invalid, ...props }, ref) => (
    <RadixSelect.Trigger
      ref={ref}
      className={cn(
        'flex h-9 w-full items-center justify-between rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm',
        'placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring-default)] focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'border-[var(--color-semantic-error-default)] focus:ring-[var(--color-semantic-error-default)]',
        '[&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <RadixSelect.Icon asChild>
        <ChevronDown size="sm" className="opacity-50" aria-hidden="true" />
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
          'relative z-[var(--z-popover)] max-h-96 min-w-32 overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
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
            'p-1',
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
      className={cn('px-2 py-1.5 text-xs font-semibold text-[var(--color-text-muted)]', className)}
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
        'relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none',
        'focus:bg-[var(--color-bg-subtle)] focus:text-[var(--color-text-primary)]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
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
      className={cn('-mx-1 my-1 h-px bg-[var(--color-border-default)]', className)}
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
