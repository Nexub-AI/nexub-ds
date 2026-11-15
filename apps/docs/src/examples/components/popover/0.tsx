'use client'; // docs preview: server pages import every example

import { Popover, Button, Text } from '@nexub/react';

export default function Example() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outlined">Open popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Text size="body-sm">This is popover content. You can put anything here.</Text>
      </Popover.Content>
    </Popover.Root>
  );
}
