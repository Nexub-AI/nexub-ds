import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Badge, Button, Input } from '@nexub/react';
import { StatusSteps } from '../StatusSteps/index.js';
import { DetailPage, type DetailPageProps, type DetailSection } from './DetailPage.js';

const meta: Meta<typeof DetailPage> = {
  title: 'Patterns/Pages/DetailPage',
  component: DetailPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof DetailPage>;

const sections: DetailSection[] = [
  {
    id: 'contact',
    title: 'Contact',
    description: 'How your team reaches this customer.',
    fields: [
      { name: 'name', label: 'Name', value: 'Ada Park', input: <Input defaultValue="Ada Park" required /> },
      { name: 'phone', label: 'Phone', value: '+1 555 0142', input: <Input type="tel" defaultValue="+1 555 0142" /> },
      { name: 'email', label: 'Email', value: 'ada@harbour.test', input: <Input type="email" defaultValue="ada@harbour.test" required />, span: 2 },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    fields: [
      { name: 'id', label: 'Customer ID', value: 'CUS-1042' },
      { name: 'plan', label: 'Plan', value: 'Team, yearly' },
      { name: 'company', label: 'Company', value: 'Harbour Studio', input: <Input defaultValue="Harbour Studio" />, span: 2 },
    ],
  },
];
const page: DetailPageProps = {
  as: 'div',
  title: 'Ada Park',
  subtitle: 'Customer since March 2024',
  status: (
    <Badge tone="success" variant="soft" dot>
      Active
    </Badge>
  ),
  actions: <Button variant="outlined">Message</Button>,
  onBack: () => {},
  sections,
  onSave: () => new Promise<void>((resolve) => setTimeout(resolve, 600)),
  aside: (
    <StatusSteps
      aria-label="Onboarding"
      steps={[
        { title: 'Account created', status: 'done' },
        { title: 'Billing set up', status: 'done' },
        { title: 'Team invited', status: 'current' },
      ]}
    />
  ),
};

/** View mode: sections as description lists, the aside beside them with room. */
export const Default: Story = { render: () => <DetailPage {...page} /> };

/** Edit mode: the same grid with inputs and a sticky Save / Cancel bar. */
export const Editing: Story = { render: () => <DetailPage {...page} defaultEditing /> };
