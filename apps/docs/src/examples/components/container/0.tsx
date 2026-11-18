'use client'; // docs preview: server pages import every example

import { Container, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full bg-surface-container-low py-4">
      <Container size="sm" className="rounded-shape-container bg-surface py-4">
        <Text size="body-sm">Centred at up to 640 px, with responsive side padding.</Text>
      </Container>
    </div>
  );
}
