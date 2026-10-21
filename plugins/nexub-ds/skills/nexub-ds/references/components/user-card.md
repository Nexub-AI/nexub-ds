# UserCard

User profile card displaying avatar, name, role, and optional actions.

- Package: `@nexub/patterns` · Category: People · Status: stable
- Import: `import { UserCard } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/user-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | User display name. |
| `email` | `string` |  | User email address. |
| `role` | `string` |  | Job title or role label. |
| `avatar` | `string` |  | URL for avatar image. |
| `actions` | `React.ReactNode` |  | Action buttons or menu. |

## Example: Default

```tsx
<UserCard
  name="Alex Morgan"
  email="alex@nexub.io"
  role="Design Lead"
/>
```
