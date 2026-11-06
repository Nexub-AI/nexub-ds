import { PlanTracker } from '@nexub/react';

export default function Example() {
  return (
    <PlanTracker
      steps={[
        { title: 'Read October invoices', status: 'done', detail: '42 invoices' },
        { title: 'Match payments to invoices', status: 'active', detail: '31 of 42 matched' },
        { title: 'Draft reminders for the unpaid ones', status: 'pending' },
        { title: 'Ask you before sending', status: 'pending' },
      ]}
    />
  );
}
