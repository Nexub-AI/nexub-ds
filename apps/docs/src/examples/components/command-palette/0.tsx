import * as React from 'react';
import { Button, CommandPalette } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandPalette.Root open={open} onOpenChange={setOpen}>
        <CommandPalette.Input placeholder="Type a command or search…" />
        <CommandPalette.List>
          <CommandPalette.Empty>No results found.</CommandPalette.Empty>
          <CommandPalette.Group heading="Go to">
            <CommandPalette.Item onSelect={() => setOpen(false)}>Dashboard</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Reports</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Settings</CommandPalette.Item>
          </CommandPalette.Group>
          <CommandPalette.Separator />
          <CommandPalette.Group heading="Actions">
            <CommandPalette.Item onSelect={() => setOpen(false)}>Create project</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Invite a teammate</CommandPalette.Item>
          </CommandPalette.Group>
        </CommandPalette.List>
      </CommandPalette.Root>
    </>
  );
}
