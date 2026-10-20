import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', attached = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        data-orientation={orientation}
        data-attached={attached || undefined}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          // Connected (M3 Expressive): capsule outer ends, small inner corners, a 2px
          // seam between segments so each keeps its own state layer and focus ring.
          attached
            ? [
                'gap-0.5',
                '[&>*:not(:first-child):not(:last-child)]:rounded-[6px]',
                orientation === 'horizontal'
                  ? ['[&>*:first-child]:rounded-r-[6px]', '[&>*:last-child]:rounded-l-[6px]']
                  : ['[&>*:first-child]:rounded-b-[6px]', '[&>*:last-child]:rounded-t-[6px]'],
              ]
            : 'gap-2',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';
