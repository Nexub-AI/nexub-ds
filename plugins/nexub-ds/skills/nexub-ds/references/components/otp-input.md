# OTP Input

One box per digit for verification codes, with paste and one-time-code autofill.

- Package: `@nexub/react` · Category: Form Controls · Status: beta
- Import: `import { OtpInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/otp-input

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `length` | `number` | `6` | Number of boxes. |
| `value / defaultValue / onValueChange` | `string` |  | The code so far, without gaps. |
| `onComplete` | `(code: string) => void` |  | Called when every box is filled; submit or verify here. |
| `mode` | `'numeric' \| 'alphanumeric'` | `'numeric'` | Numeric shows the number keypad on phones. |
| `invalid / disabled` | `boolean` |  | Error styling (pair with a FormError) and the disabled state. |
| `name` | `string` |  | Submits the code with a form. |
| `aria-label` | `string` | `'Verification code'` | Group name; each box reads "Digit N of M". |

## Example: Verification code

```tsx
'use client';

import * as React from 'react';
import { OTPInput } from '@nexub/react';

export default function Example() {
  const [status, setStatus] = React.useState('');
  return (
    <div className="flex flex-col items-start gap-3">
      <OTPInput onComplete={(code) => setStatus(code === '123456' ? 'Verified' : 'That code didn’t work')} onValueChange={() => setStatus('')} />
      <p aria-live="polite" className="text-body-sm text-[var(--color-on-surface-muted)]">
        {status || 'Try 123456'}
      </p>
    </div>
  );
}
```

## Accessibility

- `Type`: Fills the box and moves to the next.
- `Backspace`: Clears the box, or the previous one when empty.
- `ArrowLeft / ArrowRight`: Moves between boxes.
- The first box has `autocomplete="one-time-code"`, so the code from an SMS fills every box.

Related: [input](input.md), [password-input](password-input.md)
