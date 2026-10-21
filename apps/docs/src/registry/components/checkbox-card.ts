import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'checkbox-card',
    title: 'Checkbox Card',
    description: 'A checkbox drawn as a whole card: title, description and optional icon. Pick any number.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.6.0',
    related: ['checkbox', 'radio-card', 'card'],
  },
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'The card’s accessible name.' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Secondary text, exposed as the accessible description.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Leading icon. Turns primary when checked.' },
    { name: 'checked / defaultChecked', type: 'boolean', required: false, description: 'Controlled or initial state. No indeterminate state.' },
    { name: 'onCheckedChange', type: '(checked: boolean) => void', required: false, description: 'Called with a plain boolean.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Extra content under the description. Keep it non-interactive.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the card.' },
  ],
  examples: [
    {
      title: 'Features',
      description: 'Lay checkbox cards out with any grid; there is no group component.',
      code: `<fieldset className="grid gap-3 sm:grid-cols-3">
  <legend className="sr-only">Add-ons</legend>
  <CheckboxCard icon={<Bell />} title="Alerts" description="Email and push notifications." defaultChecked />
  <CheckboxCard icon={<Shield />} title="Audit log" description="Keep a year of activity." />
  <CheckboxCard icon={<Zap />} title="Automations" description="Run rules on new records." />
</fieldset>`,
    },
    {
      title: 'Disabled',
      code: `<CheckboxCard title="SSO" description="Available on Enterprise." disabled />
<CheckboxCard title="Data residency" description="Included in your plan." defaultChecked disabled />`,
    },
  ],
  a11y: {
    roles: ['checkbox'],
    keyboard: [
      { key: 'Tab', description: 'Moves focus to the card.' },
      { key: 'Space', description: 'Toggles the card.' },
    ],
    screenReader: [
      'The title is the accessible name and the description is the accessible description.',
      'Wrap related cards in a `fieldset` with a `legend` so the set has a name.',
    ],
  },
};

export default entry;
