# Color Picker

Pick a colour from swatches or type a hex, with an optional contrast hint against a background.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { ColorPicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/color-picker

## When to use

- Brand, label or theme colours from a small palette.
- A text or accent colour that must stay readable on a known background (`contrastAgainst`).

## When not to use

- Free-form colour mixing (hue, saturation, alpha): not covered.
- A few named options where the colour is incidental: use Select or RadioGroup.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / defaultValue` | `string` | `'#000000'` | The colour as `#rrggbb`. |
| `onValueChange` | `(hex: string) => void` |  | Called with a lowercase `#rrggbb`. |
| `swatches` | `Array<string \| { value: string; label?: string }>` |  | The colours offered. A `label` is read out instead of the hex. Defaults to neutrals and hues. |
| `contrastAgainst` | `string` |  | A background hex: shows the WCAG 2.x contrast ratio and whether it passes AA for text (4.5:1). |
| `disabled / readOnly / invalid` | `boolean` |  | Field states. Read-only stays focusable but does not open. |
| `name` | `string` |  | A hidden input posts the value with a plain form. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of the trigger. |
| `sheet` | `boolean \| 'auto'` | `'auto'` | The popover as a bottom sheet below 768px. |

## Example: Default

```tsx
import * as React from 'react';
import { ColorPicker } from '@nexub/react';

export default function Example() {
  const [color, setColor] = React.useState('#2563eb');
  return <ColorPicker aria-label="Label colour" value={color} onValueChange={setColor} />;
}
```

## Example: Contrast hint

```tsx
import * as React from 'react';
import { ColorPicker } from '@nexub/react';

export default function Example() {
  const [color, setColor] = React.useState('#777777');
  return <ColorPicker aria-label="Text colour" value={color} onValueChange={setColor} contrastAgainst="#ffffff" />;
}
```

## Example: Named swatches

```tsx
import * as React from 'react';
import { ColorPicker } from '@nexub/react';

const swatches = [
  { value: '#16a34a', label: 'Done' },
  { value: '#d97706', label: 'In review' },
  { value: '#dc2626', label: 'Blocked' },
  { value: '#64748b', label: 'Backlog' },
];

export default function Example() {
  return <ColorPicker aria-label="Status colour" swatches={swatches} defaultValue="#16a34a" />;
}
```

## Accessibility

- `Enter / Space`: Opens the popover with focus on the picked swatch.
- `Arrow keys`: Move between swatches and pick (six per row).
- `Home / End`: First and last swatch.
- `Tab`: Moves to the hex field. Enter or leaving it applies the hex.
- `Escape`: Closes the popover.
- The trigger is a `combobox` named by `aria-label`; its text is the hex.
- Swatches are a `radiogroup` with one tab stop. An invalid hex keeps the last colour and marks the field invalid.
- The contrast hint is announced politely when it changes.

Related: [combobox-field](combobox-field.md), [input](input.md), [popover](popover.md)
