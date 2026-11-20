import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Logo } from '@nexub/react';
import { VerifyCodePage } from './VerifyCodePage.js';

const noop = () => {};
// A fixed clock: both countdowns read the same in every screenshot.
const start = Date.UTC(2026, 10, 17, 9, 0, 0);
const now = () => start;

const meta: Meta<typeof VerifyCodePage> = {
  title: 'Patterns/Pages/VerifyCodePage',
  component: VerifyCodePage,
  parameters: { layout: 'fullscreen' },
  args: {
    as: 'div',
    logo: <Logo size="md" product="Payub" />,
    destination: '+65 •••• 4821',
    onComplete: noop,
    onResend: noop,
    onChangeDestination: noop,
    now,
  },
};
export default meta;
type Story = StoryObj<typeof VerifyCodePage>;

export const Default: Story = {};

export const TwoFactor: Story = {
  args: {
    title: 'Two-step verification',
    expiresAt: start + 10 * 60_000,
    onChangeDestination: undefined,
    methods: [
      { id: 'app', label: 'Use an authenticator app' },
      { id: 'recovery', label: 'Use a recovery code' },
    ],
    onMethodChange: noop,
  },
};

export const Error: Story = { args: { error: 'That code is not right. Check it and try again.' } };
