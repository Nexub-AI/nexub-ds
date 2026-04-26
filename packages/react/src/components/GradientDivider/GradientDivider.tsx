import * as React from 'react';
import { cn } from '../../utils/cn.js';

// The 4-colour brand signature stripe — hard-coded gradient is intentional here.
const BRAND_GRADIENT_H =
  'linear-gradient(90deg, #4099f1 0%, #1cce66 40%, #f59e0b 70%, #1b3b6f 100%)';
const BRAND_GRADIENT_V =
  'linear-gradient(180deg, #4099f1 0%, #1cce66 40%, #f59e0b 70%, #1b3b6f 100%)';

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

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          isHorizontal ? 'w-full' : 'h-full',
          className,
        )}
        style={{
          background: isHorizontal ? BRAND_GRADIENT_H : BRAND_GRADIENT_V,
          ...(isHorizontal
            ? { height: `${height}px` }
            : { width: `${height}px` }),
          ...style,
        }}
        {...props}
      />
    );
  },
);

GradientDivider.displayName = 'GradientDivider';
