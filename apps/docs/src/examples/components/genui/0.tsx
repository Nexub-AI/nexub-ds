'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { GenUI, type GenUIActionEvent } from '@nexub/genui';

// What the agent returned. Only catalog components and props render; everything is text.
const answer = {
  version: '1.0',
  title: 'Plans that fit your team',
  root: {
    type: 'Card',
    props: { title: 'Team plan', description: '€8 per seat, monthly', variant: 'surface' },
    children: [
      { type: 'Badge', props: { text: 'Recommended', tone: 'success', variant: 'soft' } },
      { type: 'StreamingText', props: { text: 'Two plans fit a team of 12. Team covers what you use today.' } },
      {
        type: 'DescriptionList',
        props: { items: [{ label: 'Seats', value: '12' }, { label: 'Per seat', value: '€8.00' }, { label: 'Monthly total', value: '€96.00', emphasis: true }] },
      },
      {
        type: 'Table',
        props: {
          caption: 'Compared with Business',
          columns: [{ label: 'Feature' }, { label: 'Team' }, { label: 'Business' }],
          rows: [['SSO', 'No', 'Yes'], ['Audit log', '30 days', '1 year']],
        },
      },
      { type: 'Alert', props: { text: 'Prices exclude VAT.', tone: 'info' } },
      { type: 'Button', key: 'team', props: { label: 'Choose Team', action: { name: 'choosePlan', payload: { plan: 'team' } } } },
      // Not in `actions` below, so it is removed: the model can't invent capabilities.
      { type: 'Button', key: 'delete', props: { label: 'Delete account', tone: 'danger', action: { name: 'deleteAccount' } } },
    ],
  },
};

export default function Example() {
  const [chosen, setChosen] = React.useState<string>();
  // The payload is untrusted input: check it like a request body.
  const onAction = ({ name, payload }: GenUIActionEvent) => {
    const plan = (payload as { plan?: unknown } | undefined)?.plan;
    if (name === 'choosePlan' && (plan === 'team' || plan === 'business')) setChosen(plan);
  };
  return (
    <div className="flex w-full max-w-140 flex-col gap-3">
      <GenUI document={answer} actions={['choosePlan']} onAction={onAction} />
      {chosen && <p className="text-body-sm text-on-surface-variant">The host received choosePlan for the {chosen} plan.</p>}
    </div>
  );
}
