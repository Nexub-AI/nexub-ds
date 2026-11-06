# Drawer

Slide-in panel from any edge of the screen.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { Drawer } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/drawer

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Drawer.Root` | `compound` |  | Root provider that manages open/close state. |
| `Drawer.Trigger` | `compound` |  | Element that opens the drawer. |
| `Drawer.Portal` | `compound` |  | Portals the overlay and content into the document body. |
| `Drawer.Overlay` | `compound` |  | Dimmed backdrop rendered behind the drawer. |
| `Drawer.Content` | `compound` |  | The drawer panel. Accepts a side prop. |
| `scrollLock` | `'style' \| 'class'` |  | On Drawer.Root. How page scroll is locked while open. `class` adds a class from @nexub/themes/base instead of injecting a <style> tag, so it works under a strict CSP (style-src 'self'). Default `style`. |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` |  | Edge of the screen from which the drawer slides in. |
| `Drawer.Header` | `compound` |  | Header section of the drawer panel. Sticky (5.1): long content scrolls under it. |
| `Drawer.Footer` | `compound` |  | Footer section of the drawer panel. Sticky (5.1): actions stay in view while content scrolls. |
| `Drawer.Title` | `compound` |  | Accessible title for the drawer. |
| `Drawer.Description` | `compound` |  | Supporting description text for the drawer. |
| `Drawer.Close` | `compound` |  | Element that closes the drawer. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | Glass material on Drawer.Content — see Foundations → Materials. |

## Example: Default

```tsx
import * as React from 'react';
import { Button, Drawer, Label, Input } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="right">
            <Drawer.Header>
              <Drawer.Title>Edit profile</Drawer.Title>
              <Drawer.Description>Update your profile details.</Drawer.Description>
            </Drawer.Header>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-3 items-start">
                <div className="flex flex-col gap-1 items-start">
                  <Label htmlFor="d-name">Name</Label>
                  <Input id="d-name" placeholder="Jane Smith" />
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <Label htmlFor="d-email">Email</Label>
                  <Input id="d-email" type="email" placeholder="jane@example.com" />
                </div>
              </div>
            </div>
            <Drawer.Footer>
              <div className="flex gap-2 justify-end">
                <Drawer.Close asChild><Button variant="outline">Cancel</Button></Drawer.Close>
                <Button variant="primary">Save changes</Button>
              </div>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
```

## Example: Bottom sheet

```tsx
import * as React from 'react';
import { Button, Drawer } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open Bottom Sheet</Button>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="bottom">
            <Drawer.Header>
              <Drawer.Title>Share to</Drawer.Title>
            </Drawer.Header>
            <div className="p-4 flex gap-3 flex-wrap">
              {['Twitter', 'LinkedIn', 'Slack', 'Email'].map((s) => (
                <Button key={s} variant="outline" size="sm">{s}</Button>
              ))}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
```
