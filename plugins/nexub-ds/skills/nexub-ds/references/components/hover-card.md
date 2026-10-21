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
<HoverCard.Root openDelay={200} closeDelay={100}>
  <HoverCard.Trigger asChild>
    <Link href="#">@sasidharan</Link>
  </HoverCard.Trigger>
  <HoverCard.Content side="bottom" align="start" sideOffset={8}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '240px' }}>
      <Text weight="semibold">Sasidharan</Text>
      <Text size="body-sm" tone="secondary">Full-stack engineer building design systems.</Text>
      <Text size="caption" tone="muted">Joined April 2024</Text>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
```
