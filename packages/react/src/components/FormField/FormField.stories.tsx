import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FormField } from './FormField.js';
import { Input } from '../Input/index.js';

const meta: Meta<typeof FormField.Root> = {
  title: 'Components/FormField',
  component: FormField.Root,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FormField.Root>;

export const Default: Story = {
  render: () => (
    <FormField.Root id="email" name="email">
      <FormField.Label>Email address</FormField.Label>
      <FormField.Control>
        <Input placeholder="you@example.com" />
      </FormField.Control>
      <FormField.Description>We will never share your email.</FormField.Description>
    </FormField.Root>
  ),
};

/**
 * 12.4 agent states: `streaming` while an agent fills the field (aria-busy, a calm shimmer,
 * still editable), `generated` once it has: a "Suggested" mark, read in the description,
 * with optional accept and clear buttons. Editing the value clears the mark.
 */
export const AgentStates: Story = {
  render: function AgentStates() {
    const [summary, setSummary] = React.useState('Customer asked for a refund on order 1042');
    const [generated, setGenerated] = React.useState(true);
    return (
      <div className="flex max-w-md flex-col gap-6">
        <FormField.Root id="title" streaming>
          <FormField.Label>Title</FormField.Label>
          <FormField.Control>
            <Input defaultValue="Refund request for" />
          </FormField.Control>
        </FormField.Root>
        <FormField.Root
          id="summary"
          generated={generated}
          onAcceptSuggestion={() => setGenerated(false)}
          onClearSuggestion={() => {
            setSummary('');
            setGenerated(false);
          }}
        >
          <FormField.Label>Summary</FormField.Label>
          <FormField.Control>
            <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
          </FormField.Control>
          <FormField.Description>Shown to the customer.</FormField.Description>
        </FormField.Root>
      </div>
    );
  },
};
