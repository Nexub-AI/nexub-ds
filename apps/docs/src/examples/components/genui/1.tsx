'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button } from '@nexub/react';
import { GenUI } from '@nexub/genui';

// The JSON text as a model streams it. GenUI parses what has arrived so far.
const json = JSON.stringify({
  version: '1.0',
  title: 'Refund request',
  root: {
    type: 'Card',
    props: { title: 'Refund for order A-1042', description: 'Requested today' },
    children: [
      { type: 'StreamingText', props: { text: 'The customer says the parcel arrived damaged and sent two photos.' } },
      { type: 'DescriptionList', props: { items: [{ label: 'Amount', value: '€42.00' }, { label: 'Paid with', value: 'Card ending 4242' }] } },
      { type: 'Button', props: { label: 'Review refund', variant: 'tonal', action: { name: 'reviewRefund', payload: { orderId: 'A-1042' } } } },
    ],
  },
});

export default function Example() {
  const [length, setLength] = React.useState(0);
  const streaming = length < json.length;
  React.useEffect(() => {
    if (!streaming) return;
    const id = setTimeout(() => setLength((n) => Math.min(json.length, n + 12)), 50);
    return () => clearTimeout(id);
  }, [length, streaming]);
  return (
    <div className="flex w-full max-w-140 flex-col items-start gap-3">
      <div className="w-full">
        <GenUI document={json.slice(0, length)} streaming={streaming} actions={['reviewRefund']} onAction={() => {}} />
      </div>
      <Button variant="outlined" size="sm" onClick={() => setLength(0)}>
        Restart
      </Button>
    </div>
  );
}
