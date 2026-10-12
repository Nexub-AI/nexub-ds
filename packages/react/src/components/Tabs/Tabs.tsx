import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, RadixTabs.TabsProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Root ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
  ),
);
Root.displayName = 'Tabs.Root';

const List = React.forwardRef<HTMLDivElement, RadixTabs.TabsListProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.List
      ref={ref}
      className={cn(
        'flex h-9 w-full items-center justify-start overflow-x-auto rounded-lg bg-[var(--color-bg-subtle)] p-1 text-[var(--color-text-muted)] gap-0.5',
        className,
      )}
      {...props}
    />
  ),
);
List.displayName = 'Tabs.List';

const Trigger = React.forwardRef<HTMLButtonElement, RadixTabs.TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-[var(--color-bg-default)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-sm',
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]',
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
