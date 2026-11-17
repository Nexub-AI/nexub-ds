# WelcomeBanner

A greeting at the top of a home or dashboard page: what is new, or the next step for a new account.

- Package: `@nexub/patterns` · Category: Data · Status: alpha
- Import: `import { WelcomeBanner } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/welcome-banner

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `React.ReactNode` |  | The greeting, e.g. "Welcome back, Mei". |
| `description` | `React.ReactNode` |  | One or two lines under the title. |
| `actions` | `React.ReactNode` |  | One or two buttons. |
| `media` | `React.ReactNode` |  | Decorative art on the trailing side. Hidden on phones. |
| `onDismiss` | `() => void` |  | Shows a close button. Keep the dismissed state in your app. |
| `level` | `2 \| 3` | `2` | Heading level of the title. |

## Example: Default

```tsx
import { WelcomeBanner } from '@nexub/patterns';
import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-2xl">
      <WelcomeBanner
        title="Welcome back, Mei"
        description="Two bills are due this week."
        actions={<Button>Review bills</Button>}
      />
    </div>
  );
}
```

## Example: With art and dismiss

```tsx
import * as React from 'react';
import { WelcomeBanner } from '@nexub/patterns';
import { Button, IconChip } from '@nexub/react';
import { Wallet } from '@nexub/icons';

export default function Example() {
  const [open, setOpen] = React.useState(true);
  if (!open) return <Button variant="tonal" onClick={() => setOpen(true)}>Show the banner again</Button>;
  return (
    <div className="w-full max-w-2xl">
      <WelcomeBanner
        title="Finish setting up your account"
        description="Add a bank account to send and receive money."
        actions={
          <>
            <Button>Add account</Button>
            <Button variant="text">Later</Button>
          </>
        }
        media={
          <IconChip category="accent" size="lg" shape="circle">
            <Wallet />
          </IconChip>
        }
        onDismiss={() => setOpen(false)}
      />
    </div>
  );
}
```
