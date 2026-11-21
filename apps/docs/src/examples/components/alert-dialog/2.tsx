'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, usePrompt } from '@nexub/react';

export default function Example() {
  const [prompt, promptElement] = usePrompt();
  const [reason, setReason] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant="outlined"
        onClick={async () =>
          setReason(
            await prompt({
              title: 'Reject expense claim',
              description: 'The submitter sees this reason.',
              label: 'Reason',
              minLength: 5,
              maxLength: 200,
              multiline: true,
              tone: 'destructive',
              confirmLabel: 'Reject claim',
              onSubmit: () => new Promise((resolve) => setTimeout(resolve, 800)),
            }),
          )
        }
      >
        Reject…
      </Button>
      <p className="text-body-sm text-on-surface-muted">Reason: {reason ?? '—'}</p>
      {promptElement}
    </div>
  );
}
