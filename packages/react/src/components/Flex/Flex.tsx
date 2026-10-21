import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';
import { layoutProps } from '../../utils/layout.js';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
  align?: string;
  justify?: string;
  wrap?: boolean;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  asChild?: boolean;
}

const directionClass: Record<NonNullable<FlexProps['direction']>, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      gap,
      align,
      justify,
      wrap = false,
      direction = 'row',
      asChild = false,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'div';

    const layout = layoutProps({ gap, align, justify, style });

    return (
      <Comp
        ref={ref}
        className={cn('flex', layout.className, directionClass[direction], wrap && 'flex-wrap', className)}
        style={layout.style}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Flex.displayName = 'Flex';
