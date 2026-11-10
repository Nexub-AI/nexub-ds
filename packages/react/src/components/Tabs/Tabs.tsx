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

// Which List variant the triggers sit in (pill triggers sit above the thumb).
const VariantContext = React.createContext<'line' | 'pill'>('line');

export interface TabsListProps extends RadixTabs.TabsListProps {
  /** `line` (default): underline. `pill`: a raised thumb slides behind the active tab. */
  variant?: 'line' | 'pill';
}

const List = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, variant = 'line', ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement>(null);
    useSlidingIndicator(ref, '[data-state="active"]');
    useOverflow(ref);
    const pill = variant === 'pill';
    return (
      <VariantContext.Provider value={variant}>
        <RadixTabs.List
          ref={useMergedRefs(ref, forwardedRef)}
          data-variant={variant}
          className={cn(
            // nx-scroll-fade: edge fades while more tabs hide past an edge (@nexub/themes core).
            'nx-scroll-fade group/tabs relative flex w-full items-stretch justify-start overflow-x-auto',
            // Vertical: a column with the rule on the inline-end side.
            'data-[orientation=vertical]:w-auto data-[orientation=vertical]:shrink-0 data-[orientation=vertical]:flex-col',
            'data-[orientation=vertical]:overflow-x-visible data-[orientation=vertical]:overflow-y-auto',
            pill
              ? 'w-fit max-w-full rounded-[var(--shape-pill,var(--shape-control))] bg-[var(--color-surface-container-high)] p-0.5'
              : 'border-b border-[var(--color-outline-variant)] data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-e',
            className,
          )}
          {...props}
        >
          {children}
          {pill ? (
            /* The thumb (as SegmentedControl): one raised surface behind the active tab, either orientation. */
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute left-0 top-0 rounded-[var(--shape-pill,var(--shape-control))]',
                'bg-[var(--color-surface-container-lowest)] shadow-elevation-1',
                'h-[var(--nx-ind-h,0px)] w-[var(--nx-ind-w,0px)] translate-x-[var(--nx-ind-x,0px)] translate-y-[var(--nx-ind-y,0px)] opacity-[var(--nx-ind-o,0)]',
                '[[data-nx-indicator=ready]>&]:transition-[transform,width,height] [[data-nx-indicator=ready]>&]:duration-spatial-default [[data-nx-indicator=ready]>&]:ease-spatial-default',
              )}
            />
          ) : (
            /* The indicator: a 3px primary bar that slides under (or beside) the active tab. */
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
          )}
        </RadixTabs.List>
      </VariantContext.Provider>
    );
  },
);
List.displayName = 'Tabs.List';

/**
 * Overflowing lists: data-nx-overflow="start end" names the edges that hide
 * tabs (the CSS fades them), and a newly active tab scrolls into view inside
 * the list only, never scrolling the page.
 */
function useOverflow(ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const sync = () => {
      const v = root.dataset.orientation === 'vertical';
      // abs(): scrollLeft is negative in RTL.
      const pos = Math.abs(v ? root.scrollTop : root.scrollLeft);
      const max = v ? root.scrollHeight - root.clientHeight : root.scrollWidth - root.clientWidth;
      const edges = [pos > 1 && 'start', pos < max - 1 && 'end'].filter(Boolean).join(' ');
      if (edges) root.dataset.nxOverflow = edges;
      else delete root.dataset.nxOverflow;
    };
    const reveal = (records: MutationRecord[]) => {
      const tab = records.map((r) => r.target as HTMLElement).find((t) => t.getAttribute('role') === 'tab' && t.dataset.state === 'active');
      if (!tab) return;
      // Nearest edge, both axes, from rects (RTL-safe).
      const r = root.getBoundingClientRect();
      const t = tab.getBoundingClientRect();
      const left = t.left < r.left ? t.left - r.left : t.right > r.right ? t.right - r.right : 0;
      const top = t.top < r.top ? t.top - r.top : t.bottom > r.bottom ? t.bottom - r.bottom : 0;
      if (!left && !top) return;
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      root.scrollBy?.({ left, top, behavior: reduce ? 'auto' : 'smooth' });
    };
    sync();
    root.addEventListener('scroll', sync, { passive: true });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sync);
    ro?.observe(root);
    const mo = new MutationObserver(reveal);
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['data-state'] });
    return () => {
      root.removeEventListener('scroll', sync);
      ro?.disconnect();
      mo.disconnect();
    };
  }, [ref]);
}

const Trigger = React.forwardRef<HTMLButtonElement, RadixTabs.TabsTriggerProps>(
  ({ className, ...props }, ref) => {
    const pill = React.useContext(VariantContext) === 'pill';
    return (
      <RadixTabs.Trigger
        ref={ref}
        className={cn(
          // State layer for hover/press; focus = the global ring.
          'nx-state-layer relative inline-flex h-control-md items-center justify-center whitespace-nowrap px-4 text-label-lg select-none',
          'group-data-[orientation=vertical]/tabs:justify-start',
          'text-[var(--color-on-surface-variant)] transition-colors duration-effects-fast ease-effects-fast',
          pill
            ? 'z-10 rounded-[var(--shape-pill,var(--shape-control))] hover:text-[var(--color-on-surface)] data-[state=active]:text-[var(--color-on-surface)]'
            : cn(
                'rounded-t-[var(--shape-field)] data-[state=active]:text-[var(--color-primary)]',
                'group-data-[orientation=vertical]/tabs:rounded-none group-data-[orientation=vertical]/tabs:rounded-s-[var(--shape-field)]',
              ),
          'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
          className,
        )}
        {...props}
      />
    );
  },
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
