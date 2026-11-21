import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'emoji-picker',
    title: 'Emoji Picker',
    description: 'Pick an emoji from a searchable grid with categories, recent picks and skin tone. A popover, a bottom sheet on phones.',
    category: 'Form Controls',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '11.2.0',
    related: ['icon-picker', 'combobox-field', 'popover'],
  },
  usage: {
    whenToUse: ['An emoji for a space, doc, label or status.', 'A reaction picker: `EmojiPicker.Panel` inside your own popover.'],
    whenNotToUse: ['An icon from the design system: use IconPicker.', 'Emoji inside running text: let the keyboard’s emoji input handle it.'],
  },
  props: [
    { name: 'value / defaultValue', type: 'string | null', description: 'The picked emoji, skin tone included. `null` for none.' },
    { name: 'onValueChange', type: '(emoji: string) => void', description: 'Called with the picked emoji. The picker closes.' },
    { name: 'placeholder', type: 'string', default: "'Pick an emoji'", description: 'Shown on the trigger when nothing is picked.' },
    { name: 'recent', type: 'string[]', description: 'Recent picks, newest first. Unset: the last 16 picks are kept in localStorage (`nx-emoji-recent`).' },
    { name: 'skinTone / defaultSkinTone', type: '0 | 1 | 2 | 3 | 4 | 5', description: 'Skin tone for emoji that take one (0 is the default yellow). Unset: the last tone chosen on this device.' },
    { name: 'onSkinToneChange', type: '(tone: SkinTone) => void', description: 'Called when the tone changes.' },
    { name: 'name', type: 'string', description: 'A hidden input posts the value with a plain form.' },
    { name: 'disabled / readOnly / invalid / required', type: 'boolean', description: 'Field states, as on Select. Read-only stays focusable and does not open.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the trigger.' },
    { name: 'sheet', type: "boolean | 'auto'", default: "'auto'", description: 'The grid as a bottom sheet below 768px.' },
    { name: 'EmojiPicker.Panel', type: 'component', description: 'The grid alone (`value`, `onValueChange`, `recent`, skin tone props, `autoFocus`), for any popover or page.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Panel in a popover' }, { title: 'States' }],
  a11y: {
    roles: ['combobox (trigger)', 'listbox with a group per category', 'option'],
    keyboard: [
      { key: 'Enter / Space / Arrow Down', description: 'On the trigger: opens the picker with focus in the search box.' },
      { key: 'Arrow Down', description: 'From the search box: into the grid.' },
      { key: 'Arrow keys', description: 'Move between emoji; Arrow Up from the first row returns to the search box.' },
      { key: 'Home / End', description: 'First or last emoji in the row; with Ctrl, in the whole list.' },
      { key: 'Enter / Space', description: 'Picks the focused emoji. Enter in the search box picks the first result.' },
      { key: 'Escape', description: 'Closes without changing the value.' },
    ],
    notes: [
      'Each emoji is named by its CLDR-style name ("party popper"), not read as a glyph.',
      'The emoji set loads when the picker opens, in its own chunk, so it stays out of the main bundle.',
    ],
  },
};

export default entry;
