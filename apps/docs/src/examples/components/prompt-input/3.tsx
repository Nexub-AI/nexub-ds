'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { PromptInput, toast } from '@nexub/react';

const LIMIT = 280;

export default function Example() {
  const [value, setValue] = React.useState('');
  const tooLong = value.length > LIMIT;
  return (
    <div className="w-full max-w-130">
      <PromptInput
        placeholder="Write a reply to the thread"
        value={value}
        onValueChange={setValue}
        onSubmit={() => {
          if (tooLong) return;
          toast.success('Reply sent');
          setValue('');
        }}
        submitOn="mod-enter"
        sendLabel="Reply"
        hint="Everyone in the thread can see your reply."
        error={tooLong ? `Shorten your reply to ${LIMIT} characters.` : undefined}
      />
    </div>
  );
}
