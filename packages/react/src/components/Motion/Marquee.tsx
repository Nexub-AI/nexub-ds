import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: 'slow' | 'normal' | 'fast';
  /** Classes for each copy of the row (gap, alignment). @default 'gap-12 pe-12 items-center' */
  rowClassName?: string;
}

/**
 * A row that scrolls sideways forever (logo strips, tool lists), in marketing
 * mode (@nexub/themes/marketing). It pauses on hover and while focus is inside,
 * and stands still under reduced motion. The second copy of the row is
 * hidden from assistive technology and can't be focused.
 */
export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ speed = 'normal', rowClassName = 'gap-12 pe-12 items-center', className, children, ...props }, ref) => (
    <div ref={ref} data-speed={speed} className={cn('nx-mkt-marquee', className)} {...props}>
      <div className="nx-mkt-marquee-track">
        <div className={cn('flex shrink-0', rowClassName)}>{children}</div>
        <div className={cn('flex shrink-0', rowClassName)} aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  ),
);
Marquee.displayName = 'Marquee';
