# Emoji Picker

Pick an emoji from a searchable grid with categories, recent picks and skin tone. A popover, a bottom sheet on phones.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { EmojiPicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/emoji-picker

## When to use

- An emoji for a space, doc, label or status.
- A reaction picker: `EmojiPicker.Panel` inside your own popover.

## When not to use

- An icon from the design system: use IconPicker.
- Emoji inside running text: let the keyboard’s emoji input handle it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / defaultValue` | `string \| null` |  | The picked emoji, skin tone included. `null` for none. |
| `onValueChange` | `(emoji: string) => void` |  | Called with the picked emoji. The picker closes. |
| `placeholder` | `string` | `'Pick an emoji'` | Shown on the trigger when nothing is picked. |
| `recent` | `string[]` |  | Recent picks, newest first. Unset: the last 16 picks are kept in localStorage (`nx-emoji-recent`). |
| `skinTone / defaultSkinTone` | `0 \| 1 \| 2 \| 3 \| 4 \| 5` |  | Skin tone for emoji that take one (0 is the default yellow). Unset: the last tone chosen on this device. |
| `onSkinToneChange` | `(tone: SkinTone) => void` |  | Called when the tone changes. |
| `name` | `string` |  | A hidden input posts the value with a plain form. |
| `disabled / readOnly / invalid / required` | `boolean` |  | Field states, as on Select. Read-only stays focusable and does not open. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of the trigger. |
| `sheet` | `boolean \| 'auto'` | `'auto'` | The grid as a bottom sheet below 768px. |
| `EmojiPicker.Panel` | `component` |  | The grid alone (`value`, `onValueChange`, `recent`, skin tone props, `autoFocus`), for any popover or page. |

## Example: Default

```tsx
import * as React from 'react';
import { EmojiPicker } from '@nexub/react';

export default function Example() {
  const [emoji, setEmoji] = React.useState<string | null>('🚀');
  return <EmojiPicker aria-label="Space icon" value={emoji} onValueChange={setEmoji} />;
}
```

## Example: Panel in a popover

```tsx
import * as React from 'react';
import { Button, EmojiPickerPanel, Popover } from '@nexub/react';

export default function Example() {
  const [reaction, setReaction] = React.useState('👍');
  const [open, setOpen] = React.useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outlined">React {reaction}</Button>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <EmojiPickerPanel
          aria-label="Reactions"
          value={reaction}
          onValueChange={(e) => {
            setReaction(e);
            setOpen(false);
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
```

## Example: States

```tsx
import { EmojiPicker } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-4">
      <EmojiPicker aria-label="Invalid" invalid />
      <EmojiPicker aria-label="Read-only" readOnly defaultValue="📚" />
      <EmojiPicker aria-label="Disabled" disabled defaultValue="🎯" />
    </div>
  );
}
```

## Accessibility

- Roles: combobox (trigger), listbox with a group per category, option
- `Enter / Space / Arrow Down`: On the trigger: opens the picker with focus in the search box.
- `Arrow Down`: From the search box: into the grid.
- `Arrow keys`: Move between emoji; Arrow Up from the first row returns to the search box.
- `Home / End`: First or last emoji in the row; with Ctrl, in the whole list.
- `Enter / Space`: Picks the focused emoji. Enter in the search box picks the first result.
- `Escape`: Closes without changing the value.
- Each emoji is named by its CLDR-style name ("party popper"), not read as a glyph.
- The emoji set loads when the picker opens, in its own chunk, so it stays out of the main bundle.

Related: [icon-picker](icon-picker.md), [combobox-field](combobox-field.md), [popover](popover.md)
