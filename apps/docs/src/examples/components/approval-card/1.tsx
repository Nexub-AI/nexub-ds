'use client';

import { ApprovalCard } from '@nexub/react';

export default function Example() {
  return (
    <ApprovalCard
      title="Send a payment reminder"
      args={{ to: 'ap@acme.example', amount: 4120, currency: 'USD' }}
      onEdit={() => new Promise((resolve) => setTimeout(resolve, 1000))}
      onApprove={() => new Promise((resolve) => setTimeout(resolve, 1000))}
    >
      The agent will email Acme&apos;s billing contact.
    </ApprovalCard>
  );
}
