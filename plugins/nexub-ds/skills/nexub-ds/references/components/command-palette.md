# Command Palette

A searchable command menu in a modal dialog (cmdk), with nested pages, recents and an optional Cmd+K shortcut.

- Package: `@nexub/react` · Category: Navigation · Status: stable
- Import: `import { CommandPalette } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/command-palette

## When to use

- Power users jumping to pages or running actions by name
- A global Cmd+K entry point in an app

## When not to use

- Filtering a single list on the page: use `SearchInput` or `Combobox`
- The only way to reach an action: keep it in the visible UI too

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open / onOpenChange` | `boolean / (open: boolean) => void` |  | Controlled open state. |
| `defaultOpen` | `boolean` |  | Uncontrolled initial open state. |
| `shortcut` | `string` |  | A letter that toggles the palette with Cmd (macOS) or Ctrl anywhere on the page, e.g. `'k'`. |
| `label` | `string` |  | Accessible name of the dialog. Defaults to the localised "Command palette". |
| `shouldFilter` | `boolean` |  | Set `false` when the items are already filtered, e.g. async search results. |
| `loading` | `boolean` |  | Shows a loading row and hides `Empty`. |
| `pages / defaultPages / onPagesChange` | `string[]` |  | The open page stack (ids of `CommandPalette.Page`), deepest last. Empty = the root page. |
| `recentKey / recentLimit` | `string / number` |  | Opt-in recents: the last picks on the root page are kept in localStorage under this key and shown while the query is empty. |
| `scrollLock` | `'class' \| 'style'` |  | `'class'` (strict-CSP safe) or Radix's style-tag lock. |
| `CommandPalette.Input / List / Empty / Group / Separator` | `compound` |  | Search field, results list, no-results row, a headed group (`heading`), and a decorative divider. |
| `CommandPaletteItem page` | `string` |  | Opens the `CommandPalette.Page` with this id when selected. Other props are cmdk `Command.Item` props (`onSelect`, `value`, `keywords`, `disabled`). |
| `CommandPalettePage id / title` | `string` |  | Content shown only while this page is on top. No `id` = the root page; `title` shows in the input breadcrumb. Backspace on an empty query goes back. |

## Example: Default

```tsx
import * as React from 'react';
import { Button, CommandPalette } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandPalette.Root open={open} onOpenChange={setOpen}>
        <CommandPalette.Input placeholder="Type a command or search…" />
        <CommandPalette.List>
          <CommandPalette.Empty>No results found.</CommandPalette.Empty>
          <CommandPalette.Group heading="Go to">
            <CommandPalette.Item onSelect={() => setOpen(false)}>Dashboard</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Reports</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Settings</CommandPalette.Item>
          </CommandPalette.Group>
          <CommandPalette.Separator />
          <CommandPalette.Group heading="Actions">
            <CommandPalette.Item onSelect={() => setOpen(false)}>Create project</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Invite a teammate</CommandPalette.Item>
          </CommandPalette.Group>
        </CommandPalette.List>
      </CommandPalette.Root>
    </>
  );
}
```

## Example: Nested pages

```tsx
import * as React from 'react';
import { Button, CommandPalette } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Switch project</Button>
      <CommandPalette.Root open={open} onOpenChange={setOpen}>
        <CommandPalette.Input placeholder="Search…" />
        <CommandPalette.List>
          <CommandPalette.Empty>No results found.</CommandPalette.Empty>
          <CommandPalette.Page>
            <CommandPalette.Item page="projects">Projects…</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Export report</CommandPalette.Item>
          </CommandPalette.Page>
          <CommandPalette.Page id="projects" title="Projects">
            <CommandPalette.Item onSelect={() => setOpen(false)}>Billing service</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Mobile app</CommandPalette.Item>
          </CommandPalette.Page>
        </CommandPalette.List>
      </CommandPalette.Root>
    </>
  );
}
```

## Accessibility

- Roles: dialog, combobox, listbox, option
- `Cmd/Ctrl + shortcut`: Toggles the palette when `shortcut` is set.
- `Arrow Up / Down`: Moves through items (wraps).
- `Enter`: Runs the highlighted item.
- `Backspace`: On an empty query, goes back a page.
- `Escape`: Closes the palette.
- Focus moves to the input on open and returns to the previously focused element on close.

Related: [keyboard-shortcut](keyboard-shortcut.md), [dialog](dialog.md), [search-input](search-input.md)
