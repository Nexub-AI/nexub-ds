'use client'; // docs preview: server pages import every example

import { ToolCall } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-2">
      <ToolCall name="search_invoices" status="done" input={{ customer: 'Acme', status: 'unpaid' }} output={{ found: 3, total: '$4,120' }} open />
      <ToolCall name="draft_email" status="running" input={{ to: 'ap@acme.example', template: 'reminder' }} />
    </div>
  );
}
