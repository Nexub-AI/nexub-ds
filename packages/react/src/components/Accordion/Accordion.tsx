import * as React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

// Root can be 'single' or 'multiple' — accept both
type RootProps = RadixAccordion.AccordionSingleProps | RadixAccordion.AccordionMultipleProps;

const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, ref) => (
    <RadixAccordion.Root
      ref={ref}
      className={cn('divide-y divide-[var(--color-border-default)]', className)}
      {...props}
    />
  ),
);
Root.displayName = 'Accordion.Root';

const Item = React.forwardRef<HTMLDivElement, RadixAccordion.AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <RadixAccordion.Item ref={ref} className={cn('', className)} {...props} />
  ),
);
Item.displayName = 'Accordion.Item';

const Trigger = React.forwardRef<HTMLButtonElement, RadixAccordion.AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <RadixAccordion.Header className="flex">
      <RadixAccordion.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all',
          'hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)]',
          '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown size="sm" className="shrink-0 transition-transform duration-200" aria-hidden="true" />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  ),
);
Trigger.displayName = 'Accordion.Trigger';

const Content = React.forwardRef<HTMLDivElement, RadixAccordion.AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <RadixAccordion.Content
      ref={ref}
      className={cn(
        'overflow-hidden text-sm',
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className,
      )}
      {...props}
    >
      <div className="pb-4">{children}</div>
    </RadixAccordion.Content>
  ),
);
Content.displayName = 'Accordion.Content';

export const Accordion = { Root, Item, Trigger, Content };
