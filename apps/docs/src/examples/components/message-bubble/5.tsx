'use client'; // docs preview: server pages import every example

import { MessageBubble, Highlight, Avatar } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  return (
    <div className="w-full max-w-140">
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
        <p>
          The invoice for <Highlight tone="primary">€1,240.00</Highlight> is due on <Highlight>28 Nov 2026</Highlight>.
          Payment is <Highlight tone="success">confirmed</Highlight>, the receipt is{' '}
          <Highlight tone="warning">missing</Highlight> and the refund <Highlight tone="error">failed</Highlight>.
        </p>
      </MessageBubble>
    </div>
  );
}
