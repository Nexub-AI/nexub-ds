import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const textVariants = cva('', {
  variants: {
    size: {
      'body-lg': 'text-lg leading-relaxed',
      body: 'text-base leading-relaxed',
      'body-sm': 'text-sm leading-relaxed',
      caption: 'text-xs leading-normal',
      label: 'text-sm leading-none font-medium',
    },
    tone: {
      default: 'text-[var(--color-text-primary)]',
      secondary: 'text-[var(--color-text-secondary)]',
      muted: 'text-[var(--color-text-muted)]',
      subtle: 'text-[var(--color-text-subtle)]',
      inverse: 'text-[var(--color-text-inverse)]',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'body',
    tone: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
  truncate?: boolean;
  lineClamp?: number;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      size,
      tone,
      weight,
      asChild = false,
      truncate = false,
      lineClamp,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'p';

    const clampStyle: React.CSSProperties =
      lineClamp !== undefined
        ? {
            display: '-webkit-box',
            WebkitLineClamp: lineClamp,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }
        : {};

    return (
      <Comp
        ref={ref}
        className={cn(
          textVariants({ size, tone, weight }),
          truncate && 'truncate',
          className,
        )}
        style={{ ...clampStyle, ...style }}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Text.displayName = 'Text';
