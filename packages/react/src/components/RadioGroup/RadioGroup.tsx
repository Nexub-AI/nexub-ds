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
        'aspect-square h-4 w-4 rounded-full border border-[var(--color-border-default)]',
        'text-[var(--color-brand-primary-500)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadixRadioGroup.Indicator className="flex items-center justify-center">
        <span className="block h-2 w-2 rounded-full bg-[var(--color-brand-primary-500)]" />
      </RadixRadioGroup.Indicator>
    </RadixRadioGroup.Item>
  ),
);
Item.displayName = 'RadioGroup.Item';

export const RadioGroup = { Root, Item };
