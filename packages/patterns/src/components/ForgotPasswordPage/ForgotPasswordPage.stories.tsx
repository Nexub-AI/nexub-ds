import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Logo } from '@nexub/react';
import { ForgotPasswordPage } from './ForgotPasswordPage.js';

const noop = () => {};
// A fixed clock: the cooldown reads the same in every screenshot.
const now = () => Date.UTC(2026, 10, 17, 9, 0, 0);

const meta: Meta<typeof ForgotPasswordPage> = {
  title: 'Patterns/Pages/ForgotPasswordPage',
  component: ForgotPasswordPage,
  parameters: { layout: 'fullscreen' },
  args: { as: 'div', logo: <Logo size="md" product="Payub" />, onSubmit: noop, onBackToSignIn: noop, now },
};
export default meta;
type Story = StoryObj<typeof ForgotPasswordPage>;

export const Default: Story = {};

export const Sent: Story = { args: { sent: true, defaultEmail: 'mei@example.com', onResend: noop } };

export const Error: Story = { args: { defaultEmail: 'mei@example.com', error: 'Too many attempts. Try again in a few minutes.' } };
