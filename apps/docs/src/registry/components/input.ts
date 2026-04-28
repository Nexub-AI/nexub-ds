import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'input',
    title: 'Input',
    description: 'Text input field for forms. Supports size variants, icons, addons, and validation states.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    related: ['textarea', 'number-input', 'password-input', 'search-input'],
  },
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Control height and font size.' },
    { name: 'invalid', type: 'boolean', default: 'false', required: false, description: 'Applies error ring styling.' },
    { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the input.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text.' },
    { name: 'type', type: 'string', default: "'text'", required: false, description: 'HTML input type attribute.' },
    { name: 'leadingIcon', type: 'React.ReactNode', required: false, description: 'Icon rendered at the start of the input.' },
    { name: 'trailingIcon', type: 'React.ReactNode', required: false, description: 'Icon rendered at the end of the input.' },
    { name: 'leadingAddon', type: 'string', required: false, description: 'Text addon rendered before the input (e.g. "https://").' },
    { name: 'trailingAddon', type: 'string', required: false, description: 'Text addon rendered after the input (e.g. ".com").' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Input placeholder="Enter value…" />`,
    },
    {
      title: 'Sizes',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
  <Input size="sm" placeholder="Small" />
  <Input size="md" placeholder="Medium" />
  <Input size="lg" placeholder="Large" />
</div>`,
    },
    {
      title: 'Invalid state',
      code: `<Input invalid placeholder="Invalid value" />`,
    },
    {
      title: 'With label and helper',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '320px' }}>
  <Label htmlFor="email">Email address</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
  <HelperText>We'll never share your email.</HelperText>
</div>`,
    },
  ],
  usage: {
    whenToUse: [
    "Capturing short free-form text (name, email, search term)",
    "Single-line data entry within a form",
    "Filtering or searching a list of items",
    "Inline editing of a single value",
    ],
    whenNotToUse: [
    "Multi-line text — use Textarea instead",
    "Choosing from a fixed list of options — use Select or Combobox",
    "Numeric stepping — use NumberInput for increment/decrement control",
    "Passwords — use PasswordInput which toggles visibility",
    ],
  },
  playground: {
    controls: [
      { kind: 'select', name: 'size', options: ['sm', 'md', 'lg'], default: 'md' },
      { kind: 'text', name: 'placeholder', default: 'Enter value…', placeholder: 'Placeholder text' },
      { kind: 'switch', name: 'invalid', default: false },
      { kind: 'switch', name: 'disabled', default: false },
      { kind: 'switch', name: 'showLabel', default: false, omitFromCode: true },
      { kind: 'text', name: 'labelText', default: 'Email address', omitFromCode: true },
      { kind: 'switch', name: 'showHelper', default: false, omitFromCode: true },
      { kind: 'text', name: 'helperText', default: "We'll never share your email.", omitFromCode: true },
    ],
  },
  a11y: {
    roles: ['textbox'],
    keyboard: [
      { key: 'Tab', description: 'Moves focus to the input.' },
      { key: 'Esc', description: 'Browsers may revert recent changes (autofill suggestions).' },
    ],
    focus: [
      'Visible focus ring on `:focus-visible`. Pair with a `<Label htmlFor>` so clicking the label moves focus into the field.',
    ],
    screenReader: [
      '`invalid` toggles `aria-invalid="true"` so AT users hear the error state.',
      'Use `aria-describedby` to associate `HelperText` or error messages.',
    ],
  },
};

export default entry;
