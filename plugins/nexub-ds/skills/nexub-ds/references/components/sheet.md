# Sheet

Alias for Drawer — slide-in sheet panel.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { Sheet } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/sheet

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Sheet.Root` | `compound` |  | Root provider that manages open/close state. Exported from Drawer. |
| `Sheet.Trigger` | `compound` |  | Element that opens the sheet. |
| `Sheet.Portal` | `compound` |  | Portals the overlay and content into the document body. |
| `Sheet.Overlay` | `compound` |  | Dimmed backdrop rendered behind the sheet. |
| `Sheet.Content` | `compound` |  | The sheet panel. Accepts a side prop. |
| `scrollLock` | `'style' \| 'class'` |  | On Sheet.Root. How page scroll is locked while open. `class` adds a class from @nexub/themes/base instead of injecting a <style> tag, so it works under a strict CSP (style-src 'self'). Default `style`. |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` |  | Edge of the screen from which the sheet slides in. |
| `Sheet.Header` | `compound` |  | Header section of the sheet panel. |
| `Sheet.Footer` | `compound` |  | Footer section of the sheet panel. |
| `Sheet.Title` | `compound` |  | Accessible title for the sheet. |
| `Sheet.Description` | `compound` |  | Supporting description text for the sheet. |
| `Sheet.Close` | `compound` |  | Element that closes the sheet. |

## Example: Default

```tsx
<Sheet.Root>
  <Sheet.Trigger asChild>
    <Button variant="outline">Open sheet</Button>
  </Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content side="right">
      <Sheet.Header>
        <Sheet.Title>Notifications</Sheet.Title>
        <Sheet.Description>Review your latest activity.</Sheet.Description>
      </Sheet.Header>
      <div style={{ padding: '16px', flex: 1 }}>
        <Text size="body-sm" tone="secondary">No new notifications.</Text>
      </div>
      <Sheet.Footer>
        <Sheet.Close asChild>
          <Button variant="outline">Close</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet.Root>
```
