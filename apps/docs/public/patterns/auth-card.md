# AuthCard

Authentication layout pattern. Wraps sign-in, sign-up, and reset flows in a centered card.

- Package: `@nexub/patterns` · Category: Auth · Status: stable
- Import: `import { AuthCard } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/auth-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | Card heading (e.g. "Sign in to Nexub"). |
| `description` | `string` |  | Subheading text. |
| `logo` | `React.ReactNode` |  | Logo or brand mark above the title. |
| `footer` | `React.ReactNode` |  | Footer content (e.g. "Don't have an account?"). |
| `children` (required) | `React.ReactNode` |  | Form content. |

## Example: Sign in

```tsx
import { AuthCard } from '@nexub/patterns';
import { Label, Input, Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[360px]">
      <AuthCard title="Sign in" description="Welcome back — enter your credentials to continue.">
        <div className="flex flex-col gap-3 items-start">
          <div className="flex flex-col gap-1 items-start">
            <Label htmlFor="auth-email">Email</Label>
            <Input id="auth-email" type="email" placeholder="you@company.com" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <Label htmlFor="auth-pass">Password</Label>
            <Input id="auth-pass" type="password" placeholder="••••••••" />
          </div>
          <Button variant="primary" className="w-full">Sign in</Button>
        </div>
      </AuthCard>
    </div>
  );
}
```
