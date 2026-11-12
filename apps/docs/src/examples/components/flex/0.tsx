'use client'; // docs preview: server pages import every example

import { Flex, Button } from '@nexub/react';

export default function Example() {
  return (
    <Flex gap="md" align="center">
      <Button variant="filled">Action</Button>
      <Button variant="outlined">Cancel</Button>
    </Flex>
  );
}
