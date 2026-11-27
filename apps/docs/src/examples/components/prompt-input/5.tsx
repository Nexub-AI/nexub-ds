'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, PromptInput, toast } from '@nexub/react';

const replies = ['Approve', 'Reject', 'Ask for details', 'Remind me tomorrow'];

export default function Example() {
  const [value, setValue] = React.useState('');
  return (
    <div className="w-full max-w-130">
      <PromptInput
        placeholder="Reply"
        value={value}
        onValueChange={setValue}
        onSubmit={(text) => {
          toast.success(`Sent: ${text}`);
          setValue('');
        }}
        chips={replies.map((r) => (
          <Button key={r} size="sm" variant="tonal" onClick={() => setValue(r)}>
            {r}
          </Button>
        ))}
      />
    </div>
  );
}
