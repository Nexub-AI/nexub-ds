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
| `EmptyStatePreset kind` (required) | `'noData' \| 'noResults' \| 'noAccess' \| 'serverError' \| 'offline'` |  | Ready-made icon, title and description (5.6). serverError and offline are announced as alerts. |
| `EmptyStatePreset title / description / actions` | `ReactNode` |  | Override the localised text; add buttons such as Retry. |

## Example: Default

```tsx
import { EmptyState, Button } from '@nexub/react';

export default function Example() {
  return (
    <EmptyState.Root>
      <EmptyState.Illustration>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="8" width="32" height="32" rx="4" stroke="var(--color-outline-variant)" strokeWidth="2" />
          <path d="M18 24h12M24 18v12" stroke="var(--color-on-surface-muted)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </EmptyState.Illustration>
      <EmptyState.Title>No results found</EmptyState.Title>
      <EmptyState.Description>Try adjusting your search or filters to find what you&apos;re looking for.</EmptyState.Description>
      <EmptyState.Actions>
        <Button variant="primary" size="sm">Clear filters</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  );
}
```

## Example: Custom illustration

```tsx
import { EmptyState, Button } from '@nexub/react';

export default function Example() {
  return (
    <EmptyState.Root>
      <EmptyState.Illustration>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <rect width="80" height="80" rx="40" fill="var(--color-surface-container-low)" />
          <rect x="24" y="28" width="32" height="24" rx="4" stroke="var(--color-outline)" strokeWidth="2" />
          <path d="M24 36h32" stroke="var(--color-outline)" strokeWidth="2" />
          <circle cx="40" cy="48" r="4" fill="color-mix(in srgb, var(--color-on-surface) 38%, transparent)" />
        </svg>
      </EmptyState.Illustration>
      <EmptyState.Title>No documents yet</EmptyState.Title>
      <EmptyState.Description>Upload your first document to get started.</EmptyState.Description>
      <EmptyState.Actions>
        <Button variant="primary">Upload document</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  );
}
```

## Example: Presets

`EmptyStatePreset` for no data, no results, no access (403), server error (500) and offline.

```tsx
import { Button, EmptyStatePreset } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <EmptyStatePreset kind="noResults" actions={<Button variant="outline" size="sm">Clear filters</Button>} />
      <EmptyStatePreset kind="serverError" actions={<Button size="sm">Retry</Button>} />
    </div>
  );
}
```
