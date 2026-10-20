import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator.js';

const Root = React.forwardRef<HTMLDivElement, RadixTabs.TabsProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Root ref={ref} className={cn('flex flex-col gap-3', className)} {...props} />
  ),
);
Root.displayName = 'Tabs.Root';

const List = React.forwardRef<HTMLDivElement, RadixTabs.TabsListProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement>(null);
    useSlidingIndicator(ref, '[data-state="active"]');
    return (
      <RadixTabs.List
        ref={useMergedRefs(ref, forwardedRef)}
        className={cn(
          'relative flex w-full items-stretch justify-start overflow-x-auto',
          'border-b border-[var(--color-outline-variant)]',
          className,
        )}
        {...props}
      >
        {children}
        {/* The indicator: a 3px primary bar that slides under the active tab. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-t-full bg-[var(--color-primary)]',
            'w-[var(--nx-ind-w,0px)] translate-x-[var(--nx-ind-x,0px)] opacity-[var(--nx-ind-o,0)]',
            '[[data-nx-indicator=ready]>&]:transition-[transform,width] [[data-nx-indicator=ready]>&]:duration-spatial-default [[data-nx-indicator=ready]>&]:ease-spatial-default',
          )}
        />
      </RadixTabs.List>
    );
  },
);
List.displayName = 'Tabs.List';

const Trigger = React.forwardRef<HTMLButtonElement, RadixTabs.TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        // State layer for hover/press; focus = the global ring.
        'nx-state-layer relative inline-flex h-control-md items-center justify-center whitespace-nowrap rounded-t-[var(--shape-field)] px-4 text-label-lg select-none',
        'text-[var(--color-on-surface-variant)] transition-colors duration-effects-fast ease-effects-fast',
        'data-[state=active]:text-[var(--color-primary)]',
        'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
        className,
      )}
      {...props}
    />
  ),
);
Trigger.displayName = 'Tabs.Trigger';

const Content = React.forwardRef<HTMLDivElement, RadixTabs.TabsContentProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Content
      ref={ref}
      className={cn(
        className,
        // Radix hides inactive panels with the `hidden` attribute, which any
        // display class (`flex`, `md:grid`…) overrides. !important always wins.
        'data-[state=inactive]:!hidden',
      )}
      {...props}
    />
  ),
);
Content.displayName = 'Tabs.Content';

export const Tabs = { Root, List, Trigger, Content };
