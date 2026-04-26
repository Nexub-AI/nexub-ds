import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';

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

    const inlineStyle: React.CSSProperties = {
      ...(cols !== undefined
        ? {
            gridTemplateColumns:
              typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : cols,
          }
        : {}),
      ...(rows !== undefined
        ? {
            gridTemplateRows:
              typeof rows === 'number' ? `repeat(${rows}, minmax(0, 1fr))` : rows,
          }
        : {}),
      ...(gap !== undefined
        ? { gap: typeof gap === 'number' ? `${gap * 0.25}rem` : gap }
        : {}),
      ...style,
    };

    return (
      <Comp
        ref={ref}
        className={cn('grid', flow && flowClass[flow], className)}
        style={inlineStyle}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Grid.displayName = 'Grid';
