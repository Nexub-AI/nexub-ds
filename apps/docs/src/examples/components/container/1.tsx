import { Container, Heading, Text } from '@nexub/react';

export default function Example() {
  return (
    <Container size="prose" paddingX={false}>
      <Heading level={3}>Release notes</Heading>
      <Text size="body-sm" tone="secondary" className="mt-2">
        The prose size caps lines at about 65 characters, a comfortable measure for reading long text.
      </Text>
    </Container>
  );
}
