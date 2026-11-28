import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button as NxButton } from '@nexub/react/Button';
import { GenUI, catalog } from './index.js';

const meta: Meta<typeof GenUI> = {
  title: 'AI/GenUI',
  component: GenUI,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { actions: ['choosePlan', 'approveRefund'], onAction: () => {} },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}>{Story()}</div>],
};
export default meta;
type Story = StoryObj<typeof meta>;

const doc = (title: string, root: unknown) => ({ version: '1.0', title, root });

/** A Card groups the answer: title, description, and children (nodes or plain text). */
export const Card: Story = {
  args: {
    document: doc('Refund request', {
      type: 'Card',
      props: { title: 'Refund for order A-1042', description: 'Requested today by Mia Chen', tone: 'warning', variant: 'surface' },
      children: ['The customer says the parcel arrived damaged.', { type: 'Card', props: { title: 'Order' }, children: ['Ceramic mug set, €42.00'] }],
    }),
  },
};

/** Label and value rows, with an emphasised total. */
export const DescriptionList: Story = {
  args: {
    document: doc('Order summary', {
      type: 'DescriptionList',
      props: {
        divided: true,
        items: [
          { label: 'Order', value: 'A-1042' },
          { label: 'Items', value: '2' },
          { label: 'Shipping', value: '€4.90' },
          { label: 'Total', value: '€46.90', emphasis: true },
        ],
      },
    }),
  },
};

/** Data under headers. Cells are text, numbers, booleans or null; `align: "end"` for numbers. */
export const Table: Story = {
  args: {
    document: doc('Open invoices', {
      type: 'Table',
      props: {
        caption: 'Open invoices',
        striped: true,
        columns: [{ label: 'Invoice' }, { label: 'Customer' }, { label: 'Amount', align: 'end' }],
        rows: [
          ['INV-1001', 'Northwind', '€1,200.00'],
          ['INV-1002', 'Contoso', '€860.50'],
          ['INV-1003', 'Fabrikam', null],
        ],
      },
    }),
  },
};

/** Short status labels, in every tone. */
export const Badge: Story = {
  args: {
    document: doc('Statuses', {
      type: 'Card',
      props: { title: 'Statuses' },
      children: (['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => ({ type: 'Badge', key: tone, props: { text: tone, tone, variant: 'soft' } })),
    }),
  },
};

/** A message that needs attention. */
export const Alert: Story = {
  args: {
    document: doc('Card expiry', { type: 'Alert', props: { title: 'Your card expires soon', text: 'Update it before 1 December to keep your plan.', tone: 'warning' } }),
  },
};

/** Plain text, not Markdown: `**this**` stays as typed. */
export const StreamingText: Story = {
  args: {
    document: doc('Answer', { type: 'StreamingText', props: { text: 'Two plans fit a team of 12. **Team** is cheaper; Business adds SSO and audit logs.' } }),
  },
};

/** Buttons send a named action to the host. Only names in `actions` render. */
export const Button: Story = {
  args: {
    document: doc('Plans that fit your team', {
      type: 'Card',
      props: { title: 'Team', description: '€8 per seat, monthly' },
      children: [
        { type: 'Button', key: 'team', props: { label: 'Choose Team', action: { name: 'choosePlan', payload: { plan: 'team' } } } },
        { type: 'Button', key: 'business', props: { label: 'Choose Business', variant: 'tonal', action: { name: 'choosePlan', payload: { plan: 'business' } } } },
        { type: 'Button', key: 'hidden', props: { label: 'Delete account', tone: 'danger', action: { name: 'deleteAccount' } } },
      ],
    }),
  },
};

const streamed = JSON.stringify(
  doc('Plans', {
    type: 'Card',
    props: { title: 'Team', description: '€8 per seat, monthly' },
    children: [
      { type: 'StreamingText', props: { text: 'Two plans fit a team of 12.' } },
      { type: 'Badge', props: { text: 'Recommended', tone: 'success' } },
      { type: 'Button', props: { label: 'Choose Team', action: { name: 'choosePlan', payload: { plan: 'team' } } } },
    ],
  }),
);
const paused = streamed.indexOf('"Recommended"') - 4;

function StreamingDemo(props: React.ComponentProps<typeof GenUI>) {
  // Starts paused part-way (a still frame for the visual baselines); "Finish" streams the rest.
  const [length, setLength] = React.useState(paused);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    if (length >= streamed.length) return setRunning(false);
    const id = setTimeout(() => setLength((n) => Math.min(streamed.length, n + 16)), 30);
    return () => clearTimeout(id);
  }, [running, length]);
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <GenUI {...props} document={streamed.slice(0, length)} streaming={length < streamed.length} />
      <NxButton variant="outlined" size="sm" onClick={() => setRunning(true)} disabled={running || length >= streamed.length}>
        Finish streaming
      </NxButton>
    </div>
  );
}

/** JSON text still arriving: the region is busy, a node still arriving is a skeleton, buttons wait. */
export const Streaming: Story = {
  args: { document: '' },
  render: (args) => <StreamingDemo {...args} />,
};

/** A rejected document shows the fallback, never part of a hostile answer. */
export const Rejected: Story = {
  args: {
    onInvalid: 'reject',
    catalog: catalog.without(['Button']),
    document: doc('Rejected', { type: 'Card', children: [{ type: 'script', props: { text: 'alert(1)' } }] }),
  },
};
