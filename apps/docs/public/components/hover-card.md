# Hover Card

Rich tooltip card revealed on hover.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { HoverCard } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/hover-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `HoverCard.Root` | `compound` |  | Root provider that manages open/close state. |
| `HoverCard.Trigger` | `compound` |  | Element that triggers the card on hover. |
| `HoverCard.Content` | `compound` |  | The floating card panel shown on hover. |
| `openDelay` | `number` |  | Delay in milliseconds before the card opens. |
| `closeDelay` | `number` |  | Delay in milliseconds before the card closes. |

## Example: Default

```tsx
import { HoverCard, Link, Avatar, Text } from '@nexub/react';

export default function Example() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Link href="#">@alex_johnson</Link>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div className="flex flex-col gap-2 items-start">
          <Avatar name="Alex Johnson" size="lg" />
          <div>
            <Text weight="semibold">Alex Johnson</Text>
            <Text size="body-sm" tone="muted">Product Designer</Text>
          </div>
          <Text size="body-sm" tone="secondary">Building design systems and making developers happy.</Text>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
```
