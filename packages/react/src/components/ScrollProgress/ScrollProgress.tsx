// ScrollProgress (4.4): a thin bar along the top of the viewport that fills as
// the page scrolls, driven by a CSS scroll timeline: no JavaScript, server
// component. Hidden where scroll-driven animations are not supported and
// under reduced motion. Decorative: reading position is already conveyed by
// the scrollbar.
import * as React from 'react';
import { cn } from '../../utils/cn.js';

export type ScrollProgressProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(({ className, ...props }, ref) => (
  <div ref={ref} aria-hidden="true" className={cn('nx-scroll-progress', className)} {...props} />
));
ScrollProgress.displayName = 'ScrollProgress';
