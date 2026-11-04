import * as React from 'react';
import { type ButtonStatus, Button } from '@nexub/react';

const NEXT_STATUS: Record<ButtonStatus, ButtonStatus> = { idle: 'loading', loading: 'success', success: 'error', error: 'idle' };

export default function Example() {
  const [status, setStatus] = React.useState<ButtonStatus>('idle');
  // Clicks are ignored while loading, so loading moves on by itself.
  React.useEffect(() => {
    if (status !== 'loading') return;
    const t = setTimeout(() => setStatus('success'), 1200);
    return () => clearTimeout(t);
  }, [status]);
  return (
    <div className="flex flex-col gap-2 items-start">
      <Button status={status} loadingLabel="Saving" successLabel="Saved" errorLabel="Couldn't save" onClick={() => setStatus(NEXT_STATUS[status])}>
        Save
      </Button>
      <span className="text-body-sm text-[var(--color-on-surface-variant)]">status: {status}</span>
    </div>
  );
}
