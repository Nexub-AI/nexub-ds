import * as React from 'react';
import { cn } from '../../utils/cn.js';

// Common ratios as classes (no style attribute, strict-CSP safe); any other
// ratio falls back to inline style. Keys are rounded to 4 decimals.
const RATIO_CLASS: Record<string, string> = {
  '1.0000': 'aspect-square',
  '1.7778': 'aspect-video',
  '1.3333': 'aspect-[4/3]',
  '1.5000': 'aspect-[3/2]',
  '2.3333': 'aspect-[21/9]',
  '0.5625': 'aspect-[9/16]',
  '0.7500': 'aspect-[3/4]',
  '0.6667': 'aspect-[2/3]',
};

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, children, style, ...rest }, ref) => {
    const ratioClass = RATIO_CLASS[ratio.toFixed(4)];
    return (
      <div
        ref={ref}
        className={cn('relative w-full overflow-hidden', ratioClass, className)}
        style={ratioClass ? style : { aspectRatio: String(ratio), ...style }}
        {...rest}
      >
        <div className="absolute inset-0 h-full w-full">{children}</div>
      </div>
    );
  },
);

AspectRatio.displayName = 'AspectRatio';
