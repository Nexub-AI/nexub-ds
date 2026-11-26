# Command List

A search box over a filtered, grouped list you move through with the keyboard. Inline: put it in a Dialog, Sheet, Drawer or page.

- Package: `@nexub/react` · Category: Navigation · Status: alpha
- Import: `import { CommandList } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/command-list

## When to use

- Picking one item from a long list inside a dialog or sheet: move to folder, assign to, jump to.
- A search the server answers (`onSearch` with `loading`).

## When not to use

- An app-wide launcher opened with Cmd+K: use CommandPalette.
- A form field that shows the picked value: use ComboboxField.
- Ten choices or fewer: use a RadioGroup or Select.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `CommandListItem[]` |  | `{ value, label, description?, keywords?, icon?, group?, disabled?, shortcut? }`. `description` and `keywords` are searched too; `group` lists the item under a heading; `shortcut` shows keys at the end of the row. |
| `onSelect` | `(value: string, item: CommandListItem) => void` |  | Called when an item is picked with Enter or a click. |
| `label` | `string` | `'Search'` | Accessible name of the search box and list. |
| `placeholder` | `string` | `'Search…'` | The search box placeholder. |
| `emptyText` | `ReactNode` | `'No results found.'` | Shown when the search finds nothing. |
| `onSearch / loading` | `(text: string) => void / boolean` |  | Server search: while `onSearch` is set the list is not filtered here. `loading` shows a busy row. |
| `autoFocus` | `boolean` | `true` | Focus the search box on mount. |
| `virtualizeAbove` | `number` | `100` | 12.1: with more items than this, only the rows in view render. Search (cmdk ranking), arrow keys, Home, End, Page Up/Down and screen readers (aria-setsize, aria-posinset) still cover the whole list. |
| `maxHeight` | `string` | `'20rem'` | The list scrolls past this height (any CSS length). |

## Example: Default

```tsx
import * as React from 'react';
import { CommandList } from '@nexub/react';

const items = [
  { value: 'invoice', label: 'New invoice', group: 'Create', keywords: ['bill'] },
  { value: 'customer', label: 'New customer', group: 'Create' },
  { value: 'reports', label: 'Reports', description: 'Revenue, cash flow and tax', group: 'Go to' },
  { value: 'settings', label: 'Settings', group: 'Go to', shortcut: ['⌘', ','] },
];

export default function Example() {
  const [picked, setPicked] = React.useState('');
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <div className="rounded-shape-container border border-outline-variant">
        <CommandList items={items} onSelect={setPicked} autoFocus={false} />
      </div>
      <p className="text-body-sm text-on-surface-muted">Picked: {picked || '—'}</p>
    </div>
  );
}
```

## Example: In a dialog

```tsx
import * as React from 'react';
import { Button, CommandList, Dialog } from '@nexub/react';

const spaces = ['Finance', 'Marketing', 'Operations', 'People', 'Product', 'Sales'].map((s) => ({ value: s.toLowerCase(), label: s }));

export default function Example() {
  const [open, setOpen] = React.useState(false);
  const [space, setSpace] = React.useState('Finance');
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outlined">Move to {space}…</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Move to space</Dialog.Title>
        <div className="mt-4">
          <CommandList
            label="Spaces"
            items={spaces}
            onSelect={(_, item) => {
              setSpace(item.label);
              setOpen(false);
            }}
          />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

## Example: Server search

```tsx
import * as React from 'react';
import { CommandList, type CommandListItem } from '@nexub/react';

const all = ['Acme Corp', 'Apex Labs', 'Blue Harbor', 'Cobalt Systems', 'Delta Freight', 'Evergreen Foods'];

export default function Example() {
  const [items, setItems] = React.useState<CommandListItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <div className="w-full max-w-sm rounded-shape-container border border-outline-variant">
      <CommandList
        label="Companies"
        autoFocus={false}
        items={items}
        loading={loading}
        onSearch={(text) => {
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            const q = text.toLowerCase();
            setItems(all.filter((c) => c.toLowerCase().includes(q)).map((c) => ({ value: c, label: c })));
            setLoading(false);
          }, 400);
        }}
      />
    </div>
  );
}
```

## Accessibility

- `Arrow Up / Arrow Down`: Moves the highlight; wraps at the ends.
- `Home / End`: Moves to the first or last item.
- `Enter`: Picks the highlighted item.
- Focus stays in the search box, a `combobox` that points at the highlighted `option` with `aria-activedescendant`.
- Group headings name their groups; disabled items are skipped and marked `aria-disabled`.
- While loading, the list has `aria-busy`.

Related: [command-palette](command-palette.md), [combobox](combobox.md), [combobox-field](combobox-field.md), [dialog](dialog.md), [drawer](drawer.md)
