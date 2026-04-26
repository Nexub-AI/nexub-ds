import * as React from 'react';
import * as RadixCollapsible from '@radix-ui/react-collapsible';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, RadixCollapsible.CollapsibleProps>(
  ({ className, ...props }, ref) => (
    <RadixCollapsible.Root ref={ref} className={cn('', className)} {...props} />
  ),
);
Root.displayName = 'Collapsible.Root';

const Trigger = React.forwardRef<HTMLButtonElement, RadixCollapsible.CollapsibleTriggerProps>(
  ({ className, ...props }, ref) => (
    <RadixCollapsible.Trigger ref={ref} className={cn('', className)} {...props} />
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
