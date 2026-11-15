'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, toast } from '@nexub/react';

export default function Example() {
  const [hidden, setHidden] = React.useState(false);
  const remove = () => {
    setHidden(true);
    toast.undoable('Invoice deleted', {
      description: 'INV-2041',
      onUndo: () => setHidden(false),
      onCommit: () => {},
    });
  };
  return hidden ? (
    <Button variant="text" onClick={() => setHidden(false)}>Restore demo</Button>
  ) : (
    <Button variant="outlined" tone="danger" onClick={remove}>Delete INV-2041</Button>
  );
}
