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
      default: 'text-[var(--color-on-surface)]',
      secondary: 'text-[var(--color-on-surface-variant)]',
      muted: 'text-[var(--color-on-surface-muted)]',
      subtle: 'text-[var(--color-outline)]',
      inverse: 'text-[var(--color-inverse-on-surface)]',
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

const LINE_CLAMP: Record<number, string> = {
  1: 'line-clamp-1', 2: 'line-clamp-2', 3: 'line-clamp-3',
  4: 'line-clamp-4', 5: 'line-clamp-5', 6: 'line-clamp-6',
};

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

    // Classes for 1–6 (no style attribute, strict-CSP safe); inline beyond that.
    const clampClass = lineClamp !== undefined ? LINE_CLAMP[lineClamp] : undefined;
    const clampStyle: React.CSSProperties | undefined =
      lineClamp !== undefined && !clampClass
        ? {
            display: '-webkit-box',
            WebkitLineClamp: lineClamp,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }
        : undefined;

    return (
      <Comp
        ref={ref}
        className={cn(
          textVariants({ size, tone, weight }),
          truncate && 'truncate',
          clampClass,
          className,
        )}
        style={clampStyle ? { ...clampStyle, ...style } : style}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Text.displayName = 'Text';
