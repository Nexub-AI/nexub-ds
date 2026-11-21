# Icon Picker

Pick an icon from @nexub/icons in a searchable grid with recent picks and optional categories. A popover, a bottom sheet on phones.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { IconPicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/icon-picker

## When to use

- An icon for a space, doc, category or saved view.
- The value is the icon’s export name, so it can be stored and drawn later.

## When not to use

- An emoji: use EmojiPicker.
- Icons outside @nexub/icons: build a grid of your own.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / defaultValue` | `string \| null` |  | The picked icon’s export name, e.g. `"CalendarDays"`. `null` for none. |
| `onValueChange` | `(name: string) => void` |  | Called with the picked name. The picker closes. |
| `icons` | `string[]` |  | Only these icons, in this order. Default: every @nexub/icons export, A–Z. |
| `categories` | `{ label: string; icons: string[] }[]` |  | Icons under headings, with a row of buttons to jump between them. Overrides `icons`. |
| `placeholder` | `string` | `'Pick an icon'` | Shown on the trigger when nothing is picked. |
| `recent` | `string[]` |  | Recent picks, newest first. Unset: the last 16 picks are kept in localStorage (`nx-icon-recent`). |
| `name` | `string` |  | A hidden input posts the value with a plain form. |
| `disabled / readOnly / invalid / required` | `boolean` |  | Field states, as on Select. Read-only stays focusable and does not open. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of the trigger. |
| `sheet` | `boolean \| 'auto'` | `'auto'` | The grid as a bottom sheet below 768px. |
| `IconPicker.Panel` | `component` |  | The grid alone (`value`, `onValueChange`, `icons`, `categories`, `recent`, `autoFocus`), for any popover or page. |

## Example: Default

```tsx
import * as React from 'react';
import { IconPicker } from '@nexub/react';

export default function Example() {
  const [icon, setIcon] = React.useState<string | null>('CalendarDays');
  return <IconPicker aria-label="Menu icon" value={icon} onValueChange={setIcon} />;
}
```

## Example: Categories

```tsx
import { IconPicker } from '@nexub/react';

const categories = [
  { label: 'Files', icons: ['FileText', 'Folder', 'Paperclip', 'Download'] },
  { label: 'People', icons: ['User', 'Users', 'Mail', 'Phone'] },
  { label: 'Time', icons: ['Calendar', 'CalendarDays', 'Clock', 'Bell'] },
];

export default function Example() {
  return <IconPicker aria-label="Category icon" categories={categories} defaultValue="Folder" />;
}
```

## Example: States

```tsx
import { IconPicker } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-4">
      <IconPicker aria-label="Invalid" invalid />
      <IconPicker aria-label="Read-only" readOnly defaultValue="Star" />
      <IconPicker aria-label="Disabled" disabled defaultValue="Bell" />
    </div>
  );
}
```

## Accessibility

- Roles: combobox (trigger), listbox with a group per section, option
- `Enter / Space / Arrow Down`: On the trigger: opens the picker with focus in the search box.
- `Arrow Down`: From the search box: into the grid.
- `Arrow keys`: Move between icons; Arrow Up from the first row returns to the search box.
- `Home / End`: First or last icon in the row; with Ctrl, in the whole list.
- `Enter / Space`: Picks the focused icon. Enter in the search box picks the first result.
- `Escape`: Closes without changing the value.
- Each icon is named from its export name ("ArrowUpRight" reads "Arrow up right").
- The icon set is loaded with a dynamic import when the picker opens or shows a value.

Related: [emoji-picker](emoji-picker.md), [icon](icon.md), [combobox-field](combobox-field.md)
