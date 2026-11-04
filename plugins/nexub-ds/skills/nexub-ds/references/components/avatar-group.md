# Avatar Group

Stacked group of avatars with overflow count.

- Package: `@nexub/react` · Category: Avatar · Status: stable
- Import: `import { AvatarGroup } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/avatar-group

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `max` | `number` | `4` | Maximum number of avatars shown before an overflow count is rendered. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` |  | Controls avatar dimensions for all children. |
| `spacing` | `'tight' \| 'normal'` | `'normal'` | Controls the overlap amount between stacked avatars. |

## Example: Default

```tsx
import { AvatarGroup, Avatar } from '@nexub/react';

export default function Example() {
  return (
    <AvatarGroup max={3}>
      <Avatar name="Alice B" />
      <Avatar name="Bob C" />
      <Avatar name="Carol D" />
      <Avatar name="Dave E" />
      <Avatar name="Eve F" />
    </AvatarGroup>
  );
}
```
