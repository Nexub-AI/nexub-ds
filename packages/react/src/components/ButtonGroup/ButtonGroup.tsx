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
          attached
            ? [
                'gap-0',
                '[&>*:not(:first-child):not(:last-child)]:rounded-none',
                orientation === 'horizontal'
                  ? [
                      '[&>*:first-child]:rounded-r-none',
                      '[&>*:last-child]:rounded-l-none',
                      '[&>*:not(:first-child)]:border-l-0',
                    ]
                  : [
                      '[&>*:first-child]:rounded-b-none',
                      '[&>*:last-child]:rounded-t-none',
                      '[&>*:not(:first-child)]:border-t-0',
                    ],
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
