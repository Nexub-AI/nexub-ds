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
