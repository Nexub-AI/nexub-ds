import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper.js';
import { ResizablePanels } from '../ResizablePanels/ResizablePanels.js';
import { ActionBar } from '../ActionBar/ActionBar.js';
import { Button } from '../Button/Button.js';

const meta: Meta = {
  title: 'Components/Stepper',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { id: 'account', label: 'Account', description: 'Name and email' },
  { id: 'billing', label: 'Billing', description: 'Plan and card' },
  { id: 'team', label: 'Team' },
  { id: 'review', label: 'Review' },
];

export const Horizontal: Story = {
  render: () => <Stepper aria-label="Setup" steps={steps} current={1} onStepChange={() => {}} className="max-w-2xl" />,
};
export const Vertical: Story = {
  render: () => <Stepper aria-label="Setup" steps={steps} current={2} orientation="vertical" />,
};
export const Panels: Story = {
  render: () => (
    <ResizablePanels defaultSizes={[30, 70]} className="h-64 rounded-shape-container border border-[var(--color-outline-variant)]">
      <div className="p-4 text-body-md">Inbox</div>
      <div className="p-4 text-body-md">Message</div>
    </ResizablePanels>
  ),
};
export const Actions: Story = {
  render: () => (
    <ActionBar message="Unsaved changes" className="max-w-2xl">
      <Button variant="text">Discard</Button>
      <Button>Save changes</Button>
    </ActionBar>
  ),
};
