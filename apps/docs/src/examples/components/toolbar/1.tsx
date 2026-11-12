'use client'; // docs preview: server pages import every example

import { Toolbar } from '@nexub/react';
import { Copy, Pencil, Trash2 } from '@nexub/icons';

export default function Example() {
  return (
    <Toolbar.Root floating aria-label="Selection">
      <Toolbar.Button><Pencil size="sm" aria-hidden="true" />Edit</Toolbar.Button>
      <Toolbar.Button><Copy size="sm" aria-hidden="true" />Duplicate</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button><Trash2 size="sm" aria-hidden="true" />Delete</Toolbar.Button>
    </Toolbar.Root>
  );
}
