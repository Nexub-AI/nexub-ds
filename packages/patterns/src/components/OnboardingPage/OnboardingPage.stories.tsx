import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button, Checkbox, RadioCard, RadioCardGroup } from '@nexub/react';
import { OnboardingPage, type OnboardingStep } from './OnboardingPage.js';

const check = (label: string, on?: boolean) => (
  <label key={label} className="flex items-center gap-3 text-body-md text-[var(--color-on-surface)]">
    <Checkbox defaultChecked={on} />
    {label}
  </label>
);

const steps: OnboardingStep[] = [
  {
    id: 'use',
    title: 'What will you use it for?',
    description: 'We set up your workspace to match. You can change this later.',
    content: (
      <RadioCardGroup defaultValue="personal" aria-label="What will you use it for?">
        <RadioCard value="personal" title="Personal" description="Track your own spending and savings." />
        <RadioCard value="team" title="A small team" description="Share budgets and approve expenses together." />
        <RadioCard value="company" title="A company" description="Roles, approvals and reports across teams." />
      </RadioCardGroup>
    ),
  },
  {
    id: 'alerts',
    title: 'Choose your alerts',
    description: 'Pick what we tell you about.',
    optional: true,
    content: <div className="flex flex-col gap-3">{[check('Payments received', true), check('Bills due this week', true), check('Product news')]}</div>,
  },
  {
    id: 'security',
    title: 'Keep your account safe',
    content: <div className="flex flex-col gap-3">{[check('Ask for a code when I sign in', true), check('Email me about new devices', true)]}</div>,
  },
];

const meta: Meta<typeof OnboardingPage> = {
  title: 'Patterns/Pages/OnboardingPage',
  component: OnboardingPage,
  parameters: { layout: 'fullscreen' },
  args: {
    as: 'div',
    steps,
    onComplete: () => {},
    completeDescription: 'Your workspace is ready.',
    completeActions: <Button size="lg">Go to dashboard</Button>,
  },
};
export default meta;
type Story = StoryObj<typeof OnboardingPage>;

export const Default: Story = {};

export const Step2: Story = { args: { defaultStep: 1 } };

/** With room, the bar becomes the named steps. */
export const Wide: Story = { args: { width: 'md', defaultStep: 1 } };
