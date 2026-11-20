import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button, Link, Logo } from '@nexub/react';
import { SignUpPage } from './SignUpPage.js';

const noop = () => {};

const meta: Meta<typeof SignUpPage> = {
  title: 'Patterns/Pages/SignUpPage',
  component: SignUpPage,
  parameters: { layout: 'fullscreen' },
  args: {
    as: 'div',
    logo: <Logo size="md" product="Payub" />,
    onSubmit: noop,
    onSignIn: noop,
    termsLabel: (
      <>
        I agree to the <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link>
      </>
    ),
  },
};
export default meta;
type Story = StoryObj<typeof SignUpPage>;

export const Default: Story = {};

export const WithPhoneAndSocial: Story = {
  args: {
    phone: true,
    defaultCountry: 'SG',
    social: (
      <Button variant="outlined" size="lg" fullWidth>
        Continue with a passkey
      </Button>
    ),
  },
};

export const Error: Story = { args: { error: 'An account with this email already exists. Sign in instead.' } };
