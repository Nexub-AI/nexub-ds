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
                '[&>*:not(:first-child):not(:last-child)]:rounded-[0.375rem]',
                orientation === 'horizontal'
                  ? ['[&>*:first-child]:rounded-e-[0.375rem]', '[&>*:last-child]:rounded-s-[0.375rem]']
                  : ['[&>*:first-child]:rounded-b-[0.375rem]', '[&>*:last-child]:rounded-t-[0.375rem]'],
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
