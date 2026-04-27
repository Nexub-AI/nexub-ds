import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'plan-card',
    title: 'PlanCard',
    description: 'Pricing plan card with feature checklist, badge, and CTA button.',
    category: 'Marketing',
    package: '@nexub/patterns',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'name', type: 'string', required: true, description: 'Plan name (e.g. "Pro").' },
    { name: 'price', type: 'string', required: true, description: 'Price string (e.g. "$49/mo").' },
    { name: 'description', type: 'string', required: false, description: 'Short plan description.' },
    { name: 'features', type: 'string[]', required: false, description: 'List of included features.' },
    { name: 'highlighted', type: 'boolean', default: 'false', required: false, description: 'Applies brand accent styling for recommended plans.' },
    { name: 'badge', type: 'string', required: false, description: 'Label for the plan badge (e.g. "Most Popular").' },
    { name: 'ctaLabel', type: 'string', default: "'Get started'", required: false, description: 'CTA button label.' },
    { name: 'onCta', type: '() => void', required: false, description: 'CTA button click handler.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<PlanCard
  name="Pro"
  price="$49/mo"
  description="Everything you need to scale."
  features={['Unlimited projects', 'Priority support', 'Custom domains', 'Analytics']}
  highlighted
  badge="Most Popular"
  ctaLabel="Start free trial"
/>`,
    },
  ],
};

export default entry;
