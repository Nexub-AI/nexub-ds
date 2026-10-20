import * as React from 'react';
import * as RadixHoverCard from '@radix-ui/react-hover-card';
import { cn } from '../../utils/cn.js';
import { floatingSurface } from '../../utils/surface.js';

const Root = RadixHoverCard.Root;
const Trigger = RadixHoverCard.Trigger;

const Content = React.forwardRef<HTMLDivElement, RadixHoverCard.HoverCardContentProps>(
  function HoverCardContent({ className, sideOffset = 4, ...props }, ref) {
    return (
      <RadixHoverCard.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-popover)] w-64 p-4 outline-none',
          floatingSurface,
          'nx-motion nx-pop origin-[var(--radix-hover-card-content-transform-origin)]',
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
        className={cn('fill-[var(--color-outline-variant)]', className)}
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
