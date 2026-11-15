'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Card, Heading, CardLink, Text, Button } from '@nexub/react';

export default function Example() {
  const [starred, setStarred] = React.useState(false);
  return (
    <div className="w-[280px]">
      <Card variant="interactive" className="p-4">
        <Heading level={3} size="h5">
          <CardLink href="#">Atlas</CardLink>
        </Heading>
        <Text size="body-sm" tone="muted">Updated 2 hours ago</Text>
        <Button size="sm" variant="text" className="relative z-[1] mt-2" onClick={() => setStarred((v) => !v)}>
          {starred ? 'Starred' : 'Star'}
        </Button>
      </Card>
    </div>
  );
}
