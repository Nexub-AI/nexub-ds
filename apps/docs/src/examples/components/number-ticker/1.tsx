'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Amount, Button } from '@nexub/react';

export default function Example() {
  const [balance, setBalance] = React.useState(128450.75);
  return (
    <div className="flex flex-col gap-3 items-center">
      <Amount value={balance} currency="USD" size="display" animate />
      <Button size="sm" variant="outlined" onClick={() => setBalance(Math.round(Math.random() * 20000000) / 100)}>
        Change
      </Button>
    </div>
  );
}
