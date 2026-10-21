# Popover

Floating content panel anchored to a trigger element.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { Popover } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/popover

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Popover.Root` | `compound` |  | Root provider that manages open/close state. |
| `Popover.Trigger` | `compound` |  | Element that toggles the popover on click. |
| `Popover.Content` | `compound` |  | The floating content panel. |
| `Popover.Arrow` | `compound` |  | Optional arrow pointing to the trigger. |
| `Popover.Close` | `compound` |  | Button that closes the popover. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` |  | Preferred side of the trigger to render the content. |
| `align` | `'start' \| 'center' \| 'end'` |  | Alignment of the content relative to the trigger. |
| `sideOffset` | `number` |  | Distance in pixels between the trigger and the content. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | Glass material on Popover.Content — see Foundations → Materials. |

## Example: Default

```tsx
<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="outline">Open popover</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Text size="body-sm">Popover content goes here.</Text>
  </Popover.Content>
</Popover.Root>
```

## Example: With close button

```tsx
<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="outline">Settings</Button>
  </Popover.Trigger>
  <Popover.Content side="bottom" align="end" sideOffset={8}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text weight="semibold">Preferences</Text>
      <Text size="body-sm" tone="secondary">Adjust your display settings.</Text>
      <Popover.Close asChild>
        <Button variant="ghost" size="sm">Close</Button>
      </Popover.Close>
    </div>
  </Popover.Content>
</Popover.Root>
```
