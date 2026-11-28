'use client'; // docs preview: server pages import every example

import { ToolCall } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-2">
      <ToolCall name="draft_email" status="done" duration={1240} input={{ to: 'ap@acme.example' }} output="Draft saved" />
      <ToolCall name="send_email" status="failed" duration={30000} input={{ to: 'ap@acme.example' }} error="SMTP timeout after 30 s" onRetry={() => {}} />
    </div>
  );
}
