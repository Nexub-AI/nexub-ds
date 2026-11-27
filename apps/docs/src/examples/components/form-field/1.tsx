'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, FormField, Input } from '@nexub/react';

const draft = 'Refund approved for order 1042';

export default function Example() {
  const [value, setValue] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined);
  React.useEffect(() => () => clearInterval(timer.current), []);

  // Stand-in for an agent typing the value a few characters at a time.
  const fill = () => {
    clearInterval(timer.current);
    setGenerated(false);
    setStreaming(true);
    let n = 0;
    timer.current = setInterval(() => {
      n += 3;
      setValue(draft.slice(0, n));
      if (n >= draft.length) {
        clearInterval(timer.current);
        setStreaming(false);
        setGenerated(true);
      }
    }, 80);
  };

  return (
    <div className="flex w-80 flex-col items-start gap-4">
      <FormField.Root
        id="agent-summary"
        streaming={streaming}
        generated={generated}
        onAcceptSuggestion={() => setGenerated(false)}
        onClearSuggestion={() => {
          setValue('');
          setGenerated(false);
        }}
        className="w-full"
      >
        <FormField.Label>Summary</FormField.Label>
        <FormField.Control>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </FormField.Control>
        <FormField.Description>Shown to the customer.</FormField.Description>
      </FormField.Root>
      <Button variant="outlined" size="sm" onClick={fill} disabled={streaming}>
        Draft with AI
      </Button>
    </div>
  );
}
