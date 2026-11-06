import * as React from 'react';
import { Card, CardLink } from '@nexub/react/Card';
import { cn } from '@nexub/react/cn';
import { Container } from '@nexub/react/Container';
import { ArrowRight } from '@nexub/icons';

export interface ProductGridProps extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
}

/** A grid of ProductCards. Server component. */
export const ProductGrid = React.forwardRef<HTMLElement, ProductGridProps>(({ header, className, children, ...props }, ref) => (
  <section ref={ref} className={cn('py-20', className)} {...props}>
    <Container size="marketing" className="flex flex-col gap-12">
      {header}
      <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">{children}</ul>
    </Container>
  </section>
));
ProductGrid.displayName = 'ProductGrid';

export interface ProductCardProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title'> {
  name: string;
  description: React.ReactNode;
  href: string;
  /** Product mark, e.g. <PayubMark size={24} />. */
  icon?: React.ReactNode;
  accent?: 'leap' | 'bookub' | 'payub' | 'founderub' | 'matchub';
  /** @default 'Learn more' */
  linkLabel?: string;
}

/** One product: the whole card is a link (its name). Renders as a list item: put it in a ProductGrid. */
export const ProductCard = React.forwardRef<HTMLLIElement, ProductCardProps>(
  ({ name, description, href, icon, accent, linkLabel = 'Learn more', className, ...props }, ref) => (
    <li ref={ref} className={cn('flex', className)} {...props}>
      <Card variant="showcase" accent={accent} className="flex w-full flex-col gap-4 p-7">
        {icon && <span className="inline-flex" aria-hidden="true">{icon}</span>}
        <h3 className="m-0 text-title-lg text-[var(--color-on-surface)]">
          <CardLink href={href}>{name}</CardLink>
        </h3>
        <p className="m-0 flex-1 text-body-md text-[var(--color-on-surface-variant)]">{description}</p>
        <span className="inline-flex items-center gap-1.5 text-label-lg text-[var(--color-tertiary)]" aria-hidden="true">
          {linkLabel} <ArrowRight size={16} />
        </span>
      </Card>
    </li>
  ),
);
ProductCard.displayName = 'ProductCard';
