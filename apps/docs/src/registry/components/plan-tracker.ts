import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'plan-tracker',
    title: 'Plan Tracker',
    description: 'An agent plan: ordered steps with done, active, pending or failed status.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.8.0',
    related: ['message-bubble', 'thinking-indicator'],
  },
  props: [
    { name: 'steps', type: '{ title; status; detail? }[]', required: true, description: 'Status is done, active, pending or failed.' },
  ],
  examples: [{ title: 'Agent plan' }],
  a11y: { screenReader: ['Each step reads its status in text; the active step has `aria-current="step"`.'] },
};

export default entry;
