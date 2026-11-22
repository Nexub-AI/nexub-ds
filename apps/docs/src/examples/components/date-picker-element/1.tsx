'use client';

import * as React from 'react';
import { Button } from '@nexub/react';
import '@nexub/elements/define';

export default function Example() {
  const [posted, setPosted] = React.useState<string | null>(null);

  return (
    <form
      lang="en-US"
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setPosted(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))));
      }}
      onReset={() => setPosted(null)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="billing-month" className="text-label-lg text-on-surface">
          First billing month
        </label>
        <nx-date-picker id="billing-month" name="month" granularity="month" min="2026-04" required />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="reset" variant="outlined">
          Reset
        </Button>
      </div>
      <p className="text-body-sm text-on-surface-muted">Posted: {posted ?? 'nothing yet'}</p>
    </form>
  );
}
