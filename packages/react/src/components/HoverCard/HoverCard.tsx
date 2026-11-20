'use client';

import * as React from 'react';
import * as RadixHoverCard from '@radix-ui/react-hover-card';
import { cn } from '../../utils/cn.js';
import { COLLISION_PADDING, arrowSafe } from '../../utils/popper.js';
import { floatingSurface } from '../../utils/surface.js';

// Hover intent: open after 500ms of resting on the trigger, close 200ms after
// leaving (long enough to cross the gap into the card).
function Root({ openDelay = 500, closeDelay = 200, ...props }: RadixHoverCard.HoverCardProps) {
  return <RadixHoverCard.Root openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}
const Trigger = RadixHoverCard.Trigger;

const Content = React.forwardRef<HTMLDivElement, RadixHoverCard.HoverCardContentProps>(
  function HoverCardContent({ className, sideOffset = 4, collisionPadding = COLLISION_PADDING, ...props }, ref) {
    return (
      <RadixHoverCard.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'z-[var(--z-popover)] w-64 p-4 outline-none',
          'max-h-[var(--radix-hover-card-content-available-height)] overflow-y-auto', arrowSafe,
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
