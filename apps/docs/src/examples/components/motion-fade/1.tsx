'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, Fade, Card, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outlined" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Hide' : 'Show'}
      </Button>
      <Fade in={visible} unmountOnExit>
        <Card className="w-[200px]"><Text size="body-sm">Animated content</Text></Card>
      </Fade>
    </div>
  );
}
