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
    updatedIn: '1.7.0',
    related: ['icon-button', 'button-group', 'link'],
  },
  props: [
    { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'link' | 'destructive'", default: "'primary'", required: false, description: 'Visual style of the button.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", required: false, description: 'Control height and padding.' },
    { name: 'status', type: "'idle' | 'loading' | 'success' | 'error'", default: "'idle'", required: false, description: 'Async feedback (beta, 1.7.0). `loading` shows a spinner and blocks clicks but keeps focus; `success` draws a check; `error` shakes once. The label stays in flow, so the width holds.' },
    { name: 'loading', type: 'boolean', default: 'false', required: false, description: 'Alias for `status="loading"`.' },
    { name: 'loadingLabel', type: 'string', default: "'Loading'", required: false, description: 'Announced when `status` becomes `loading`.' },
    { name: 'successLabel', type: 'string', default: "'Done'", required: false, description: 'Announced on `success`. When set, it also replaces the visible label (with a check) instead of showing the check alone.' },
    { name: 'errorLabel', type: 'string', default: "'Something went wrong'", required: false, description: 'Announced on `error`.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the button.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', required: false, description: 'Stretches the button to fill its container.' },
    { name: 'leadingIcon', type: 'React.ReactNode', required: false, description: 'Icon rendered before the label.' },
    { name: 'trailingIcon', type: 'React.ReactNode', required: false, description: 'Icon rendered after the label.' },
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Semantic colour tone — overrides the variant colour with a semantic palette.' },
    { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element (Radix Slot). `status` and `loading` have no effect with `asChild`.' },
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
    {
      title: 'Async',
      description: 'Drive `status` from the request. Each click here moves to the next status.',
      code: `function SaveButton() {
  const [status, setStatus] = React.useState<ButtonStatus>('idle');

  async function save() {
    setStatus('loading');
    try {
      await saveProfile();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <Button status={status} loadingLabel="Saving" successLabel="Saved" errorLabel="Couldn't save" onClick={save}>
      Save
    </Button>
  );
}`,
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
  playground: {
    controls: [
      { kind: 'select', name: 'variant', options: ['primary', 'secondary', 'outline', 'ghost', 'subtle', 'link', 'destructive'], default: 'primary' },
      { kind: 'select', name: 'size', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
      { kind: 'select', name: 'tone', options: ['none', 'neutral', 'info', 'success', 'warning', 'danger'], default: 'none' },
      { kind: 'switch', name: 'loading', default: false },
      { kind: 'switch', name: 'disabled', default: false },
      { kind: 'switch', name: 'fullWidth', default: false },
      { kind: 'text', name: 'children', default: 'Click me', placeholder: 'Button label' },
    ],
    childrenProp: 'children',
  },
  matrix: {
    rowsProp: 'variant',
    rows: ['primary', 'outline', 'ghost', 'subtle', 'link'],
    colsProp: 'size',
    cols: ['xs', 'sm', 'md', 'lg', 'xl'],
    childrenDefault: 'Button',
  },
  a11y: {
    roles: ['button'],
    keyboard: [
      { key: 'Space', description: 'Activates the focused button.' },
      { key: 'Enter', description: 'Activates the focused button.' },
      { key: 'Tab', description: 'Moves focus to the button in document order.' },
    ],
    focus: [
      'Receives focus in document order; `disabled` removes it from the tab sequence.',
      'Visible focus ring uses `--color-border-focus` and meets WCAG 2.4.7 contrast.',
    ],
    screenReader: [
      'Announces the visible label plus the implicit "button" role.',
      'While loading the button sets `aria-busy` and `aria-disabled` (not `disabled`), so focus stays on it and clicks are ignored.',
      'A button with `status` or `loading` renders a polite `role="status"` region next to it that announces `loadingLabel`, `successLabel` or `errorLabel` as the status changes.',
    ],
    notes: [
      'Pair icon-only triggers with `IconButton` for a 44×44 touch target.',
    ],
  },
};

export default entry;
