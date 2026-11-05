'use client';

import * as React from 'react';
import { cn } from '@nexub/react/cn';
import { Container } from '@nexub/react/Container';
import { SegmentedControl } from '@nexub/react/SegmentedControl';
import { PlanCard } from '@nexub/patterns';

export type BillingPeriod = 'monthly' | 'yearly';

export interface PricingPlan {
  name: string;
  /** Price per month, for each billing period. */
  price: Record<BillingPeriod, number>;
  description?: string;
  features: string[];
  cta: string;
  /** Where the plan's button goes. Or use onSelect. */
  href?: string;
  onSelect?: () => void;
  highlighted?: boolean;
  badge?: string;
}

export interface PricingTableProps extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  plans: PricingPlan[];
  /** ISO 4217 code. */
  currency: string;
  locale?: string;
  defaultPeriod?: BillingPeriod;
  /** @default { monthly: 'Monthly', yearly: 'Yearly' } */
  periodLabels?: Record<BillingPeriod, string>;
  /** Shown after each price. @default '/month' */
  perMonthLabel?: string;
  /** Accessible name of the billing switch. @default 'Billing period' */
  billingLabel?: string;
}

/** Plans side by side with a monthly / yearly switch. */
export const PricingTable = React.forwardRef<HTMLElement, PricingTableProps>(
  (
    {
      header,
      plans,
      currency,
      locale,
      defaultPeriod = 'monthly',
      periodLabels = { monthly: 'Monthly', yearly: 'Yearly' },
      perMonthLabel = '/month',
      billingLabel = 'Billing period',
      className,
      ...props
    },
    ref,
  ) => {
    const [period, setPeriod] = React.useState<BillingPeriod>(defaultPeriod);
    const money = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
    return (
      <section ref={ref} className={cn('py-20', className)} {...props}>
        <Container size="marketing" className="flex flex-col items-center gap-10">
          {header}
          <SegmentedControl.Root
            aria-label={billingLabel}
            value={period}
            onValueChange={(v) => v && setPeriod(v as BillingPeriod)}
          >
            <SegmentedControl.Item value="monthly">{periodLabels.monthly}</SegmentedControl.Item>
            <SegmentedControl.Item value="yearly">{periodLabels.yearly}</SegmentedControl.Item>
          </SegmentedControl.Root>
          <ul className="m-0 grid w-full list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <li key={plan.name} className="flex">
                <PlanCard
                  className="w-full"
                  name={plan.name}
                  price={money.format(plan.price[period])}
                  period={perMonthLabel}
                  description={plan.description}
                  features={plan.features}
                  cta={plan.cta}
                  ctaHref={plan.href}
                  onSelect={plan.onSelect}
                  highlighted={plan.highlighted}
                  badge={plan.badge}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  },
);
PricingTable.displayName = 'PricingTable';
