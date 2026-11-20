'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, Countdown } from '@nexub/react';

export default function Example() {
  // The deadline is set after mount, so the server and the first paint agree. The chip is
  // always rendered (0 until then), so nothing moves when the time arrives.
  const [deadline, setDeadline] = React.useState(0);
  const [expired, setExpired] = React.useState(false);
  const start = () => {
    setExpired(false);
    setDeadline(Date.now() + 75_000);
  };
  React.useEffect(start, []);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-body-md text-on-surface">{expired ? 'The hold has ended' : 'Held for you'}</span>
      <Countdown to={deadline} onExpire={() => deadline > 0 && setExpired(true)} />
      <Button size="sm" variant="outlined" onClick={start}>
        Restart
      </Button>
    </div>
  );
}
