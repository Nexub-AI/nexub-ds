'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, CommandPalette } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Switch project</Button>
      <CommandPalette.Root open={open} onOpenChange={setOpen}>
        <CommandPalette.Input placeholder="Search…" />
        <CommandPalette.List>
          <CommandPalette.Empty>No results found.</CommandPalette.Empty>
          <CommandPalette.Page>
            <CommandPalette.Item page="projects">Projects…</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Export report</CommandPalette.Item>
          </CommandPalette.Page>
          <CommandPalette.Page id="projects" title="Projects">
            <CommandPalette.Item onSelect={() => setOpen(false)}>Billing service</CommandPalette.Item>
            <CommandPalette.Item onSelect={() => setOpen(false)}>Mobile app</CommandPalette.Item>
          </CommandPalette.Page>
        </CommandPalette.List>
      </CommandPalette.Root>
    </>
  );
}
