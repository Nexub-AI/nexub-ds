# Dialog

Modal dialog built on Radix UI. Fully accessible with focus trapping and ARIA roles.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { Dialog } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/dialog

## When to use

- Confirming a destructive or irreversible action
- Collecting a small form without leaving the current page
- Displaying critical information that requires acknowledgement
- Previewing content before taking an action

## When not to use

- Long multi-step flows — use a Drawer or a dedicated page instead
- Quick contextual info — use a Tooltip or Popover
- Non-blocking side panels — use Sheet or Drawer
- Stacking multiple dialogs — always limit to one at a time

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` |  | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` |  | Callback when open state changes. |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial open state. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | Glass material on Dialog.Content — see Foundations → Materials. |

## Example: Default

```tsx
<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile here.
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Dialog.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Dialog.Close>
        <Button>Save changes</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```
