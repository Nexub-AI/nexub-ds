import * as React from 'react';
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '../../utils/cn.js';

export interface SegmentedControlProps extends Omit<RadixToggleGroup.ToggleGroupSingleProps, 'type'> {
  size?: 'sm' | 'md' | 'lg';
}

export interface SegmentedControlItemProps extends RadixToggleGroup.ToggleGroupItemProps {}

const sizeMap = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3 text-sm',
  lg: 'h-9 px-4 text-sm',
};

const SegmentedControlContext = React.createContext<{ size: 'sm' | 'md' | 'lg' }>({ size: 'md' });

const Root = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ className, size = 'md', children, ...props }, ref) => (
    <SegmentedControlContext.Provider value={{ size }}>
      <RadixToggleGroup.Root
        ref={ref}
        type="single"
        className={cn(
          'inline-flex items-center rounded-lg bg-[var(--color-bg-subtle)] p-0.5 gap-0.5',
          className,
        )}
        {...props}
      >
        {children}
      </RadixToggleGroup.Root>
    </SegmentedControlContext.Provider>
  ),
);
Root.displayName = 'SegmentedControl.Root';

const Item = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(SegmentedControlContext);
    return (
      <RadixToggleGroup.Item
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all',
          'text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)]',
          'data-[state=on]:bg-[var(--color-bg-default)] data-[state=on]:text-[var(--color-text-primary)] data-[state=on]:shadow-sm',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeMap[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Item.displayName = 'SegmentedControl.Item';

export const SegmentedControl = { Root, Item };
