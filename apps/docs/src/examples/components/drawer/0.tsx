'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, Drawer, Label, Input } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Open Drawer</Button>
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
                <Drawer.Close asChild><Button variant="outlined">Cancel</Button></Drawer.Close>
                <Button variant="filled">Save changes</Button>
              </div>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
