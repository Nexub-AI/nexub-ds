'use client';

import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from '../../utils/cn.js';
import { COLLISION_PADDING, arrowSafe, type SheetProp } from '../../utils/popper.js';
import { floatingSurface, popoverSurface } from '../../utils/surface.js';
import { glassSurfaceClass, type SurfaceValue } from '../../utils/glass.js';

const Root = RadixPopover.Root;
const Trigger = RadixPopover.Trigger;
const Portal = RadixPopover.Portal;
const Close = RadixPopover.Close;

const Content = React.forwardRef<
  HTMLDivElement,
  RadixPopover.PopoverContentProps & {
    surface?: SurfaceValue;
    /** `true`: bottom sheet. `'auto'`: bottom sheet below the `md` breakpoint, a popover above. @default 'auto' (pass `sheet={false}` to keep a popover on small screens) */
    sheet?: SheetProp;
  }
>(function PopoverContent({ className, sideOffset = 4, collisionPadding = COLLISION_PADDING, surface = 'solid', sheet = 'auto', ...props }, ref) {
    return (
      <RadixPopover.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        data-nx-sheet={sheet || undefined}
        className={cn(
          'z-[var(--z-popover)] p-4 outline-none',
          'max-h-[var(--radix-popover-content-available-height)] overflow-y-auto', arrowSafe,
          floatingSurface, popoverSurface,
          'nx-motion nx-pop origin-[var(--radix-popover-content-transform-origin)]',
          surface === 'glass' && glassSurfaceClass,
          className,
        )}
        data-material={surface === 'glass' ? 'glass' : undefined}
        {...props}
      />
    );
  },
);
Content.displayName = 'Popover.Content';

const Arrow = React.forwardRef<SVGSVGElement, RadixPopover.PopoverArrowProps>(
  function PopoverArrow({ className, ...props }, ref) {
    return (
      <RadixPopover.Arrow
        ref={ref}
        className={cn('fill-[var(--color-outline-variant)]', className)}
        {...props}
      />
    );
  },
);
Arrow.displayName = 'Popover.Arrow';

export const Popover = {
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
  Close,
};
