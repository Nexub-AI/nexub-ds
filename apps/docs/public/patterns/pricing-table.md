# PricingTable

Plans side by side with a monthly / yearly switch, built on PlanCard and SegmentedControl. Client component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { PricingTable } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/pricing-table

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `plans` (required) | `PricingPlan[]` |  | Each plan: `name`, `price: { monthly, yearly }` per month, `features`, `cta`, and `href` or `onSelect`; `highlighted` and `badge` optional. |
| `currency` (required) | `string` |  | ISO 4217 code. |
| `locale` | `string` |  | BCP 47 locale for the prices. |
| `defaultPeriod` | `'monthly' \| 'yearly'` | `'monthly'` | Billing period shown first. |
| `periodLabels` | `Record<BillingPeriod, string>` |  | Labels of the switch. |
| `perMonthLabel` | `string` | `'/month'` | Shown after each price. |
| `header` | `React.ReactNode` |  | A SectionHeader, usually. |

## Example: Default

```tsx
import { PricingTable, SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <PricingTable
        header={<SectionHeader title="Simple pricing" description="Save two months with yearly billing." />}
        currency="SGD"
        locale="en-SG"
        plans={[
          { name: 'Starter', price: { monthly: 29, yearly: 24 }, features: ['Up to 10 people', 'Payroll', 'Email support'], cta: 'Start free', href: '#starter' },
          { name: 'Growth', price: { monthly: 79, yearly: 66 }, features: ['Up to 100 people', 'Payroll and HR', 'Bookkeeping'], cta: 'Start free', href: '#growth', highlighted: true, badge: 'Most popular' },
          { name: 'Scale', price: { monthly: 199, yearly: 166 }, features: ['Unlimited people', 'All products', 'Dedicated manager'], cta: 'Talk to sales', href: '#scale' },
        ]}
      />
    </div>
  );
}
```
