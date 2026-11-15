'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, Slide, Card, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outlined" onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <Slide in={visible} direction="up" unmountOnExit>
        <Card className="w-[200px]"><Text size="body-sm">Sliding content</Text></Card>
      </Slide>
    </div>
  );
}
