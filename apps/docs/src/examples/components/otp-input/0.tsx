'use client';

import * as React from 'react';
import { OTPInput } from '@nexub/react';

export default function Example() {
  const [status, setStatus] = React.useState('');
  return (
    <div className="flex flex-col items-start gap-3">
      <OTPInput onComplete={(code) => setStatus(code === '123456' ? 'Verified' : 'That code didn’t work')} onValueChange={() => setStatus('')} />
      <p aria-live="polite" className="text-body-sm text-[var(--color-on-surface-muted)]">
        {status || 'Try 123456'}
      </p>
    </div>
  );
}
