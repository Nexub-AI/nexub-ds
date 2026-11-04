import { Card, Heading, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[280px]">
      <Card variant="surface" effect="sheen" className="p-6">
        <Heading level={3} size="h5">Pro</Heading>
        <Text size="body-sm" tone="muted">Everything in Team, plus audit logs.</Text>
      </Card>
    </div>
  );
}
