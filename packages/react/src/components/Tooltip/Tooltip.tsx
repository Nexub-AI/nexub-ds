import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../../utils/cn.js';

const Provider = RadixTooltip.Provider;
const Root = RadixTooltip.Root;
const Trigger = RadixTooltip.Trigger;

const Content = React.forwardRef<HTMLDivElement, RadixTooltip.TooltipContentProps>(
  function TooltipContent({ className, sideOffset = 4, ...props }, ref) {
    return (
      <RadixTooltip.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[1500] rounded bg-[var(--color-neutral-900)] px-2 py-1 text-xs text-white',
          'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
          'data-[state=delayed-open]:fade-in-0 data-[state=closed]:fade-out-0',
          'data-[state=delayed-open]:zoom-in-95 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
          'data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
          className,
        )}
        {...props}
      />
    );
  },
);
Content.displayName = 'Tooltip.Content';

interface TooltipProps {
  label: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  children: React.ReactElement;
}

function Tooltip({ label, side = 'top', delayDuration = 400, children }: TooltipProps) {
  return (
    <Root delayDuration={delayDuration}>
      <Trigger asChild>{children}</Trigger>
      <RadixTooltip.Portal>
        <Content side={side}>{label}</Content>
      </RadixTooltip.Portal>
    </Root>
  );
}

export { Provider, Root, Trigger, Content, Tooltip };
