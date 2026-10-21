import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'radio-card',
    title: 'Radio Card',
    description: 'A radio group where each option is a whole card: title, description and optional icon, one choice.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.6.0',
    related: ['radio-group', 'checkbox-card', 'card'],
  },
  props: [
    { name: 'RadioCardGroup columns', type: '1 | 2 | 3 | 4', default: '1', required: false, description: 'Grid columns. Collapses to one column on narrow screens.' },
    { name: 'RadioCardGroup value / defaultValue / onValueChange', type: 'string', required: false, description: 'Radix RadioGroup props; the group also takes `disabled`, `name`, `required`.' },
    { name: 'value', type: 'string', required: true, description: 'The option this card selects.' },
    { name: 'title', type: 'ReactNode', required: true, description: 'The card’s accessible name.' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Secondary text, exposed as the accessible description.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Leading icon. Turns primary when selected.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Extra content under the description. Keep it non-interactive: the whole card is the control.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables this card only.' },
  ],
  examples: [
    {
      title: 'Plan picker',
      code: `const [plan, setPlan] = React.useState('team');

<RadioCardGroup aria-label="Plan" columns={3} value={plan} onValueChange={setPlan}>
  <RadioCard value="solo" icon={<User />} title="Solo" description="One seat, core features.">
    <span className="text-sm font-medium">$0 / month</span>
  </RadioCard>
  <RadioCard value="team" icon={<Users />} title="Team" description="Up to 20 seats, shared workspaces.">
    <span className="text-sm font-medium">$12 / seat</span>
  </RadioCard>
  <RadioCard value="enterprise" icon={<Building2 />} title="Enterprise" description="SSO, audit logs, priority support.">
    <span className="text-sm font-medium">Contact sales</span>
  </RadioCard>
</RadioCardGroup>`,
    },
    {
      title: 'Columns',
      description: 'Two columns from the sm breakpoint up, one below.',
      code: `<RadioCardGroup aria-label="Billing" columns={2} defaultValue="yearly">
  <RadioCard value="monthly" title="Monthly" description="Billed every month." />
  <RadioCard value="yearly" title="Yearly" description="Two months free." />
</RadioCardGroup>`,
    },
    {
      title: 'Disabled',
      description: 'Disable one card, or pass `disabled` to the group to disable all of them.',
      code: `<RadioCardGroup aria-label="Region" columns={2} defaultValue="eu">
  <RadioCard value="eu" title="Europe" description="Frankfurt" />
  <RadioCard value="us" title="United States" description="Virginia" />
  <RadioCard value="ap" title="Asia Pacific" description="Coming soon" disabled />
</RadioCardGroup>`,
    },
  ],
  usage: {
    whenToUse: [
      'Two to six options that each need a sentence of explanation, like plans or regions.',
      'A choice important enough to deserve the space.',
    ],
    whenNotToUse: [
      'Short labels with no description: use RadioGroup.',
      'More than six options: use Select or Combobox.',
      'Cards that hold links or buttons: the whole card is the control, so use Card with CardLink.',
    ],
  },
  a11y: {
    roles: ['radiogroup', 'radio (each card)'],
    keyboard: [
      { key: 'Tab', description: 'Moves focus into the group, to the selected card.' },
      { key: 'Arrow keys', description: 'Move between cards and select.' },
      { key: 'Space', description: 'Selects the focused card.' },
    ],
    screenReader: [
      'The title is the accessible name and the description is the accessible description.',
      'Give the group an `aria-label` or `aria-labelledby`.',
    ],
  },
};

export default entry;
