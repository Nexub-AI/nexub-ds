import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'step-indicator',
    title: 'StepIndicator',
    description: 'Visual progress indicator for multi-step flows like onboarding or checkout.',
    category: 'Navigation',
    package: '@nexub/patterns',
    status: 'stable',
  },
  props: [
    { name: 'steps', type: 'StepIndicatorStep[]', required: true, description: 'Array of step definitions.' },
    { name: 'currentStep', type: 'number', required: true, description: 'Zero-based index of the active step.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Layout direction.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<StepIndicator
  currentStep={1}
  steps={[
    { label: 'Account' },
    { label: 'Profile' },
    { label: 'Payment' },
    { label: 'Review' },
  ]}
/>`,
    },
  ],
};

export default entry;
