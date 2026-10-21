# Avatar

Displays a user's profile picture with initials fallback.

- Package: `@nexub/react` · Category: Avatar · Status: stable
- Import: `import { Avatar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/avatar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` |  | URL of the profile image. |
| `name` | `string` |  | Full name used to generate initials when no image is provided. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Controls avatar dimensions. |
| `badge` | `boolean` |  | Shows a status badge on the avatar. |
| `badgeColor` | `string` |  | Colour of the status badge. |
| `fallback` | `ReactNode` |  | Custom fallback rendered when the image fails to load and no name is provided. |

## Example: Default

```tsx
<Avatar name="Alex Johnson" />
```

## Example: Sizes

```tsx
<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <Avatar size="xs" name="Alex Johnson" />
  <Avatar size="sm" name="Alex Johnson" />
  <Avatar size="md" name="Alex Johnson" />
  <Avatar size="lg" name="Alex Johnson" />
  <Avatar size="xl" name="Alex Johnson" />
</div>
```

## Example: With image

```tsx
<Avatar src="https://i.pravatar.cc/150?img=1" name="Alex Johnson" />
```

## Example: With badge

```tsx
<Avatar name="Online User" badge badgeColor="green" />
```
