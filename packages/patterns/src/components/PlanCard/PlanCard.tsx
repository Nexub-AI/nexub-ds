import * as React from 'react';
import { cn, Badge, Button } from '@nexub/react';
import { Check } from '@nexub/icons';

export interface PlanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: string;
  onSelect?: () => void;
  highlighted?: boolean;
  badge?: string;
}

export const PlanCard = React.forwardRef<HTMLDivElement, PlanCardProps>(
  (
    {
      name,
      price,
      period,
      description,
      features,
      cta,
      onSelect,
      highlighted = false,
      badge,
      className,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col gap-6 rounded-shape-container bg-[var(--color-surface-elevated)] text-[var(--color-on-surface)] p-6',
        highlighted
          ? 'border-2 border-[var(--color-primary)] shadow-elevation-2'
          : 'border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] shadow-elevation-1',
        className,
      )}
      {...props}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge tone="info">{badge}</Badge>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-[var(--color-on-surface)]">{name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[var(--color-on-surface)]">{price}</span>
          {period && (
            <span className="text-sm text-[var(--color-on-surface-muted)]">{period}</span>
          )}
        </div>
        {description && (
          <p className="text-sm text-[var(--color-on-surface-muted)]">{description}</p>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]"
          >
            <Check size="xs" className="text-[var(--color-success)] shrink-0" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={highlighted ? 'primary' : 'outline'}
        className="mt-auto w-full"
        onClick={onSelect}
      >
        {cta}
      </Button>
    </div>
  ),
);

PlanCard.displayName = 'PlanCard';
