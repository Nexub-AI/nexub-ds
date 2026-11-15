'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, DropdownMenu } from '@nexub/react';

export default function Example() {
  const [showArchived, setShowArchived] = React.useState(false);
  const [sort, setSort] = React.useState('updated');
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outlined">View options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
            Show archived
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Sort by</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenu.RadioItem value="updated">Last updated</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="owner">Owner</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
