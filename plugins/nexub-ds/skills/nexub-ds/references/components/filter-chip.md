# Filter Chip

Interactive chip for filtering, supports selected/unselected state.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { FilterChip } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/filter-chip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `selected` | `boolean` |  | Controlled selected state of the chip. |
| `onSelectedChange` | `(selected: boolean) => void` |  | Called when the selected state changes. |
| `disabled` | `boolean` |  | Disables the chip. |
| `size` | `'sm' \| 'md'` |  | Controls chip size. |

## Example: Default

```tsx
<div style={{ display: 'flex', gap: '8px' }}>
  <FilterChip>All</FilterChip>
  <FilterChip defaultSelected>Active</FilterChip>
  <FilterChip>Archived</FilterChip>
</div>
```
