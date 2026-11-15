# Dropdown Menu

A menu of actions opened from a button, built on Radix.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { DropdownMenu } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/dropdown-menu

## When to use

- Secondary actions behind a "More" button
- A short set of options that change a view

## When not to use

- Picking a form value: use `Select`
- Site navigation: use `NavigationMenu` or `TopNav`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `DropdownMenu.Root` | `compound` |  | Holds the open state (`open`, `onOpenChange`, `defaultOpen`, `modal`). |
| `DropdownMenu.Trigger` | `compound` |  | The button that opens the menu. Use `asChild` with a `Button` or `IconButton`. |
| `DropdownMenu.Portal / Content` | `compound` |  | Renders the floating menu in a portal (`side`, `align`, `sideOffset` default 4). |
| `DropdownMenu.Item` | `compound` |  | An action (`onSelect`, `disabled`). |
| `DropdownMenu.CheckboxItem / RadioGroup / RadioItem` | `compound` |  | Toggle and single-choice items (`checked`, `onCheckedChange`; `value`, `onValueChange`). |
| `DropdownMenu.Label / Group / Separator` | `compound` |  | Section heading, grouping and divider. |
| `DropdownMenu.Sub / SubTrigger / SubContent` | `compound` |  | A nested submenu. |

## Example: Default

```tsx
import { DropdownMenu, IconButton } from '@nexub/react';
import { MoreHorizontal } from '@nexub/icons';

export default function Example() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="ghost" label="More actions"><MoreHorizontal size="sm" /></IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Project</DropdownMenu.Label>
          <DropdownMenu.Item>Rename</DropdownMenu.Item>
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Transfer ownership</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Archive</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

## Example: Checkbox and radio items

```tsx
import * as React from 'react';
import { Button, DropdownMenu } from '@nexub/react';

export default function Example() {
  const [showArchived, setShowArchived] = React.useState(false);
  const [sort, setSort] = React.useState('updated');
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outlined">View options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
            Show archived
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Sort by</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenu.RadioItem value="updated">Last updated</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="owner">Owner</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

## Accessibility

- Roles: menu, menuitem, menuitemcheckbox, menuitemradio
- `Enter / Space / Arrow Down`: Opens the menu from the trigger.
- `Arrow Up / Down`: Moves between items.
- `Arrow Right / Left`: Opens or closes a submenu.
- `Escape`: Closes the menu and returns focus to the trigger.

Related: [split-button](split-button.md), [context-menu](context-menu.md), [popover](popover.md)
