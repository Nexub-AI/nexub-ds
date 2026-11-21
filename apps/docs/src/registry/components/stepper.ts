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
    { name: 'steps[].status', type: "'complete' | 'current' | 'upcoming' | 'error' | 'warning' | 'skipped' | 'cancelled'", description: '11.4: the step\'s state, named as in StatusSteps; read after the label. Wins over `current` and `completed`.' },
    { name: 'steps[].description', type: 'ReactNode', description: '11.4: any content (a date, a link).' },
    { name: 'steps[].actions', type: 'ReactNode', description: '11.4: actions under the step, e.g. Retry.' },
  ],
  examples: [{ title: 'Wizard with a form per step' }, { title: 'Statuses and actions', description: '`current={-1}` for "all done" is deprecated in 11.4 (removed in 12.0): use `status`. `nexub-migrate --rules deprecated-in-11` finds it.' }],
  a11y: {
    notes: [
      'A `nav` with an ordered list; the current step has `aria-current="step"`.',
      'Each step reads "Step 2 of 4: Billing", plus "completed" when finished.',
      'Validate each step with a Form and move `current` on its submit.',
    ],
  },
};

export default entry;
