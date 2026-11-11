import { Container, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full bg-[var(--color-surface-container-low)] py-4">
      <Container size="sm" className="rounded-shape-container bg-[var(--color-surface)] py-4">
        <Text size="body-sm">Centred at up to 640 px, with responsive side padding.</Text>
      </Container>
    </div>
  );
}
