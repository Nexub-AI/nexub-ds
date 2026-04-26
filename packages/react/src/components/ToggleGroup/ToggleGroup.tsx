import * as React from 'react';
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '../../utils/cn.js';
import { toggleVariants } from '../Toggle/Toggle.js';
import type { VariantProps } from 'class-variance-authority';

type ToggleGroupContextValue = VariantProps<typeof toggleVariants>;
const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({});

// Root for single and multiple types — accept both
type RootProps = (RadixToggleGroup.ToggleGroupSingleProps | RadixToggleGroup.ToggleGroupMultipleProps) & {
  variant?: VariantProps<typeof toggleVariants>['variant'];
  size?: VariantProps<typeof toggleVariants>['size'];
};

const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, variant, size, ...props }, ref) => (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <RadixToggleGroup.Root
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        {...props}
      />
    </ToggleGroupContext.Provider>
  ),
);
Root.displayName = 'ToggleGroup.Root';

const Item = React.forwardRef<HTMLButtonElement, RadixToggleGroup.ToggleGroupItemProps & VariantProps<typeof toggleVariants>>(
  ({ className, variant, size, ...props }, ref) => {
    const ctx = React.useContext(ToggleGroupContext);
    return (
      <RadixToggleGroup.Item
        ref={ref}
        className={cn(toggleVariants({ variant: variant ?? ctx.variant, size: size ?? ctx.size }), className)}
        {...props}
      />
    );
  },
);
Item.displayName = 'ToggleGroup.Item';

export const ToggleGroup = { Root, Item };
