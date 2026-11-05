import * as React from 'react';
import { cn } from '@nexub/react/cn';
import { Container } from '@nexub/react/Container';

export interface HowItWorksStep {
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
}

export interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  steps: HowItWorksStep[];
}

/** Numbered steps in an ordered list. Server component. */
export const HowItWorks = React.forwardRef<HTMLElement, HowItWorksProps>(({ header, steps, className, ...props }, ref) => (
  <section ref={ref} className={cn('py-20', className)} {...props}>
    <Container size="marketing" className="flex flex-col gap-12">
      {header}
      <ol className="m-0 grid list-none gap-8 p-0 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={i} className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-control-md w-control-md items-center justify-center rounded-full bg-[var(--color-primary-container)] text-title-md text-[var(--color-on-primary-container)]"
            >
              {step.icon ?? i + 1}
            </span>
            <h3 className="m-0 text-title-lg text-[var(--color-on-surface)]">{step.title}</h3>
            <p className="m-0 text-body-md text-[var(--color-on-surface-variant)]">{step.description}</p>
          </li>
        ))}
      </ol>
    </Container>
  </section>
));
HowItWorks.displayName = 'HowItWorks';
