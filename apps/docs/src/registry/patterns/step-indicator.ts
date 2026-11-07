import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'step-indicator',
    title: 'StepIndicator',
    description: 'Deprecated, removed in 7.0: use Stepper (orientation="vertical"). Visual progress indicator for multi-step flows.',
    category: 'Navigation',
    package: '@nexub/patterns',
    status: 'deprecated',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'steps', type: 'StepIndicatorStep[]', required: true, description: 'Array of step definitions.' },
    { name: 'currentStep', type: 'number', required: true, description: 'Zero-based index of the active step.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Layout direction.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
