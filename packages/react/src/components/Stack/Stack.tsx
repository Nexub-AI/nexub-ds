import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';

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

    const inlineStyle: React.CSSProperties = {
      ...(gap !== undefined ? { gap: typeof gap === 'number' ? `${gap * 0.25}rem` : gap } : {}),
      ...(align ? { alignItems: align } : {}),
      ...(justify ? { justifyContent: justify } : {}),
      ...style,
    };

    const content = divider ? injectDividers(children, divider) : children;

    return (
      <Comp
        ref={ref}
        className={cn(
          'flex',
          direction === 'row' ? 'flex-row' : 'flex-col',
          wrap && 'flex-wrap',
          className,
        )}
        style={inlineStyle}
        {...rest}
      >
        {content}
      </Comp>
    );
  },
);

Stack.displayName = 'Stack';
