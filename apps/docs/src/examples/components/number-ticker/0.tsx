'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { NumberTicker, Button } from '@nexub/react';

export default function Example() {
  const [n, setN] = React.useState(12480);
  return (
    <div className="flex flex-col gap-3 items-center">
      <NumberTicker value={n} format={{ maximumFractionDigits: 0 }} className="text-title-lg" />
      <Button size="sm" variant="outlined" onClick={() => setN(Math.round(Math.random() * 100000))}>
        Change
      </Button>
    </div>
  );
}
