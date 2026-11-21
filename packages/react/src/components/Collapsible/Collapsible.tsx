'use client';

import * as React from 'react';
import * as RadixCollapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, RadixCollapsible.CollapsibleProps>(
  ({ className, ...props }, ref) => (
    <RadixCollapsible.Root ref={ref} className={cn('', className)} {...props} />
  ),
);
Root.displayName = 'Collapsible.Root';

export interface CollapsibleTriggerProps extends RadixCollapsible.CollapsibleTriggerProps {
  /**
   * 11.5: `default` is a styled full-width row with a chevron that turns when open, so apps
   * stop building their own. `unstyled` (the default, unchanged) renders only what you pass.
   */
  variant?: 'unstyled' | 'default';
}

const Trigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, variant = 'unstyled', children, ...props }, ref) =>
    variant === 'default' && !props.asChild ? (
      <RadixCollapsible.Trigger
        ref={ref}
        className={cn(
          'nx-state-layer group/collapsible flex w-full items-center justify-between gap-2 rounded-shape-control px-3 py-2 text-start text-label-lg font-medium text-on-surface',
          className,
        )}
        {...props}
      >
        <span className="min-w-0 flex-1">{children}</span>
        <ChevronDown size="sm" aria-hidden="true" className="shrink-0 text-on-surface-variant transition-transform group-data-[state=open]/collapsible:rotate-180" />
      </RadixCollapsible.Trigger>
    ) : (
      <RadixCollapsible.Trigger ref={ref} className={cn('', className)} {...props}>
        {children}
      </RadixCollapsible.Trigger>
    ),
);
Trigger.displayName = 'Collapsible.Trigger';

const Content = React.forwardRef<HTMLDivElement, RadixCollapsible.CollapsibleContentProps>(
  ({ className, ...props }, ref) => (
    <RadixCollapsible.Content
      ref={ref}
      className={cn(
        'overflow-hidden',
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className,
      )}
      {...props}
    />
  ),
);
Content.displayName = 'Collapsible.Content';

export const Collapsible = { Root, Trigger, Content };
