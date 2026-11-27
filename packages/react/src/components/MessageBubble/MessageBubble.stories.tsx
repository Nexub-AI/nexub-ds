import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Pencil, Pin, Trash2 } from '@nexub/icons';
import { MessageActions, MessageBubble } from './MessageBubble.js';
import { MessageCard } from './MessageCard.js';
import { Highlight } from './Highlight.js';
import { Avatar } from '../Avatar/Avatar.js';
import { Badge } from '../Badge/Badge.js';

const meta: Meta<typeof MessageBubble> = {
  title: 'AI/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof MessageBubble>;

const REPLY = 'Sure. The quarterly report is due Friday; I drafted an outline with the revenue summary first and the hiring plan last.';

export const Conversation: Story = {
  render: () => (
    <ol className="flex max-w-2xl list-none flex-col gap-6 p-0">
      <li>
        <MessageBubble from="system">Today</MessageBubble>
      </li>
      <li>
        <MessageBubble from="user">Can you outline the quarterly report for me?</MessageBubble>
      </li>
      <li>
        <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />}>
          <p>{REPLY}</p>
          <MessageActions text={REPLY} onFeedback={() => {}} onRegenerate={() => {}} />
        </MessageBubble>
      </li>
      <li>
        <MessageBubble from="user" status="error" onRetry={() => {}}>
          Add a section on churn too.
        </MessageBubble>
      </li>
    </ol>
  ),
};

/** 11.5: a group thread with a third party (`from="other"`), name and time headers, and a custom action. */
export const GroupThread: Story = {
  render: () => (
    <ol className="flex max-w-2xl list-none flex-col gap-6 p-0">
      <li>
        <MessageBubble from="other" name="Ada Lovelace" meta="09:40" avatar={<Avatar size="sm" fallback="AL" />}>
          Can we move the review to Thursday?
        </MessageBubble>
      </li>
      <li>
        <MessageBubble from="user" meta="09:41">Thursday works for me.</MessageBubble>
      </li>
      <li>
        <MessageBubble from="assistant" meta="09:41" avatar={<Avatar size="sm" fallback="N" />}>
          <p>I moved the review to Thursday at 10:00 and told the team.</p>
          <MessageActions
            text="I moved the review to Thursday at 10:00 and told the team."
            actions={[{ label: 'Pin', icon: <Pin size="sm" aria-hidden="true" />, onSelect: () => {} }]}
          />
        </MessageBubble>
      </li>
    </ol>
  ),
};

/** 12.2: `avatar` on your own messages, at the inline-end with the assistant's size and spacing. */
export const UserAvatar: Story = {
  render: () => (
    <ol className="flex max-w-2xl list-none flex-col gap-6 p-0">
      <li>
        <MessageBubble from="user" meta="09:41" avatar={<Avatar size="sm" fallback="SL" />}>
          Can you outline the quarterly report for me?
        </MessageBubble>
      </li>
      <li>
        <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />}>
          <p>{REPLY}</p>
        </MessageBubble>
      </li>
    </ol>
  ),
};

const LONG =
  'Here is the outline. 1. Revenue summary: totals by region, with the quarter-on-quarter change and the three biggest movers. 2. Costs: payroll, infrastructure and marketing, each against the budget. 3. Churn: the logo and revenue churn rates, the reasons customers gave and what we changed. 4. Hiring plan: open roles by team, the start dates we expect and the budget impact. 5. Risks and asks for the board.';

/** 12.2: `collapse={3}` clamps a long message with a fade and a Read more toggle; a short one gets no toggle. */
export const Collapse: Story = {
  render: () => (
    <ol className="flex max-w-2xl list-none flex-col gap-6 p-0">
      <li>
        <MessageBubble from="user" collapse={3}>
          {LONG}
        </MessageBubble>
      </li>
      <li>
        <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />} collapse={3}>
          <p className="m-0">{LONG}</p>
        </MessageBubble>
      </li>
      <li>
        <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />} collapse={3}>
          <p className="m-0">Short replies fit, so there is no toggle.</p>
        </MessageBubble>
      </li>
    </ol>
  ),
};

const FIELDS = [
  { label: 'Amount', value: '€1,240.00' },
  { label: 'Vendor', value: 'Acme GmbH' },
  { label: 'Submitted by', value: 'Ada Lovelace' },
  { label: 'Due', value: '28 Nov 2026' },
];

/** 12.2: MessageCard inside a reply: title, status Badge, fields, body and two actions. */
export const Card: Story = {
  render: () => (
    <div className="max-w-2xl">
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />}>
        <p>Ada sent an expense report for your approval.</p>
        <MessageCard
          title="Expense report"
          status={<Badge variant="soft" tone="warning">Pending</Badge>}
          fields={FIELDS}
          body="Team offsite, Berlin. Receipts attached."
          actions={[
            { label: 'Approve', onSelect: () => {} },
            { label: 'Reject', onSelect: () => {} },
          ]}
        />
      </MessageBubble>
    </div>
  ),
};

/** 12.2: past two actions the rest go into a "More actions" menu; `maxHeight` adds "Show all". */
export const CardOverflow: Story = {
  render: () => (
    <div className="max-w-2xl">
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />}>
        <MessageCard
          title="Contract renewal"
          status={<Badge variant="soft" tone="info">Draft</Badge>}
          fields={FIELDS}
          body={LONG}
          maxHeight={160}
          actions={[
            { label: 'Send for signature', onSelect: () => {} },
            { label: 'Edit', onSelect: () => {}, icon: <Pencil size="sm" aria-hidden="true" /> },
            { label: 'Duplicate', onSelect: () => {} },
            { label: 'Delete', onSelect: () => {}, icon: <Trash2 size="sm" aria-hidden="true" /> },
          ]}
        />
      </MessageBubble>
    </div>
  ),
};

/** 12.2: once handled, `done` replaces the actions with one line and a SuccessCheck. */
export const CardDone: Story = {
  render: () => (
    <div className="max-w-2xl">
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />}>
        <MessageCard
          title="Expense report"
          status={<Badge variant="soft" tone="success">Approved</Badge>}
          fields={FIELDS.slice(0, 2)}
          done="Approved by you · 2:14 pm"
        />
      </MessageBubble>
    </div>
  ),
};

/** 12.2: Highlight picks out amounts, dates and statuses in running text, in six tones. */
export const Highlights: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6">
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />}>
        <p>
          The invoice for <Highlight tone="primary">€1,240.00</Highlight> is due on <Highlight>28 Nov 2026</Highlight>. Payment
          is <Highlight tone="success">confirmed</Highlight>, the receipt is <Highlight tone="warning">missing</Highlight>, the
          refund <Highlight tone="error">failed</Highlight> and the ticket is <Highlight tone="info">in review</Highlight>.
        </p>
      </MessageBubble>
      <MessageBubble from="user">
        Is <Highlight>€1,240.00</Highlight> the total?
      </MessageBubble>
    </div>
  ),
};
