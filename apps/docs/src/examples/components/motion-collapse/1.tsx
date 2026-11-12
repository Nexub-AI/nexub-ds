'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, Collapse, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outlined" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Collapse' : 'Expand'}
      </Button>
      <Collapse in={visible}>
        <div className="p-4 bg-[var(--color-surface-container-low)] rounded-shape-field">
          <Text size="body-sm">This content collapses and expands smoothly.</Text>
        </div>
      </Collapse>
    </div>
  );
}
