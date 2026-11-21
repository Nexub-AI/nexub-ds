'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, CommandList, Dialog } from '@nexub/react';

const spaces = ['Finance', 'Marketing', 'Operations', 'People', 'Product', 'Sales'].map((s) => ({ value: s.toLowerCase(), label: s }));

export default function Example() {
  const [open, setOpen] = React.useState(false);
  const [space, setSpace] = React.useState('Finance');
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outlined">Move to {space}…</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Move to space</Dialog.Title>
        <div className="mt-4">
          <CommandList
            label="Spaces"
            items={spaces}
            onSelect={(_, item) => {
              setSpace(item.label);
              setOpen(false);
            }}
          />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
