import * as React from 'react';
import { Container, EyebrowChip, cn } from '@nexub/react';

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** A string becomes a gradient EyebrowChip; pass a node for your own. */
  eyebrow?: React.ReactNode;
  /** The page's one h1. */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Usually one Button variant="hero" and one outlined Button. */
  actions?: React.ReactNode;
  /** Product shot or illustration. With `align="start"` it sits beside the text on wide screens. */
  visual?: React.ReactNode;
  align?: 'center' | 'start';
}

/** The page hero: ambient backdrop, eyebrow, display headline, lead, actions and a visual. Server component. */
export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ eyebrow, title, description, actions, visual, align = 'center', className, children, ...props }, ref) => {
    const centered = align === 'center';
    return (
      <section ref={ref} className={cn('nx-mkt-hero-backdrop relative overflow-hidden py-20 sm:py-28', className)} {...props}>
        <Container size="marketing" className={cn('flex flex-col gap-14', !centered && visual && 'lg:grid lg:grid-cols-2 lg:items-center')}>
          <div className={cn('flex flex-col gap-6', centered ? 'mx-auto max-w-3xl items-center text-center' : 'items-start')}>
            {eyebrow && (
              <div className="nx-mkt-rise">
                {typeof eyebrow === 'string' ? <EyebrowChip variant="gradient" tone="info">{eyebrow}</EyebrowChip> : eyebrow}
              </div>
            )}
            <h1 className="nx-mkt-rise nx-mkt-delay-1 m-0 text-balance font-display text-display-md text-[var(--color-on-surface)] sm:text-display-lg lg:text-display-xl">
              {title}
            </h1>
            {description && (
              <p className="nx-mkt-rise nx-mkt-delay-2 m-0 max-w-2xl text-pretty text-body-lg text-[var(--color-on-surface-variant)]">{description}</p>
            )}
            {actions && <div className="nx-mkt-rise nx-mkt-delay-3 flex flex-wrap gap-3">{actions}</div>}
            {children}
          </div>
          {visual && <div className="nx-mkt-rise nx-mkt-delay-3 relative">{visual}</div>}
        </Container>
      </section>
    );
  },
);
Hero.displayName = 'Hero';
