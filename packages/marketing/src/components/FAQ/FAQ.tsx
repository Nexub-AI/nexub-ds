'use client';

import * as React from 'react';
import { Accordion } from '@nexub/react/Accordion';
import { cn } from '@nexub/react/cn';
import { Container } from '@nexub/react/Container';

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface FAQProps extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  items: FAQItem[];
}

/** Questions and answers in an Accordion; one open at a time. */
export const FAQ = React.forwardRef<HTMLElement, FAQProps>(({ header, items, className, ...props }, ref) => (
  <section ref={ref} className={cn('py-20', className)} {...props}>
    <Container size="md" className="flex flex-col gap-10">
      {header}
      <Accordion.Root type="single" collapsible>
        {items.map((item, i) => (
          <Accordion.Item key={i} value={`faq-${i}`}>
            <Accordion.Trigger>{item.question}</Accordion.Trigger>
            <Accordion.Content>{item.answer}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Container>
  </section>
));
FAQ.displayName = 'FAQ';
