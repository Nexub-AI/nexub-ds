# Alert Dialog

Confirmation dialog that requires an explicit user action before proceeding.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { AlertDialog } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/alert-dialog

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `AlertDialog.Root` | `compound` |  | Root provider component that manages open state. |
| `AlertDialog.Trigger` | `compound` |  | Element that opens the dialog on interaction. |
| `AlertDialog.Portal` | `compound` |  | Portals the overlay and content into the document body. |
| `AlertDialog.Overlay` | `compound` |  | Dimmed backdrop rendered behind the content. |
| `AlertDialog.Content` | `compound` |  | The dialog panel containing title, description, and actions. |
| `AlertDialog.Title` | `compound` |  | Accessible title announced to screen readers. |
| `AlertDialog.Description` | `compound` |  | Supporting description text for the dialog. |
| `AlertDialog.Action` | `compound` |  | Confirms the destructive or affirmative action and closes the dialog. |
| `AlertDialog.Cancel` | `compound` |  | Cancels the action and closes the dialog. |

## Example: Default

```tsx
<AlertDialog.Root>
  <AlertDialog.Trigger asChild>
    <Button variant="destructive">Delete account</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account and remove all associated data.
      </AlertDialog.Description>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
        <AlertDialog.Cancel asChild>
          <Button variant="outline">Cancel</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button variant="destructive">Confirm delete</Button>
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```
