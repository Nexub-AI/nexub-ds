# StatusSteps

A read-only list of steps showing where something stands: done, current, upcoming or a problem.

- Package: `@nexub/patterns` · Category: Data · Status: alpha
- Import: `import { StatusSteps } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/status-steps

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` (required) | `{ id?: string; title: ReactNode; description?: ReactNode; status: 'done' \| 'current' \| 'upcoming' \| 'error'; timestamp?: ReactNode; action?: ReactNode }[]` |  | The steps, first to last. |
| `aria-label` (required) | `string` |  | Names the list. `aria-labelledby` works too. |
| `size` | `'sm' \| 'md'` | `'md'` | Marker, type and spacing. |

## Example: Application review

```tsx
import { StatusSteps } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <StatusSteps
        aria-label="Application progress"
        steps={[
          { id: 'submitted', title: 'Submitted', status: 'done', timestamp: <time dateTime="2026-03-12">12 Mar</time> },
          { id: 'review', title: 'Under review', status: 'current', description: 'Usually takes two working days.' },
          { id: 'approved', title: 'Approved', status: 'upcoming' },
        ]}
      />
    </div>
  );
}
```

## Example: With a problem

```tsx
import { StatusSteps } from '@nexub/patterns';
import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <StatusSteps
        aria-label="Application progress"
        steps={[
          { id: 'submitted', title: 'Submitted', status: 'done', timestamp: <time dateTime="2026-03-12">12 Mar</time> },
          {
            id: 'documents',
            title: 'Documents need another look',
            status: 'error',
            description: 'The proof of address is older than three months.',
            action: <Button size="sm" variant="tonal">Upload again</Button>,
          },
          { id: 'approved', title: 'Approved', status: 'upcoming' },
        ]}
      />
    </div>
  );
}
```

Related: [stepper](stepper.md), [progress](progress.md), [activity-feed](activity-feed.md)
