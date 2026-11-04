import { Grid, Card, Text } from '@nexub/react';

export default function Example() {
  return (
    <Grid cols={2} gap="md" className="w-full max-w-[400px]">
      {[1, 2, 3, 4].map((n) => (
        <Card key={n}><Text size="body-sm" tone="muted">Card {n}</Text></Card>
      ))}
    </Grid>
  );
}
