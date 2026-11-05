import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'pricing-table',
    title: 'PricingTable',
    description: "Plans side by side with a monthly / yearly switch, built on PlanCard and SegmentedControl. Client component.",
    category: 'Marketing',
    package: '@nexub/marketing',
    status: 'beta',
    addedIn: '3.1.0',
  },
  props: [
    { name: "plans", type: "PricingPlan[]", required: true, description: "Each plan: `name`, `price: { monthly, yearly }` per month, `features`, `cta`, and `href` or `onSelect`; `highlighted` and `badge` optional." },
    { name: "currency", type: "string", required: true, description: "ISO 4217 code." },
    { name: "locale", type: "string", required: false, description: "BCP 47 locale for the prices." },
    { name: "defaultPeriod", type: "'monthly' | 'yearly'", default: "'monthly'", required: false, description: "Billing period shown first." },
    { name: "periodLabels", type: "Record<BillingPeriod, string>", required: false, description: "Labels of the switch." },
    { name: "perMonthLabel", type: "string", default: "'/month'", required: false, description: "Shown after each price." },
    { name: "header", type: "React.ReactNode", required: false, description: "A SectionHeader, usually." },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
