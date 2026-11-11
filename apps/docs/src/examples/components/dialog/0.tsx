import * as React from 'react';
import { Button, Dialog } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="filled" onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content size="sm">
            <Dialog.Title>Confirm action</Dialog.Title>
            <Dialog.Description className="mt-2 mb-6">
              Are you sure you want to continue? This action cannot be undone.
            </Dialog.Description>
            <div className="flex gap-2 justify-end">
              <Dialog.Close asChild><Button variant="outlined">Cancel</Button></Dialog.Close>
              <Button variant="filled" onClick={() => setOpen(false)}>Confirm</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
