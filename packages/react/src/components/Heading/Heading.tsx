import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const headingVariants = cva('', {
  variants: {
    size: {
      display: 'text-6xl font-extrabold tracking-tight leading-none',
      h1: 'text-5xl font-bold tracking-tight leading-tight',
      h2: 'text-4xl font-bold tracking-tight leading-tight',
      h3: 'text-3xl font-semibold leading-snug',
      h4: 'text-2xl font-semibold leading-snug',
      h5: 'text-xl font-semibold leading-snug',
      h6: 'text-base font-semibold leading-normal',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
  },
});

type HeadingSize = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

const levelSizeMap: Record<1 | 2 | 3 | 4 | 5 | 6, HeadingSize> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: HeadingSize;
  tone?: ToneValue | 'default';
  weight?: HeadingWeight;
  asChild?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 2,
      size,
      tone,
      weight,
      asChild = false,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const resolvedSize = size ?? levelSizeMap[level];
    const Tag = `h${level}` as React.ElementType;
    const Comp = asChild ? Slot : Tag;

    // Use inline style for tone colour so Tailwind JIT never sees a
    // dynamic class string containing `${tone}` — that would get scanned
    // and produce invalid CSS with a literal `${tone}` token.
    const toneStyle: React.CSSProperties =
      tone && tone !== 'default'
        ? { color: `var(--color-text-${tone})` }
        : {};

    return (
      <Comp
        ref={ref}
        className={cn(
          headingVariants({ size: resolvedSize, weight }),
          className,
        )}
        style={{ ...toneStyle, ...style }}
        data-tone={tone}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);

Heading.displayName = 'Heading';
