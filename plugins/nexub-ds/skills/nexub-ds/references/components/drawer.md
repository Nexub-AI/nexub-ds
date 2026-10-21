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
| `Drawer.Header` | `compound` |  | Header section of the drawer panel. |
| `Drawer.Footer` | `compound` |  | Footer section of the drawer panel. |
| `Drawer.Title` | `compound` |  | Accessible title for the drawer. |
| `Drawer.Description` | `compound` |  | Supporting description text for the drawer. |
| `Drawer.Close` | `compound` |  | Element that closes the drawer. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | Glass material on Drawer.Content — see Foundations → Materials. |

## Example: Default

```tsx
<Drawer.Root>
  <Drawer.Trigger asChild>
    <Button variant="outline">Open drawer</Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content side="right">
      <Drawer.Header>
        <Drawer.Title>Edit profile</Drawer.Title>
        <Drawer.Description>Make changes to your profile settings.</Drawer.Description>
      </Drawer.Header>
      <div style={{ padding: '16px', flex: 1 }}>
        <Text size="body-sm" tone="secondary">Drawer body content goes here.</Text>
      </div>
      <Drawer.Footer>
        <Drawer.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Drawer.Close>
        <Button variant="primary">Save changes</Button>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

## Example: Bottom sheet

```tsx
<Drawer.Root>
  <Drawer.Trigger asChild>
    <Button variant="outline">Open bottom sheet</Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content side="bottom">
      <Drawer.Header>
        <Drawer.Title>Share</Drawer.Title>
      </Drawer.Header>
      <div style={{ padding: '16px' }}>
        <Text size="body-sm">Choose how you would like to share this item.</Text>
      </div>
      <Drawer.Footer>
        <Drawer.Close asChild>
          <Button variant="outline" fullWidth>Cancel</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```
