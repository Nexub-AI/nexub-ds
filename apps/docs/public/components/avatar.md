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
import { Avatar } from '@nexub/react';

export default function Example() {
  return <Avatar name="Alex Johnson" />;
}
```

## Example: Sizes

```tsx
import { Avatar } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-center justify-center">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Avatar key={s} name="Alex J" size={s} />
      ))}
    </div>
  );
}
```

## Example: With image

```tsx
import { Avatar } from '@nexub/react';

export default function Example() {
  return <Avatar src="https://i.pravatar.cc/150?img=3" name="Alex Johnson" />;
}
```

## Example: With badge

```tsx
import { Avatar } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-center justify-center">
      <Avatar name="Online" badge badgeColor="var(--color-success)" />
      <Avatar name="Away" badge badgeColor="var(--color-warning)" />
    </div>
  );
}
```
