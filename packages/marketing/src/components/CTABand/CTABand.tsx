import * as React from 'react';
import { cn } from '@nexub/react/cn';
import { Container } from '@nexub/react/Container';

export interface CTABandProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons. On the band, use variant="filled" with tone="neutral" or an outlined button. */
  actions?: React.ReactNode;
}

/**
 * The closing call to action: a primary band (the hero gradient in marketing
 * mode, one of the three places a gradient belongs). Server component.
 */
export const CTABand = React.forwardRef<HTMLElement, CTABandProps>(({ title, description, actions, className, ...props }, ref) => (
  <section ref={ref} className={cn('py-16', className)} {...props}>
    <Container size="marketing">
      <div className="nx-mkt-cta-band flex flex-col items-center gap-6 rounded-[var(--marketing-card-radius,var(--shape-container))] bg-[var(--color-primary)] px-6 py-14 text-center text-[var(--color-on-primary)] sm:px-12">
        <h2 className="m-0 max-w-2xl text-balance font-display text-display-sm">{title}</h2>
        {description && <p className="m-0 max-w-xl text-body-lg opacity-90">{description}</p>}
        {actions && <div className="flex flex-wrap justify-center gap-3">{actions}</div>}
      </div>
    </Container>
  </section>
));
CTABand.displayName = 'CTABand';
