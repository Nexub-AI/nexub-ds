'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { OTPInput } from '@nexub/react';

export default function Example() {
  const [done, setDone] = React.useState(false);
  return (
    <form className="flex w-full max-w-xs flex-col gap-2">
      <OTPInput mode="backup" name="recoveryCode" autoFocus={false} onComplete={() => setDone(true)} />
      <p className="text-body-sm text-on-surface-muted">{done ? 'Checking the code…' : 'Enter one of your 12-character backup codes'}</p>
    </form>
  );
}
