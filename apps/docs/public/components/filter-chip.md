# Filter Chip

Interactive chip for filtering, supports selected/unselected state.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { FilterChip } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/filter-chip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `selected` | `boolean` |  | Controlled selected state of the chip. |
| `disabled` | `boolean` |  | Disables the chip. |

## Example: Default

```tsx
import { FilterChip } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <FilterChip>All</FilterChip>
      <FilterChip selected>Active</FilterChip>
      <FilterChip>Archived</FilterChip>
      <FilterChip>Draft</FilterChip>
    </div>
  );
}
```
