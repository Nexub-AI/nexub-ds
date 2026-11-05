import * as React from 'react';
import { Avatar, Card, Container, cn } from '@nexub/react';
import { Star } from '@nexub/icons';

export interface TestimonialGridProps extends React.HTMLAttributes<HTMLElement> {
  /** A SectionHeader, usually. */
  header?: React.ReactNode;
}

/** A grid of TestimonialCards. Server component. */
export const TestimonialGrid = React.forwardRef<HTMLElement, TestimonialGridProps>(({ header, className, children, ...props }, ref) => (
  <section ref={ref} className={cn('py-20', className)} {...props}>
    <Container size="marketing" className="flex flex-col gap-12">
      {header}
      <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">{children}</ul>
    </Container>
  </section>
));
TestimonialGrid.displayName = 'TestimonialGrid';

export interface TestimonialCardProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'role'> {
  quote: React.ReactNode;
  name: string;
  role?: React.ReactNode;
  avatarSrc?: string;
  /** Stars out of 5. */
  rating?: number;
  /** The product the customer uses: a coloured top edge and tint. */
  accent?: 'leap' | 'bookub' | 'payub' | 'founderub';
}

/** A customer quote. Renders as a list item: put it in a TestimonialGrid. */
export const TestimonialCard = React.forwardRef<HTMLLIElement, TestimonialCardProps>(
  ({ quote, name, role, avatarSrc, rating, accent, className, ...props }, ref) => (
    <li ref={ref} className={cn('flex', className)} {...props}>
      <Card variant="showcase" accent={accent} asChild>
        <figure className="m-0 flex w-full flex-col gap-5 p-7">
          {rating !== undefined && (
            <div role="img" aria-label={`Rated ${rating} out of 5`} className="flex gap-0.5 text-[var(--color-warning)]">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} aria-hidden="true" className={i < rating ? 'fill-current' : 'opacity-30'} />
              ))}
            </div>
          )}
          <blockquote className="m-0 flex-1 text-body-lg text-[var(--color-on-surface)]">{quote}</blockquote>
          <figcaption className="flex items-center gap-3">
            <Avatar name={name} src={avatarSrc} size="md" />
            <span className="flex flex-col">
              <span className="text-title-sm text-[var(--color-on-surface)]">{name}</span>
              {role && <span className="text-body-sm text-[var(--color-on-surface-variant)]">{role}</span>}
            </span>
          </figcaption>
        </figure>
      </Card>
    </li>
  ),
);
TestimonialCard.displayName = 'TestimonialCard';
