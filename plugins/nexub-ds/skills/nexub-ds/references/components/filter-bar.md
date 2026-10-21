# FilterBar

Search + filter toolbar pattern for data-heavy list or table views.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { FilterBar } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/filter-bar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder text for the search input. |
| `searchValue` | `string` |  | Controlled search value. |
| `onSearch` | `(value: string) => void` |  | Callback when search value changes. |
| `filters` | `React.ReactNode` |  | Filter controls rendered to the right of search. |
| `actions` | `React.ReactNode` |  | Action buttons (e.g. "Export") rendered on the far right. |

## Example: Default

```tsx
<FilterBar
  searchPlaceholder="Search users…"
  onSearch={(v) => {}}
  filters={
    <Select.Root>
      <Select.Trigger><Select.Value placeholder="Status" /></Select.Trigger>
      <Select.Content>
        <Select.Item value="active">Active</Select.Item>
        <Select.Item value="inactive">Inactive</Select.Item>
      </Select.Content>
    </Select.Root>
  }
  actions={<Button variant="outline" size="sm">Export</Button>}
/>
```
