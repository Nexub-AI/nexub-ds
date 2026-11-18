# Success Check

A small success moment: a ring that pops in and a tick that draws.

- Package: `@nexub/react` · Category: Feedback · Status: alpha
- Import: `import { SuccessCheck } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/success-check

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | Accessible name, e.g. "Payment sent". Without it the mark is decorative: say the result in text. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the mark. |

## Example: Default

```tsx
import { SuccessCheck } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-3">
      <SuccessCheck size="lg" />
      <p className="m-0 text-title-md text-on-surface">Payment sent</p>
    </div>
  );
}
```

## Example: Sizes

```tsx
import { SuccessCheck } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <SuccessCheck size="sm" label="Saved" />
      <SuccessCheck size="md" label="Saved" />
      <SuccessCheck size="lg" label="Saved" />
    </div>
  );
}
```

Related: [celebrate](celebrate.md), [toast](toast.md)
