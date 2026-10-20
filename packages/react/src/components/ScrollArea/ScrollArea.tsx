import * as React from 'react';
import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { cn } from '../../utils/cn.js';

export interface ScrollAreaProps extends RadixScrollArea.ScrollAreaProps {
  orientation?: 'vertical' | 'horizontal' | 'both';
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = 'vertical', ...props }, ref) => (
    <RadixScrollArea.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
      <RadixScrollArea.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </RadixScrollArea.Viewport>
      {(orientation === 'vertical' || orientation === 'both') && (
        <RadixScrollArea.Scrollbar
          className="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px]"
          orientation="vertical"
        >
          <RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-[var(--color-outline-variant)]" />
        </RadixScrollArea.Scrollbar>
      )}
      {(orientation === 'horizontal' || orientation === 'both') && (
        <RadixScrollArea.Scrollbar
          className="flex touch-none select-none transition-colors flex-col h-2.5 border-t border-t-transparent p-[1px]"
          orientation="horizontal"
        >
          <RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-[var(--color-outline-variant)]" />
        </RadixScrollArea.Scrollbar>
      )}
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  ),
);
ScrollArea.displayName = 'ScrollArea';
