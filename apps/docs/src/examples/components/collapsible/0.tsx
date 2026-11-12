'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Collapsible, Button } from '@nexub/react';

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Button variant="outlined">{open ? 'Hide details' : 'Show details'}</Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="pt-3 text-[var(--color-on-surface-variant)] text-body-sm">
          Hidden content revealed on toggle. This section can hold any content.
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
