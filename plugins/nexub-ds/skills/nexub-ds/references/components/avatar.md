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
| `AgentAvatar icon` | `ReactNode` |  | AgentAvatar (12.2, beta): the app glyph inside the tile, e.g. an `@nexub/icons` icon. Default: a bot. |
| `AgentAvatar src` | `string` |  | AgentAvatar: an image for the tile instead of `icon` (e.g. an `@nexub/brand` app tile). Falls back to `icon` if it fails. |
| `AgentAvatar name` | `string` |  | AgentAvatar: who the agent is ("Payhub agent"). Read as "Payhub agent, AI agent" (`messages.aiAgent`). |
| `AgentAvatar size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | AgentAvatar: the same size scale as Avatar. |
| `AgentAvatar category` | `CategoryColor` |  | AgentAvatar: a category colour for the tile. Default: the brand tile look, a primary glyph on a surface tile. |

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

## Example: Agent avatar

AgentAvatar (12.2, beta) is for AI agents, so an agent never looks like a colleague: a rounded-square app tile, like the `@nexub/brand` tiles, with a sparkle in the bottom inline-end corner. Same sizes as Avatar. Screen readers hear "Payhub agent, AI agent".

```tsx
import { AgentAvatar, Avatar } from '@nexub/react';
import { CreditCard, Terminal } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar name="Ada Lovelace" size="lg" />
      <AgentAvatar name="Payhub agent" icon={<CreditCard />} size="lg" />
      <AgentAvatar name="devX agent" icon={<Terminal />} category="blue" size="lg" />
      <AgentAvatar name="Nexub agent" size="lg" />
    </div>
  );
}
```

## Accessibility

- Roles: img (when named)
- Avatar reads its `name`, plus the `status` ("Ada Lovelace, Away"). Without a name it is decorative and hidden.
- AgentAvatar is always `role="img"` and its name says it is an AI agent ("Payhub agent, AI agent", from `messages.aiAgent`). The glyph and the sparkle are hidden.
