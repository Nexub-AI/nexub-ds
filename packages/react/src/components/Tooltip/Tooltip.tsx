'use client';

import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../../utils/cn.js';
import { Kbd } from '../Kbd/Kbd.js';

// Lets <Tooltip> (and IconButton's built-in tooltip) work without an app-level
// Provider: it renders its own only when none is above it.
const InProvider = React.createContext(false);

// Hover intent: wait 400ms before the first tooltip; once one has shown,
// neighbours open instantly for 300ms (skipDelay), so scanning a toolbar
// doesn't stutter.
function Provider({ delayDuration = 400, skipDelayDuration = 300, ...props }: RadixTooltip.TooltipProviderProps) {
  return (
    <InProvider.Provider value={true}>
      <RadixTooltip.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} />
    </InProvider.Provider>
  );
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

export interface TooltipProps {
  /** The tip, or the title when `description` is set. */
  label: React.ReactNode;
  /** Secondary line under the title (rich tooltip). */
  description?: React.ReactNode;
  /** Keyboard shortcut, shown as a Kbd at the end, e.g. "⌘S". */
  shortcut?: React.ReactNode;
  /** Point at the trigger with a small arrow. */
  arrow?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  children: React.ReactElement;
}

function Tooltip({ label, description, shortcut, arrow, side = 'top', delayDuration = 400, children }: TooltipProps) {
  const tip = (
    <Root delayDuration={delayDuration}>
      <Trigger asChild>{children}</Trigger>
      <RadixTooltip.Portal>
        <Content side={side} className={cn(description != null && 'max-w-xs')}>
          <span className="flex items-center gap-3">
            {description == null ? (
              label
            ) : (
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{label}</span>
                <span className="text-body-sm">{description}</span>
              </span>
            )}
            {shortcut != null && (
              <Kbd className="ms-auto border-current bg-transparent text-inherit shadow-none">{shortcut}</Kbd>
            )}
          </span>
          {arrow && <RadixTooltip.Arrow className="fill-[var(--color-inverse-surface)]" />}
        </Content>
      </RadixTooltip.Portal>
    </Root>
  );
  return React.useContext(InProvider) ? tip : <Provider>{tip}</Provider>;
}

export { Provider, Root, Trigger, Content, Tooltip };
