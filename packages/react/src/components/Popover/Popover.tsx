import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from '../../utils/cn.js';
import { floatingSurface } from '../../utils/surface.js';
import { glassSurfaceClass, type SurfaceValue } from '../../utils/glass.js';

const Root = RadixPopover.Root;
const Trigger = RadixPopover.Trigger;
const Portal = RadixPopover.Portal;
const Close = RadixPopover.Close;

const Content = React.forwardRef<
  HTMLDivElement,
  RadixPopover.PopoverContentProps & { surface?: SurfaceValue }
>(function PopoverContent({ className, sideOffset = 4, surface = 'solid', ...props }, ref) {
    return (
      <RadixPopover.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-popover)] p-4 outline-none',
          floatingSurface,
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
