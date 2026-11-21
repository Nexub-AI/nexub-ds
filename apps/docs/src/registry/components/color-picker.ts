import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'color-picker',
    title: 'Color Picker',
    description: 'Pick a colour from swatches or type a hex, with an optional contrast hint against a background.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.2.0',
    related: ['combobox-field', 'input', 'popover'],
  },
  usage: {
    whenToUse: ['Brand, label or theme colours from a small palette.', 'A text or accent colour that must stay readable on a known background (`contrastAgainst`).'],
    whenNotToUse: ['Free-form colour mixing (hue, saturation, alpha): not covered.', 'A few named options where the colour is incidental: use Select or RadioGroup.'],
  },
  props: [
    { name: 'value / defaultValue', type: 'string', default: "'#000000'", description: 'The colour as `#rrggbb`.' },
    { name: 'onValueChange', type: '(hex: string) => void', description: 'Called with a lowercase `#rrggbb`.' },
    { name: 'swatches', type: 'Array<string | { value: string; label?: string }>', description: 'The colours offered. A `label` is read out instead of the hex. Defaults to neutrals and hues.' },
    { name: 'contrastAgainst', type: 'string', description: 'A background hex: shows the WCAG 2.x contrast ratio and whether it passes AA for text (4.5:1).' },
    { name: 'disabled / readOnly / invalid', type: 'boolean', description: 'Field states. Read-only stays focusable but does not open.' },
    { name: 'name', type: 'string', description: 'A hidden input posts the value with a plain form.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the trigger.' },
    { name: 'sheet', type: "boolean | 'auto'", default: "'auto'", description: 'The popover as a bottom sheet below 768px.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Contrast hint' }, { title: 'Named swatches' }],
  a11y: {
    keyboard: [
      { key: 'Enter / Space', description: 'Opens the popover with focus on the picked swatch.' },
      { key: 'Arrow keys', description: 'Move between swatches and pick (six per row).' },
      { key: 'Home / End', description: 'First and last swatch.' },
      { key: 'Tab', description: 'Moves to the hex field. Enter or leaving it applies the hex.' },
      { key: 'Escape', description: 'Closes the popover.' },
    ],
    notes: [
      'The trigger is a `combobox` named by `aria-label`; its text is the hex.',
      'Swatches are a `radiogroup` with one tab stop. An invalid hex keeps the last colour and marks the field invalid.',
      'The contrast hint is announced politely when it changes.',
    ],
  },
};

export default entry;
