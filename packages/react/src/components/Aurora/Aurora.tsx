// Aurora (4.2): a decorative background of slow-drifting colour fields from the
// accent roles (primary, tertiary and a blend), so it follows brands, seeded
// themes and dark mode. Place it inside a positioned container; it fills it and
// sits behind the content. Subtle by default, richer under
// data-expression="vivid". Server component; styles in @nexub/themes (.nx-aurora).
import * as React from 'react';
import { cn } from '../../utils/cn.js';

export type AuroraProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

export const Aurora = React.forwardRef<HTMLDivElement, AuroraProps>(({ className, ...props }, ref) => (
  <div ref={ref} aria-hidden="true" className={cn('nx-aurora', className)} {...props}>
    <span />
    <span />
    <span />
  </div>
));
Aurora.displayName = 'Aurora';
