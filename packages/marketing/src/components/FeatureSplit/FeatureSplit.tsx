import * as React from 'react';
import { CheckList, Container, EyebrowChip, cn } from '@nexub/react';

export interface FeatureSplitProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Short benefit lines, shown as a check list. */
  points?: string[];
  actions?: React.ReactNode;
  visual: React.ReactNode;
  /** Visual on the left on wide screens. */
  reverse?: boolean;
}

/** Text beside a visual. Server component. */
export const FeatureSplit = React.forwardRef<HTMLElement, FeatureSplitProps>(
  ({ eyebrow, title, description, points, actions, visual, reverse = false, className, ...props }, ref) => (
    <section ref={ref} className={cn('py-20', className)} {...props}>
      <Container size="marketing" className="grid items-center gap-12 lg:grid-cols-2">
        <div className={cn('flex flex-col items-start gap-5', reverse && 'lg:order-2')}>
          {eyebrow && (typeof eyebrow === 'string' ? <EyebrowChip variant="gradient" tone="info">{eyebrow}</EyebrowChip> : eyebrow)}
          <h2 className="m-0 text-balance font-display text-display-sm text-[var(--color-on-surface)]">{title}</h2>
          {description && <p className="m-0 text-body-lg text-[var(--color-on-surface-variant)]">{description}</p>}
          {points && points.length > 0 && <CheckList items={points} />}
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
        <div className={cn('relative', reverse && 'lg:order-1')}>{visual}</div>
      </Container>
    </section>
  ),
);
FeatureSplit.displayName = 'FeatureSplit';
