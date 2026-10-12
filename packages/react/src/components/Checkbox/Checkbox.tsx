import * as React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check, Minus } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <RadixCheckbox.Root
      ref={ref}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-[var(--color-border-input)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-[var(--color-fill-primary)] data-[state=checked]:border-[var(--color-fill-primary)] data-[state=checked]:text-white',
        'data-[state=indeterminate]:bg-[var(--color-fill-primary)] data-[state=indeterminate]:border-[var(--color-fill-primary)] data-[state=indeterminate]:text-white',
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className="flex items-center justify-center">
        {props.checked === 'indeterminate' ? (
          <Minus size="xs" />
        ) : (
          <Check size="xs" />
        )}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  ),
);
Checkbox.displayName = 'Checkbox';
