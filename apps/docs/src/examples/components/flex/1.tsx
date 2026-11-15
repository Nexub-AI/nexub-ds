'use client'; // docs preview: server pages import every example

import { Flex, Badge } from '@nexub/react';

export default function Example() {
  return (
    <Flex justify="between" className="w-full max-w-[320px]">
      <Badge tone="success">Active</Badge>
      <Badge tone="neutral">Draft</Badge>
    </Flex>
  );
}
