'use client';

import * as React from 'react';
import { ForgotPasswordPage, KycPage, OnboardingPage, SignUpPage, VerifyCodePage } from '@nexub/patterns';
import { Button, Checkbox, Link, Logo, RadioCard, RadioCardGroup } from '@nexub/react';

const noop = () => {};
// A fixed clock, so the countdowns match on the server and in screenshots.
const start = Date.UTC(2026, 10, 17, 9, 0, 0);
const now = () => start;
const logo = <Logo size="md" product="Payub" />;

function SignUp() {
  return (
    <SignUpPage
      as="div"
      logo={logo}
      phone
      defaultCountry="SG"
      termsLabel={
        <>
          I agree to the <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link>
        </>
      }
      onSubmit={noop}
      onSignIn={noop}
    />
  );
}

function ForgotPassword() {
  return <ForgotPasswordPage as="div" logo={logo} onSubmit={noop} onResend={noop} onBackToSignIn={noop} now={now} />;
}

function VerifyCode() {
  return (
    <VerifyCodePage
      as="div"
      logo={logo}
      destination="+65 •••• 4821"
      onComplete={noop}
      onResend={noop}
      expiresAt={start + 10 * 60_000}
      onChangeDestination={noop}
      methods={[
        { id: 'app', label: 'Use an authenticator app' },
        { id: 'recovery', label: 'Use a recovery code' },
      ]}
      onMethodChange={noop}
      now={now}
    />
  );
}

const option = (label: string, on?: boolean) => (
  <label key={label} className="flex items-center gap-3 text-body-md text-on-surface">
    <Checkbox defaultChecked={on} />
    {label}
  </label>
);

function Onboarding() {
  return (
    <OnboardingPage
      as="div"
      steps={[
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
          content: <div className="flex flex-col gap-3">{[option('Payments received', true), option('Bills due this week', true), option('Product news')]}</div>,
        },
        {
          id: 'security',
          title: 'Keep your account safe',
          content: <div className="flex flex-col gap-3">{[option('Ask for a code when I sign in', true), option('Email me about new devices', true)]}</div>,
        },
      ]}
      onComplete={noop}
      completeDescription="Your workspace is ready."
      completeActions={<Button size="lg">Go to dashboard</Button>}
    />
  );
}

function Kyc() {
  return (
    <KycPage
      as="div"
      defaultCountry="SG"
      defaultValues={{ legalName: 'Mei Tan', dateOfBirth: new Date(1990, 0, 15), phone: '+6591234567', country: 'SG' }}
      onSubmit={() => new Promise((r) => setTimeout(r, 700))}
    />
  );
}

export const gettingInPreviews = {
  'sign-up': SignUp,
  'forgot-password': ForgotPassword,
  'verify-code': VerifyCode,
  onboarding: Onboarding,
  kyc: Kyc,
};
