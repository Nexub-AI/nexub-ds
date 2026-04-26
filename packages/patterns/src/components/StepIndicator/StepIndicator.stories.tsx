import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StepIndicator } from './StepIndicator.js';

const meta: Meta = {
  title: 'Patterns/StepIndicator',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const onboardingSteps = [
  { label: 'Create account', description: 'Enter your email and set a password.' },
  { label: 'Set up workspace', description: 'Name your workspace and invite teammates.' },
  { label: 'Connect integrations', description: 'Link your existing tools and data sources.' },
  { label: 'Launch', description: 'You are all set — start exploring Nexub.' },
];

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '340px', padding: '24px' }}>
      {/* currentStep is 0-indexed; step 2 is the current (3rd) step */}
      <StepIndicator steps={onboardingSteps} currentStep={1} />
    </div>
  ),
};

export const FirstStep: Story = {
  render: () => (
    <div style={{ maxWidth: '340px', padding: '24px' }}>
      <StepIndicator steps={onboardingSteps} currentStep={0} />
    </div>
  ),
};

export const Completed: Story = {
  render: () => (
    <div style={{ maxWidth: '340px', padding: '24px' }}>
      <StepIndicator steps={onboardingSteps} currentStep={4} />
    </div>
  ),
};
