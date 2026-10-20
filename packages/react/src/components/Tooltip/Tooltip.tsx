import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../../utils/cn.js';

// Hover intent: wait 400ms before the first tooltip; once one has shown,
// neighbours open instantly for 300ms (skipDelay), so scanning a toolbar
// doesn't stutter.
function Provider({ delayDuration = 400, skipDelayDuration = 300, ...props }: RadixTooltip.TooltipProviderProps) {
  return <RadixTooltip.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} />;
}
const Root = RadixTooltip.Root;
const Trigger = RadixTooltip.Trigger;

const Content = React.forwardRef<HTMLDivElement, RadixTooltip.TooltipContentProps>(
  function TooltipContent({ className, sideOffset = 4, ...props }, ref) {
    return (
      <RadixTooltip.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-tooltip,1800)] rounded-shape-tooltip bg-[var(--color-inverse-surface)] px-2.5 py-1.5 text-label-md text-[var(--color-inverse-on-surface)] shadow-elevation-1',
          'nx-motion nx-pop origin-[var(--radix-tooltip-content-transform-origin)]',
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
