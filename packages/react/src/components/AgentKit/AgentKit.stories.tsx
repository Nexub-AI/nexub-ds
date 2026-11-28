import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DiffView, PlanTracker, ToolCall } from './AgentKit.js';
import { ApprovalCard } from './ApprovalCard.js';
import { DiffReview, type DiffDecision } from './DiffReview.js';

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

/** 12.4: running, done (with its run time) and failed (with the error and Retry). */
export const ToolCallStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      <ToolCall name="search_invoices" status="running" input={{ customer: 'Acme' }} />
      <ToolCall name="draft_email" status="done" duration={1240} input={{ to: 'ap@acme.example' }} output="Draft saved" />
      <ToolCall
        name="send_email"
        status="failed"
        duration={30000}
        input={{ to: 'ap@acme.example' }}
        error="SMTP timeout after 30 s"
        onRetry={() => {}}
      />
    </div>
  ),
};

/** 12.4: approve, edit the arguments then approve, or deny. */
export const ApprovalEdit: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <ApprovalCard title="Send a payment reminder" args={{ to: 'ap@acme.example', amount: 4310, currency: 'USD' }} onEdit={() => {}}>
        The agent will email Acme&apos;s billing contact.
      </ApprovalCard>
    </div>
  ),
};

/** 12.4: an async callback shows the pending state, then the outcome. */
export const ApprovalPending: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <ApprovalCard title="Archive 12 paid invoices" onApprove={() => new Promise((r) => setTimeout(r, 1500))} />
    </div>
  ),
};

/** 12.4: resolved outcomes, as an app would render them from saved state. */
export const ApprovalOutcomes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <ApprovalCard title="Send 3 invoices" outcome="approved" />
      <ApprovalCard title="Send a reminder" args={{ amount: 4310 }} outcome="edited" />
      <ApprovalCard title="Delete the Acme workspace" outcome="denied" />
    </div>
  ),
};

/** 12.4: line numbers from the hunk header. */
export const DiffLineNumbers: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <DiffView file="billing.ts" diff={diff} lineNumbers />
    </div>
  ),
};

const reviewFiles = [
  { file: 'src/billing.ts', diff },
  {
    file: 'src/reminder.ts',
    diff: `@@ -12,4 +12,5 @@
 export const reminder = {
-  subject: 'Invoice overdue',
+  subject: 'A friendly reminder about your invoice',
+  tone: 'polite',
   cadence: 'weekly',
 };`,
  },
  { file: 'README.md', diff: '@@ -1,2 +1,2 @@\n-# Billing\n+# Billing and reminders\n Runs nightly.' },
];

/** 12.4: review an agent's changes file by file (controlled decisions). */
export const Review: Story = {
  render: function Render() {
    const [decisions, setDecisions] = React.useState<Record<string, DiffDecision>>({ 'README.md': 'accepted' });
    return (
      <div style={{ maxWidth: 640 }}>
        <DiffReview files={reviewFiles} decisions={decisions} onDecisionsChange={setDecisions} />
      </div>
    );
  },
};
