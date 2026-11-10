import * as React from 'react';
import { Button, Fade, Card, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <Fade in={visible} duration="slow">
        <Card className="w-[200px]"><Text size="body-sm">Slow spring fade animation.</Text></Card>
      </Fade>
    </div>
  );
}
