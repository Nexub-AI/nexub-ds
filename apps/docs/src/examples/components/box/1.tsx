import { Box, Heading, Text } from '@nexub/react';

export default function Example() {
  return (
    <Box className="p-6 bg-[var(--color-surface-container-low)] rounded-shape-container">
      <Heading size="h4">Section title</Heading>
      <Box className="p-3 bg-[var(--color-surface)] rounded-shape-field mt-2">
        <Text size="body-sm">Nested box content</Text>
      </Box>
    </Box>
  );
}
