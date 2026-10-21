# Split Button

A primary action with related secondary actions behind a chevron, as one connected control.

- Package: `@nexub/react` · Category: Actions · Status: beta
- Import: `import { SplitButton } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/split-button

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `menuLabel` (required) | `string` |  | Accessible name of the menu toggle, e.g. "More save options". |
| `menu` (required) | `ReactNode` |  | `DropdownMenu.Item`s for the secondary actions. |
| `align` | `'start' \| 'end'` | `'end'` | Menu alignment against the toggle. |
| `variant / size / tone` | `Button props` |  | Applied to both halves. |

## Example: Default

```tsx
<SplitButton
  onClick={save}
  menuLabel="More save options"
  menu={
    <>
      <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
      <DropdownMenu.Item>Save a copy</DropdownMenu.Item>
    </>
  }
>
  Save
</SplitButton>
```

## Example: Outlined

```tsx
<SplitButton variant="outlined" menuLabel="More export options" menu={<DropdownMenu.Item>CSV</DropdownMenu.Item>}>
  Export
</SplitButton>
```

Related: [button](button.md), [button-group](button-group.md), [dropdown-menu](dropdown-menu.md)
