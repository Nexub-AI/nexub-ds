import { Container, Section, Text } from '@nexub/react';

const tones = ['default', 'subtle', 'muted', 'inverse'] as const;

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)]">
      {tones.map((tone) => (
        <Section key={tone} tone={tone} paddingY="sm" aria-label={`${tone} tone`}>
          <Container size="sm">
            <Text size="body-sm" className="text-inherit">tone=&quot;{tone}&quot;</Text>
          </Container>
        </Section>
      ))}
    </div>
  );
}
