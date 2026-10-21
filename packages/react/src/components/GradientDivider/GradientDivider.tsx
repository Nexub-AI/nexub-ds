import * as React from 'react';
import { cn } from '../../utils/cn.js';

// The 4-colour brand signature stripe, from the brand gradient tokens.
// Classes, not inline style, so it renders under a strict CSP.
const GRADIENT_H = 'bg-[image:var(--gradient-brand-horizontal)]';
const GRADIENT_V = 'bg-[image:var(--gradient-brand-vertical)]';

const THICKNESS_H: Record<number, string> = { 1: 'h-px', 2: 'h-0.5', 3: 'h-[3px]', 4: 'h-1' };
const THICKNESS_V: Record<number, string> = { 1: 'w-px', 2: 'w-0.5', 3: 'w-[3px]', 4: 'w-1' };

export interface GradientDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number;
  orientation?: 'horizontal' | 'vertical';
}

export const GradientDivider = React.forwardRef<HTMLDivElement, GradientDividerProps>(
  (
    { className, height = 3, orientation = 'horizontal', style, ...props },
    ref,
  ) => {
    const isHorizontal = orientation === 'horizontal';
    const thickness = (isHorizontal ? THICKNESS_H : THICKNESS_V)[height];
    // Off-scale thickness falls back to inline style.
    const sizeStyle = thickness
      ? undefined
      : isHorizontal
        ? { height: `${height}px` }
        : { width: `${height}px` };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          isHorizontal ? 'w-full' : 'h-full',
          isHorizontal ? GRADIENT_H : GRADIENT_V,
          thickness,
          className,
        )}
        style={sizeStyle || style ? { ...sizeStyle, ...style } : undefined}
        {...props}
      />
    );
  },
);

GradientDivider.displayName = 'GradientDivider';
