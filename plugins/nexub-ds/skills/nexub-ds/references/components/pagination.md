# Pagination

Page navigation control with prev/next and page number buttons.

- Package: `@nexub/react` · Category: Navigation · Status: stable
- Import: `import { Pagination } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/pagination

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` (required) | `number` |  | The currently active page (1-indexed). |
| `totalItems` (required) | `number` |  | Total number of items across all pages. |
| `pageSize` | `number` | `10` | Number of items per page. Used to calculate total page count. |
| `siblingCount` | `number` | `1` | Number of page buttons to show on each side of the current page. |
| `onPageChange` (required) | `(page: number) => void` |  | Callback invoked with the new page number when the user navigates. |
| `showFirstLast` | `boolean` | `true` | Whether to show First and Last page navigation buttons. |
| `disabled` | `boolean` | `false` | Disables all pagination controls. |

## Example: Default

```tsx
function DefaultPagination() {
  const [page, setPage] = React.useState(3);
  return (
    <Pagination
      page={page}
      totalItems={100}
      pageSize={10}
      onPageChange={setPage}
    />
  );
}
```

## Example: Large dataset

```tsx
function LargeDatasetPagination() {
  const [page, setPage] = React.useState(5);
  return (
    <Pagination
      page={page}
      totalItems={500}
      pageSize={20}
      siblingCount={2}
      onPageChange={setPage}
    />
  );
}
```
