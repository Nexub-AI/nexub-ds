import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';
import { layoutProps } from '../../utils/layout.js';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number | string;
  rows?: number | string;
  gap?: number | string;
  flow?: 'row' | 'column' | 'dense';
  asChild?: boolean;
}

const flowClass: Record<NonNullable<GridProps['flow']>, string> = {
  row: 'grid-flow-row',
  column: 'grid-flow-col',
  dense: 'grid-flow-dense',
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols,
      rows,
      gap,
      flow,
      asChild = false,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'div';

    const layout = layoutProps({ gap, cols, rows, style });

    return (
      <Comp
        ref={ref}
        className={cn('grid', layout.className, flow && flowClass[flow], className)}
        style={layout.style}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Grid.displayName = 'Grid';
