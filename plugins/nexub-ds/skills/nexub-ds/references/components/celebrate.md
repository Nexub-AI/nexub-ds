# Celebrate

A short confetti burst for a real win, such as a first payment or finishing onboarding.

- Package: `@nexub/react` · Category: Feedback · Status: beta
- Import: `import { Celebrate } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/celebrate

## When to use

- A rare, real win the user worked for: first payment received, onboarding finished, a goal reached.

## When not to use

- Routine saves or every success; use the Button success state or a Toast.
- As the only feedback: say what happened in text too.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `active` (required) | `boolean` |  | Bursts each time this goes from false to true. |
| `count` | `number` | `28` | Number of pieces. |

## Example: On a win

```tsx
'use client';

import * as React from 'react';
import { Button, Celebrate } from '@nexub/react';

export default function Example() {
  const [paid, setPaid] = React.useState(false);
  return (
    <div className="relative flex flex-col items-center gap-3 py-10">
      <Celebrate active={paid} />
      <Button magnetic status={paid ? 'success' : 'idle'} successLabel="Paid" onClick={() => setPaid((p) => !p)}>
        Pay $1,250
      </Button>
      <p role="status" className="m-0 min-h-5 text-body-sm text-[var(--color-on-surface-variant)]">{paid ? 'Payment sent. Your first one!' : ''}</p>
    </div>
  );
}
```

## Accessibility

- Decorative (`aria-hidden`). Announce the win in text, for example in a Toast or a status message.
- Hidden under reduced motion.

Related: [toast](toast.md), [button](button.md)
