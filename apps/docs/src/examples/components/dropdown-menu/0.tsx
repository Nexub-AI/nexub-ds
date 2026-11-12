'use client'; // docs preview: server pages import every example

import { DropdownMenu, IconButton } from '@nexub/react';
import { MoreHorizontal } from '@nexub/icons';

export default function Example() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="ghost" label="More actions"><MoreHorizontal size="sm" /></IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>Project</DropdownMenu.Label>
          <DropdownMenu.Item>Rename</DropdownMenu.Item>
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Transfer ownership</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Archive</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
