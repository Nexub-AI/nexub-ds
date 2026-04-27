import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'button',
    title: 'Button',
    description: 'Triggers an action or event. Supports multiple variants, sizes, and semantic tones.',
    category: 'Actions',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'link' | 'destructive'", default: "'primary'", required: false, description: 'Visual style of the button.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Control height and padding.' },
    { name: 'loading', type: 'boolean', default: 'false', required: false, description: 'Shows a spinner and disables interaction.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the button.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', required: false, description: 'Stretches the button to fill its container.' },
    { name: 'leadingIcon', type: 'React.ReactNode', required: false, description: 'Icon rendered before the label.' },
    { name: 'trailingIcon', type: 'React.ReactNode', required: false, description: 'Icon rendered after the label.' },
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Semantic colour tone — overrides the variant colour with a semantic palette.' },
    { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Button variant="primary">Click me</Button>`,
    },
    {
      title: 'Variants',
      code: `<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
  <Button variant="primary">Primary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="subtle">Subtle</Button>
  <Button variant="link">Link</Button>
</div>`,
    },
    {
      title: 'Sizes',
      code: `<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
  <Button size="xs" variant="primary">XSmall</Button>
  <Button size="sm" variant="primary">Small</Button>
  <Button size="md" variant="primary">Medium</Button>
  <Button size="lg" variant="primary">Large</Button>
</div>`,
    },
    {
      title: 'States',
      code: `<div style={{ display: 'flex', gap: '8px' }}>
  <Button variant="primary" loading>Loading</Button>
  <Button variant="outline" disabled>Disabled</Button>
</div>`,
    },
  ],
  usage: {
    whenToUse: [
    "Triggering a primary or secondary action (submit, save, confirm)",
    "Navigating users to another page or step in a flow",
    "Opening a dialog, drawer, or modal overlay",
    "Destructive actions that need a visible, labelled control",
    ],
    whenNotToUse: [
    "Inline text navigation — use a Link instead",
    "Icon-only controls — use IconButton for touch target compliance",
    "Selecting among multiple options — use ToggleGroup or SegmentedControl",
    "Passive information display with no action",
    ],
  },
};

export default entry;
