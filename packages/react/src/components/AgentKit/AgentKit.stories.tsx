import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DiffView, PlanTracker, ToolCall } from './AgentKit.js';
import { ApprovalCard } from './ApprovalCard.js';

const meta: Meta = {
  title: 'AI/AgentKit',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const diff = `@@ -1,3 +1,3 @@
 const plan = 'pro';
-const seats = 10;
+const seats = 25;
 export { plan, seats };`;

/** Plan, an expanded tool call, a diff and a pending approval. */
export const Default: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
      <PlanTracker
        steps={[
          { title: 'Find overdue invoices', status: 'done', detail: '3 found' },
          { title: 'Draft reminder emails', status: 'active' },
          { title: 'Send reminders', status: 'pending' },
        ]}
      />
      <ToolCall
        open
        name="search_invoices"
        status="done"
        input={{ status: 'overdue', customer: 'Acme' }}
        output={{ count: 3 }}
      />
      <DiffView file="billing.ts" diff={diff} />
    </div>
  ),
};

export const Approval: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <ApprovalCard title="Send 3 invoices to Acme">Total $4,310.00 to billing@acme.example.</ApprovalCard>
    </div>
  ),
};
