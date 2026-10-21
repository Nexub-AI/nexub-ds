# Empty State

Placeholder UI shown when a list or page has no content.

- Package: `@nexub/react` · Category: Data Display · Status: stable
- Import: `import { EmptyState } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/empty-state

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `EmptyState.Root layout` | `'centered' \| 'inline'` | `'centered'` | "centered" stacks content vertically in the middle of its container; "inline" aligns content to the start. |
| `EmptyState.Illustration children` | `React.ReactNode` |  | Icon or SVG illustration to render above the title. |
| `EmptyState.Title children` (required) | `React.ReactNode` |  | Primary heading text for the empty state. |
| `EmptyState.Description children` | `React.ReactNode` |  | Supporting text providing more context or guidance. |
| `EmptyState.Actions children` | `React.ReactNode` |  | One or more action buttons rendered below the description. |

## Example: Default

```tsx
<EmptyState.Root>
  <EmptyState.Illustration>
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-text-disabled)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  </EmptyState.Illustration>
  <EmptyState.Title>No results found</EmptyState.Title>
  <EmptyState.Description>
    Try adjusting your search or filters to find what you're looking for.
  </EmptyState.Description>
  <EmptyState.Actions>
    <Button variant="primary">Clear filters</Button>
    <Button variant="outline">Browse all</Button>
  </EmptyState.Actions>
</EmptyState.Root>
```

## Example: Custom illustration

```tsx
<EmptyState.Root>
  <EmptyState.Illustration>
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="80" height="80" rx="40" fill="var(--color-bg-subtle)" />
      <rect x="24" y="28" width="32" height="24" rx="4" stroke="var(--color-border-strong)" strokeWidth="2" />
      <path d="M24 36h32" stroke="var(--color-border-strong)" strokeWidth="2" />
      <circle cx="40" cy="48" r="4" fill="var(--color-text-disabled)" />
    </svg>
  </EmptyState.Illustration>
  <EmptyState.Title>No documents yet</EmptyState.Title>
  <EmptyState.Description>
    Upload your first document to get started.
  </EmptyState.Description>
  <EmptyState.Actions>
    <Button variant="primary">Upload document</Button>
  </EmptyState.Actions>
</EmptyState.Root>
```
