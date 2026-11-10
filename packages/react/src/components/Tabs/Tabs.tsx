'use client';

import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator.js';

const Root = React.forwardRef<HTMLDivElement, RadixTabs.TabsProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Root ref={ref} className={cn('flex flex-col gap-3 data-[orientation=vertical]:flex-row', className)} {...props} />
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
          'group/tabs relative flex w-full items-stretch justify-start overflow-x-auto',
          'border-b border-[var(--color-outline-variant)]',
          // Vertical: a column with the rule on the inline-end side.
          'data-[orientation=vertical]:w-auto data-[orientation=vertical]:shrink-0 data-[orientation=vertical]:flex-col',
          'data-[orientation=vertical]:overflow-x-visible data-[orientation=vertical]:overflow-y-auto',
          'data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-e',
          className,
        )}
        {...props}
      >
        {children}
        {/* The indicator: a 3px primary bar that slides under (or beside) the active tab. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-t-full bg-[var(--color-primary)]',
            'w-[var(--nx-ind-w,0px)] translate-x-[var(--nx-ind-x,0px)] opacity-[var(--nx-ind-o,0)]',
            'group-data-[orientation=vertical]/tabs:top-0 group-data-[orientation=vertical]/tabs:bottom-auto group-data-[orientation=vertical]/tabs:left-auto group-data-[orientation=vertical]/tabs:end-0',
            'group-data-[orientation=vertical]/tabs:h-[var(--nx-ind-h,0px)] group-data-[orientation=vertical]/tabs:w-[3px] group-data-[orientation=vertical]/tabs:rounded-none group-data-[orientation=vertical]/tabs:rounded-s-full',
            'group-data-[orientation=vertical]/tabs:translate-x-0 group-data-[orientation=vertical]/tabs:translate-y-[var(--nx-ind-y,0px)]',
            '[[data-nx-indicator=ready]>&]:transition-[transform,width,height] [[data-nx-indicator=ready]>&]:duration-spatial-default [[data-nx-indicator=ready]>&]:ease-spatial-default',
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
        'group-data-[orientation=vertical]/tabs:justify-start group-data-[orientation=vertical]/tabs:rounded-none group-data-[orientation=vertical]/tabs:rounded-s-[var(--shape-field)]',
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
        // Crossfade in on the effects spring (@starting-style, @nexub/themes/base).
        'nx-tab-panel',
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
