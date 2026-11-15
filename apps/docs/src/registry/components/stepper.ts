import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'stepper',
    title: 'Stepper',
    description: 'Progress through a multi-step flow, with clickable steps that follow the order you allow.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.4.0',
    related: ['form', 'tabs'],
  },
  props: [
    { name: 'steps', type: '{ id, label, description? }[]', required: true, description: 'The steps in order.' },
    { name: 'current', type: 'number', required: true, description: 'Index of the step being shown.' },
    { name: 'completed', type: 'number[]', required: false, description: 'Finished steps. Defaults to every step before `current`.' },
    { name: 'onStepChange', type: '(index) => void', required: false, description: 'Makes reachable steps buttons: finished ones and the first unfinished one.' },
    { name: 'nonLinear', type: 'boolean', required: false, description: 'Every step is reachable.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Vertical suits side columns and narrow screens.' },
    { name: 'aria-label', type: 'string', required: false, description: 'Names the navigation landmark, e.g. "Setup steps".' },
  ],
  examples: [{ title: 'Wizard with a form per step' }],
  a11y: {
    notes: [
      'A `nav` with an ordered list; the current step has `aria-current="step"`.',
      'Each step reads "Step 2 of 4: Billing", plus "completed" when finished.',
      'Validate each step with a Form and move `current` on its submit.',
    ],
  },
};

export default entry;
