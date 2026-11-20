'use client'; // docs preview: server pages import every example

import { MessageBubble, toast } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-140">
      <MessageBubble from="user" status="error" onRetry={() => toast.info('Retrying…')}>
        Can I get a refund for last month?
      </MessageBubble>
    </div>
  );
}
