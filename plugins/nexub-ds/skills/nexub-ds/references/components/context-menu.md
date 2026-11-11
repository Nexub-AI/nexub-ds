# Context Menu

A menu that opens at the pointer on right-click (or long-press), built on Radix.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { ContextMenu } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/context-menu

## When to use

- Shortcuts to actions on an item: rename, duplicate, delete

## When not to use

- The only way to reach an action: right-click is hard to discover and needs a visible alternative, such as a `DropdownMenu`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ContextMenu.Root` | `compound` |  | Holds the open state (`onOpenChange`, `modal`). |
| `ContextMenu.Trigger` | `compound` |  | The area that opens the menu on right-click. Use `asChild` to make your element the area. |
| `ContextMenu.Portal / Content` | `compound` |  | Renders the floating menu in a portal. |
| `ContextMenu.Item` | `compound` |  | An action (`onSelect`, `disabled`). |
| `ContextMenu.CheckboxItem / RadioGroup / RadioItem` | `compound` |  | Toggle and single-choice items (`checked`, `onCheckedChange`; `value`, `onValueChange`). |
| `ContextMenu.Label / Group / Separator` | `compound` |  | Section heading, grouping and divider. |
| `ContextMenu.Sub / SubTrigger / SubContent` | `compound` |  | A nested submenu. |

## Example: Default

```tsx
import { ContextMenu } from '@nexub/react';

export default function Example() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="flex h-32 w-64 select-none items-center justify-center rounded-shape-container border-2 border-dashed border-[var(--color-outline-variant)] text-body-sm text-[var(--color-on-surface-muted)]">
        Right-click here
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.Item>Rename</ContextMenu.Item>
          <ContextMenu.Item>Duplicate</ContextMenu.Item>
          <ContextMenu.Item>Copy link</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>Move to trash</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
```

## Accessibility

- Roles: menu, menuitem, menuitemcheckbox, menuitemradio
- `Shift + F10 / Menu key`: Opens the menu from the focused trigger.
- `Arrow Up / Down`: Moves between items.
- `Enter / Space`: Activates the item.
- `Escape`: Closes the menu.

Related: [dropdown-menu](dropdown-menu.md), [menubar](menubar.md)
