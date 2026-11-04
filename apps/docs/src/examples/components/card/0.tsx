import { Card, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[280px]">
      <Card>
        <div className="font-semibold mb-1 text-[var(--color-on-surface)]">Card title</div>
        <Text size="body-sm" tone="muted">Cards group related content on a raised surface.</Text>
      </Card>
    </div>
  );
}
