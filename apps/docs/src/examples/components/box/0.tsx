'use client'; // docs preview: server pages import every example

import { Box, Text } from '@nexub/react';

export default function Example() {
  return (
    <Box className="p-4 bg-[var(--color-surface-container-low)] rounded-shape-field">
      <Text size="body-sm">Content inside a Box</Text>
    </Box>
  );
}
