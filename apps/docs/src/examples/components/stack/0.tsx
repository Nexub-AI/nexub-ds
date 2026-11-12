'use client'; // docs preview: server pages import every example

import { Stack, Button } from '@nexub/react';

export default function Example() {
  return (
    <Stack gap="md">
      <Button variant="outlined">Item 1</Button>
      <Button variant="outlined">Item 2</Button>
      <Button variant="outlined">Item 3</Button>
    </Stack>
  );
}
