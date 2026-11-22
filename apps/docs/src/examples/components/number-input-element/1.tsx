'use client';

import * as React from 'react';
import { Button } from '@nexub/react';
import '@nexub/elements/define';

export default function Example() {
  const [posted, setPosted] = React.useState<string | null>(null);

  return (
    <form
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        // The element is form-associated: FormData has its value, as a native input's.
        setPosted(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))));
      }}
      onReset={() => setPosted(null)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="guests" className="text-label-lg text-on-surface">
          Guests (required, 2 or more)
        </label>
        <nx-number-input id="guests" name="guests" min="2" required />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="budget" className="text-label-lg text-on-surface">
          Budget per guest
        </label>
        <nx-number-input id="budget" name="budget" step="any" value="42.5" size="sm" />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Send</Button>
        <Button type="reset" variant="outlined">
          Reset
        </Button>
      </div>
      <p className="text-body-sm text-on-surface-muted">Posted: {posted ?? 'nothing yet'}</p>
    </form>
  );
}
