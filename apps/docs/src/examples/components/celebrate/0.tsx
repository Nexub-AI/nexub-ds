'use client';

import * as React from 'react';
import { Button, Celebrate } from '@nexub/react';

export default function Example() {
  const [paid, setPaid] = React.useState(false);
  return (
    <div className="relative flex flex-col items-center gap-3 py-10">
      <Celebrate active={paid} />
      <Button magnetic status={paid ? 'success' : 'idle'} successLabel="Paid" onClick={() => setPaid((p) => !p)}>
        Pay $1,250
      </Button>
      <p role="status" className="m-0 min-h-5 text-body-sm text-[var(--color-on-surface-variant)]">{paid ? 'Payment sent. Your first one!' : ''}</p>
    </div>
  );
}
