'use client';

import * as React from 'react';
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '../../utils/cn.js';
import { toggleVariants } from '../Toggle/Toggle.js';
import type { VariantProps } from 'class-variance-authority';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator.js';

type ToggleGroupContextValue = VariantProps<typeof toggleVariants>;
const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({});

// Root for single and multiple types — accept both
type RootProps = (RadixToggleGroup.ToggleGroupSingleProps | RadixToggleGroup.ToggleGroupMultipleProps) & {
  variant?: VariantProps<typeof toggleVariants>['variant'];
  size?: VariantProps<typeof toggleVariants>['size'];
};

// The hook measures nothing through an empty ref (type="multiple").
const NO_REF = { current: null };

const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, variant, size, children, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement>(null);
    // 10.5: with one selection, a single fill slides to the on item. Multiple keeps a fill per item.
    const single = props.type === 'single';
    useSlidingIndicator(single ? ref : NO_REF, '[data-state="on"]');
    return (
      <ToggleGroupContext.Provider value={{ variant, size }}>
        <RadixToggleGroup.Root
          ref={useMergedRefs(ref, forwardedRef)}
          className={cn('group/tg relative flex items-center gap-1', className)}
          {...(props as RadixToggleGroup.ToggleGroupSingleProps)}
        >
          {single && (
            /* Hidden until the hook has measured (server HTML, no JS): until then the item paints its own fill. */
            <span
              aria-hidden="true"
              data-nx="toggle-indicator"
              className={cn(
                'pointer-events-none absolute left-0 top-0 hidden rounded-[var(--shape-pill,var(--shape-control))] bg-[var(--color-secondary-container)]',
                'h-[var(--nx-ind-h,0px)] w-[var(--nx-ind-w,0px)] translate-x-[var(--nx-ind-x,0px)] translate-y-[var(--nx-ind-y,0px)] opacity-[var(--nx-ind-o,0)]',
                '[[data-nx-indicator=ready]>&]:block [[data-nx-indicator=ready]>&]:transition-[transform,width,height] [[data-nx-indicator=ready]>&]:duration-spatial-default [[data-nx-indicator=ready]>&]:ease-spatial-default',
              )}
            />
          )}
          {children}
        </RadixToggleGroup.Root>
      </ToggleGroupContext.Provider>
    );
  },
);
Root.displayName = 'ToggleGroup.Root';

const Item = React.forwardRef<HTMLButtonElement, RadixToggleGroup.ToggleGroupItemProps & VariantProps<typeof toggleVariants>>(
  ({ className, variant, size, ...props }, ref) => {
    const ctx = React.useContext(ToggleGroupContext);
    return (
      <RadixToggleGroup.Item
        ref={ref}
        className={cn(
          toggleVariants({ variant: variant ?? ctx.variant, size: size ?? ctx.size }),
          // Once the sliding indicator is measured it is the fill; the item's own steps aside.
          'group-data-[nx-indicator=ready]/tg:data-[state=on]:bg-transparent',
          className,
        )}
        {...props}
      />
    );
  },
);
Item.displayName = 'ToggleGroup.Item';

export const ToggleGroup = { Root, Item };
