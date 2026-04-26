import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from '../../utils/cn.js';

const Root = RadixPopover.Root;
const Trigger = RadixPopover.Trigger;
const Portal = RadixPopover.Portal;
const Close = RadixPopover.Close;

const Content = React.forwardRef<HTMLDivElement, RadixPopover.PopoverContentProps>(
  function PopoverContent({ className, sideOffset = 4, ...props }, ref) {
    return (
      <RadixPopover.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-popover)] rounded-lg border border-[var(--color-border-default)]',
          'bg-[var(--color-bg-default)] p-4 shadow-md',
          'outline-none',
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
Content.displayName = 'Popover.Content';

const Arrow = React.forwardRef<SVGSVGElement, RadixPopover.PopoverArrowProps>(
  function PopoverArrow({ className, ...props }, ref) {
    return (
      <RadixPopover.Arrow
        ref={ref}
        className={cn('fill-[var(--color-border-default)]', className)}
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
