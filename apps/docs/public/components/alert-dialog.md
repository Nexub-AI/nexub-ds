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
| `AlertDialog.Confirm text` | `string` |  | Type-to-confirm (5.6): the Action stays disabled until this text is typed. For irreversible actions on named resources. |

## Example: Default

```tsx
import * as React from 'react';
import { Button, AlertDialog } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Delete account</Button>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </AlertDialog.Description>
            <div className="flex gap-2 justify-end mt-6">
              <AlertDialog.Cancel asChild><Button variant="outlined">Cancel</Button></AlertDialog.Cancel>
              <AlertDialog.Action asChild><Button variant="destructive">Yes, delete</Button></AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
```

## Example: Type to confirm

Deleting a workspace asks for its name first.

```tsx
'use client';

import { AlertDialog, Button } from '@nexub/react';

export default function Example() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="destructive">Delete workspace</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete acme-prod?</AlertDialog.Title>
          <AlertDialog.Description>All projects, members and billing history go with it. This can’t be undone.</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Confirm text="acme-prod" />
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Delete workspace</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
```
