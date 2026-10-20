import * as React from 'react';
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '../../utils/cn.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator.js';

export interface SegmentedControlProps extends Omit<RadixToggleGroup.ToggleGroupSingleProps, 'type'> {
  size?: 'sm' | 'md' | 'lg';
}

export interface SegmentedControlItemProps extends RadixToggleGroup.ToggleGroupItemProps {}

// The track is a control-ladder height; items fill it inside a 2px inset.
const sizeMap = {
  sm: 'h-control-sm text-label-md',
  md: 'h-control-md text-label-lg',
  lg: 'h-control-lg text-label-lg',
};

const SegmentedControlContext = React.createContext<{ size: 'sm' | 'md' | 'lg' }>({ size: 'md' });

const Root = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ className, size = 'md', children, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement>(null);
    useSlidingIndicator(ref, '[data-state="on"]');
    return (
      <SegmentedControlContext.Provider value={{ size }}>
        <RadixToggleGroup.Root
          ref={useMergedRefs(ref, forwardedRef)}
          type="single"
          className={cn(
            'relative inline-flex items-stretch rounded-shape-control bg-[var(--color-surface-container-high)] p-0.5',
            sizeMap[size],
            className,
          )}
          {...props}
        >
          {/* The thumb: one raised surface that slides to the selected item. */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0.5 left-0 rounded-shape-control',
              'bg-[var(--color-surface-container-lowest)] shadow-elevation-1',
              'w-[var(--nx-ind-w,0px)] translate-x-[var(--nx-ind-x,0px)] opacity-[var(--nx-ind-o,0)]',
              '[[data-nx-indicator=ready]>&]:transition-[transform,width] [[data-nx-indicator=ready]>&]:duration-spatial-default [[data-nx-indicator=ready]>&]:ease-spatial-default',
            )}
          />
          {children}
        </RadixToggleGroup.Root>
      </SegmentedControlContext.Provider>
    );
  },
);
Root.displayName = 'SegmentedControl.Root';

const Item = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(SegmentedControlContext);
    return (
      <RadixToggleGroup.Item
        ref={ref}
        className={cn(
          'relative z-10 inline-flex items-center justify-center rounded-shape-control select-none',
          size === 'sm' ? 'px-3' : size === 'lg' ? 'px-5' : 'px-4',
          'text-[var(--color-on-surface-variant)] transition-colors duration-effects-fast ease-effects-fast',
          'hover:text-[var(--color-on-surface)] data-[state=on]:text-[var(--color-on-surface)]',
          'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
          className,
        )}
        {...props}
      />
    );
  },
);
Item.displayName = 'SegmentedControl.Item';

export const SegmentedControl = { Root, Item };
