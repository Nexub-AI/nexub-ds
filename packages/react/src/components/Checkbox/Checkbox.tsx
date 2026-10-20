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
        // 18px, 2px outline border (>= 3:1), primary when on. Focus = the global ring.
        'peer h-[18px] w-[18px] shrink-0 rounded-[5px] border-2 border-[var(--color-outline)]',
        'transition-[background-color,border-color] duration-effects-fast ease-effects-fast',
        'hover:border-[var(--color-on-surface)]',
        'data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:text-[var(--color-on-primary)]',
        'data-[state=indeterminate]:bg-[var(--color-primary)] data-[state=indeterminate]:border-[var(--color-primary)] data-[state=indeterminate]:text-[var(--color-on-primary)]',
        'disabled:cursor-not-allowed disabled:border-[var(--color-text-disabled)] disabled:data-[state=checked]:bg-[var(--color-text-disabled)] disabled:data-[state=indeterminate]:bg-[var(--color-text-disabled)] disabled:text-[var(--color-surface)]',
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
