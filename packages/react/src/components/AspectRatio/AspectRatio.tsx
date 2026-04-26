import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, children, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative w-full overflow-hidden', className)}
        style={{ aspectRatio: String(ratio), ...style }}
        {...rest}
      >
        <div className="absolute inset-0 h-full w-full">{children}</div>
      </div>
    );
  },
);

AspectRatio.displayName = 'AspectRatio';
