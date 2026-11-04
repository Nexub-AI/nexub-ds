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
import { Popover, Button, Text } from '@nexub/react';

export default function Example() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline">Open popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Text size="body-sm">This is popover content. You can put anything here.</Text>
      </Popover.Content>
    </Popover.Root>
  );
}
```

## Example: With close button

```tsx
import { Popover, Button, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-center justify-center">
      {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
        <Popover.Root key={s}>
          <Popover.Trigger asChild>
            <Button variant="ghost" size="sm">{s}</Button>
          </Popover.Trigger>
          <Popover.Content side={s}>
            <Text size="body-sm">Opens {s}</Text>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
```
