import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';
import { layoutProps } from '../../utils/layout.js';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: number | string;
  align?: string;
  justify?: string;
  wrap?: boolean;
  divider?: React.ReactNode;
  asChild?: boolean;
}

function injectDividers(
  children: React.ReactNode,
  divider: React.ReactNode,
): React.ReactNode[] {
  const childArray = React.Children.toArray(children);
  return childArray.reduce<React.ReactNode[]>((acc, child, index) => {
    if (index > 0) {
      acc.push(
        <React.Fragment key={`divider-${index}`}>{divider}</React.Fragment>,
      );
    }
    acc.push(child);
    return acc;
  }, []);
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'column',
      gap,
      align,
      justify,
      wrap = false,
      divider,
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

    const content = divider ? injectDividers(children, divider) : children;

    return (
      <Comp
        ref={ref}
        className={cn(
          'flex', layout.className,
          direction === 'row' ? 'flex-row' : 'flex-col',
          wrap && 'flex-wrap',
          className,
        )}
        style={layout.style}
        {...rest}
      >
        {content}
      </Comp>
    );
  },
);

Stack.displayName = 'Stack';
