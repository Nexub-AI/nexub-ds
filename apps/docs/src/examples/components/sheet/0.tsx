'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, Sheet, Text } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Portal>
          <Sheet.Overlay />
          <Sheet.Content side="right">
            <Sheet.Header>
              <Sheet.Title>Notifications</Sheet.Title>
              <Sheet.Description>Your recent activity</Sheet.Description>
            </Sheet.Header>
            <div className="p-4 flex-1">
              <Text size="body-sm" tone="muted">No new notifications.</Text>
            </div>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
    </>
  );
}
