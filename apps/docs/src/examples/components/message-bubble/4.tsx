'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { MessageBubble, MessageCard, Avatar, Badge, toast } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  const [done, setDone] = React.useState<string>();
  return (
    <div className="w-full max-w-140">
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
        <p>Ada sent an expense report for your approval.</p>
        <MessageCard
          title="Expense report"
          status={
            <Badge variant="soft" tone={done ? 'success' : 'warning'}>
              {done ? 'Approved' : 'Pending'}
            </Badge>
          }
          fields={[
            { label: 'Amount', value: '€1,240.00' },
            { label: 'Vendor', value: 'Acme GmbH' },
            { label: 'Submitted by', value: 'Ada Lovelace' },
            { label: 'Due', value: '28 Nov 2026' },
          ]}
          body="Team offsite, Berlin. Receipts attached."
          done={done}
          actions={[
            { label: 'Approve', onSelect: () => setDone('Approved by you · 2:14 pm') },
            { label: 'Reject', onSelect: () => toast.info('Rejected') },
            { label: 'Ask a question', onSelect: () => toast.info('Question sent') },
          ]}
        />
      </MessageBubble>
    </div>
  );
}
