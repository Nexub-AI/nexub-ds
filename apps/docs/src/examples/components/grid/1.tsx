'use client'; // docs preview: server pages import every example

import { Grid, Card, Text } from '@nexub/react';

export default function Example() {
  return (
    <Grid cols={3} gap="sm" className="w-full max-w-[480px]">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <Card key={n}><Text size="caption" tone="muted">Item {n}</Text></Card>
      ))}
    </Grid>
  );
}
