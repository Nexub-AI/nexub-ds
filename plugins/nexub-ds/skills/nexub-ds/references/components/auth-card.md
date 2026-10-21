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
<AuthCard
  title="Sign in to Nexub"
  description="Enter your credentials below"
  footer={<Text size="sm">Don't have an account? <Link href="/signup">Sign up</Link></Text>}
>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Input type="email" placeholder="Email" />
    <Input type="password" placeholder="Password" />
    <Button>Sign in</Button>
  </div>
</AuthCard>
```
