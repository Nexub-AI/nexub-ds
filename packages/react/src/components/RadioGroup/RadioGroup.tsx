import * as React from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, RadixRadioGroup.RadioGroupProps>(
  ({ className, ...props }, ref) => (
    <RadixRadioGroup.Root ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
  ),
);
Root.displayName = 'RadioGroup.Root';

const Item = React.forwardRef<HTMLButtonElement, RadixRadioGroup.RadioGroupItemProps>(
  ({ className, ...props }, ref) => (
    <RadixRadioGroup.Item
      ref={ref}
      className={cn(
        // 18px, 2px outline border (>= 3:1), primary ring + dot when on. Focus = the global ring.
        'aspect-square h-[18px] w-[18px] shrink-0 rounded-full border-2 border-[var(--color-outline)]',
        'transition-[border-color] duration-effects-fast ease-effects-fast',
        'hover:border-[var(--color-on-surface)] data-[state=checked]:border-[var(--color-primary)]',
        'disabled:cursor-not-allowed disabled:border-[var(--color-text-disabled)]',
        className,
      )}
      {...props}
    >
      <RadixRadioGroup.Indicator className="flex items-center justify-center">
        <span className="block h-2 w-2 rounded-full bg-[var(--color-primary)] [[data-disabled]_&]:bg-[var(--color-text-disabled)]" />
      </RadixRadioGroup.Indicator>
    </RadixRadioGroup.Item>
  ),
);
Item.displayName = 'RadioGroup.Item';

export const RadioGroup = { Root, Item };
