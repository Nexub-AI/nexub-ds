import * as React from 'react';
import * as RadixHoverCard from '@radix-ui/react-hover-card';
import { cn } from '../../utils/cn.js';

const Root = RadixHoverCard.Root;
const Trigger = RadixHoverCard.Trigger;

const Content = React.forwardRef<HTMLDivElement, RadixHoverCard.HoverCardContentProps>(
  function HoverCardContent({ className, sideOffset = 4, ...props }, ref) {
    return (
      <RadixHoverCard.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-popover)] w-64 rounded-lg border border-[var(--color-border-default)]',
          'bg-[var(--color-bg-default)] p-4 shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
          'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
          className,
        )}
        {...props}
      />
    );
  },
);
Content.displayName = 'HoverCard.Content';

const Arrow = React.forwardRef<SVGSVGElement, RadixHoverCard.HoverCardArrowProps>(
  function HoverCardArrow({ className, ...props }, ref) {
    return (
      <RadixHoverCard.Arrow
        ref={ref}
        className={cn('fill-[var(--color-border-default)]', className)}
        {...props}
      />
    );
  },
);
Arrow.displayName = 'HoverCard.Arrow';

export const HoverCard = {
  Root,
  Trigger,
  Content,
  Arrow,
};
