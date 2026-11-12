'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, Drawer } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Open Bottom Sheet</Button>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="bottom">
            <Drawer.Header>
              <Drawer.Title>Share to</Drawer.Title>
            </Drawer.Header>
            <div className="p-4 flex gap-3 flex-wrap">
              {['Twitter', 'LinkedIn', 'Slack', 'Email'].map((s) => (
                <Button key={s} variant="outlined" size="sm">{s}</Button>
              ))}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
