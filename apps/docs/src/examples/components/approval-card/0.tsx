'use client';

import { ApprovalCard } from '@nexub/react';

export default function Example() {
  return (
    <ApprovalCard title="Send 3 payment reminders to Acme" approveLabel="Send reminders">
      Invoices INV-1042, INV-1051 and INV-1063, $4,120 in total, to ap@acme.example.
    </ApprovalCard>
  );
}
