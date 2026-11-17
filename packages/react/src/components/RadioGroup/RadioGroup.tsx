'use client';

import * as React from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';
import { controlInvalid } from '../../utils/controlState.js';

export interface RadioGroupControlProps {
  /** Error border on the items and `aria-invalid`. */
  invalid?: boolean;
  /** Focusable but the selection cannot change; sets `aria-readonly` on the group. */
  readOnly?: boolean;
}

export interface RadioGroupRootProps extends RadixRadioGroup.RadioGroupProps, RadioGroupControlProps {
  /** Item size: `sm` 16px, `md` 18px (default), `lg` 20px. */
  size?: Size;
}

/** Group-level size / invalid / readOnly for the items (shared with RadioCard). */
export const RadioGroupContext = React.createContext<RadioGroupControlProps & { size?: Size }>({});

const Root = React.forwardRef<HTMLDivElement, RadioGroupRootProps>(
  ({ className, size, invalid, readOnly, ...props }, ref) => {
    const ctx = React.useMemo(() => ({ size, invalid, readOnly }), [size, invalid, readOnly]);
    return (
      <RadioGroupContext.Provider value={ctx}>
        <RadixRadioGroup.Root
          ref={ref}
          className={cn('flex flex-col gap-2', className)}
          {...props}
          aria-invalid={invalid || props['aria-invalid']}
          aria-readonly={readOnly || undefined}
        />
      </RadioGroupContext.Provider>
    );
  },
);
Root.displayName = 'RadioGroup.Root';

const itemSize: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-[1.125rem] w-[1.125rem]',
  lg: 'h-5 w-5',
};
const dotSize: Record<Size, string> = { sm: 'h-1.5 w-1.5', md: 'h-2 w-2', lg: 'h-2.5 w-2.5' };

const Item = React.forwardRef<HTMLButtonElement, RadixRadioGroup.RadioGroupItemProps>(
  ({ className, onClick, ...props }, ref) => {
    const { size = 'md', invalid, readOnly } = React.useContext(RadioGroupContext);
    return (
      <RadixRadioGroup.Item
        ref={ref}
        className={cn(
          // 2px outline border (>= 3:1), primary ring + dot when on. Focus = the global ring.
          'nx-hit aspect-square shrink-0 rounded-full border-2 border-[var(--color-outline)]',
          itemSize[size],
          'transition-[border-color] duration-effects-fast ease-effects-fast',
          'hover:border-[var(--color-on-surface)]',
          controlInvalid,
          'data-[state=checked]:border-[var(--color-primary)]',
          'disabled:cursor-not-allowed disabled:border-[var(--color-text-disabled)]',
          readOnly && 'cursor-default',
          className,
        )}
        onClick={(e) => {
          onClick?.(e);
          // Radix skips its select when the click is default-prevented (arrow keys click too).
          if (readOnly) e.preventDefault();
        }}
        {...props}
        aria-invalid={invalid || props['aria-invalid']}
      >
        <RadixRadioGroup.Indicator className="flex items-center justify-center">
          <span className={cn('nx-dot-in block rounded-full bg-[var(--color-primary)] [[data-disabled]_&]:bg-[var(--color-text-disabled)]', dotSize[size])} />
        </RadixRadioGroup.Indicator>
      </RadixRadioGroup.Item>
    );
  },
);
Item.displayName = 'RadioGroup.Item';

export const RadioGroup = { Root, Item };
