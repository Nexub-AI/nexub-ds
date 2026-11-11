import * as React from 'react';
import { Button, Scale, Card, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outlined" onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <Scale in={visible} unmountOnExit>
        <Card className="w-[200px]"><Text size="body-sm">Scaling content</Text></Card>
      </Scale>
    </div>
  );
}
