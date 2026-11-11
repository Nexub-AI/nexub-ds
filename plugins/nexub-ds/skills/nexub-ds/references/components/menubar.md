# Menubar

A horizontal bar of menus, like a desktop app’s File / Edit / View, built on Radix.

- Package: `@nexub/react` · Category: Navigation · Status: stable
- Import: `import { Menubar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/menubar

## When to use

- Editors and tools with many commands grouped like a desktop app

## When not to use

- Site navigation: use `NavigationMenu` or `TopNav`
- A few icon actions: use `Toolbar`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Menubar.Root` | `compound` |  | The bar (`value`, `onValueChange`, `loop`). |
| `Menubar.Menu` | `compound` |  | One menu: a trigger and its content. |
| `Menubar.Trigger` | `compound` |  | The menu’s button in the bar. |
| `Menubar.Portal / Content` | `compound` |  | Renders the floating menu in a portal (`sideOffset` default 8). |
| `Menubar.Item` | `compound` |  | An action (`onSelect`, `disabled`). |
| `Menubar.CheckboxItem / RadioGroup / RadioItem` | `compound` |  | Toggle and single-choice items. |
| `Menubar.Label / Group / Separator / Arrow` | `compound` |  | Section heading, grouping, divider and an optional arrow. |
| `Menubar.Sub / SubTrigger / SubContent` | `compound` |  | A nested submenu. |

## Example: Default

```tsx
import { Menubar } from '@nexub/react';

export default function Example() {
  return (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>New file</Menubar.Item>
            <Menubar.Item>Open…</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item>Save</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>Undo</Menubar.Item>
            <Menubar.Item>Redo</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item>Copy</Menubar.Item>
            <Menubar.Item>Paste</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>Zoom in</Menubar.Item>
            <Menubar.Item>Zoom out</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}
```

## Accessibility

- Roles: menubar, menu, menuitem
- `Arrow Left / Right`: Moves between menus in the bar, and between open menus.
- `Enter / Space / Arrow Down`: Opens the focused menu.
- `Escape`: Closes the menu.

Related: [dropdown-menu](dropdown-menu.md), [toolbar](toolbar.md), [context-menu](context-menu.md)
