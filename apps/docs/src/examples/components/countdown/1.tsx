'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, useCountdown } from '@nexub/react';

export default function Example() {
  // 0 until the first click: nothing reads the clock while rendering.
  const [deadline, setDeadline] = React.useState(0);
  const { seconds, expired } = useCountdown(deadline);
  const waiting = deadline > 0 && !expired;
  return (
    <Button variant="outlined" disabled={waiting} onClick={() => setDeadline(Date.now() + 30_000)}>
      {waiting ? <span className="tabular-nums">Resend code in 0:{String(seconds).padStart(2, '0')}</span> : 'Send code'}
    </Button>
  );
}
