/**
 * 10.8 "getting in" templates: sign up, forgot password, verify code,
 * onboarding and identity verification. Same shape as `templateEntries`.
 */
import type { NativeTwin } from './native';

export const gettingInTemplates = [
  {
    slug: 'sign-up',
    title: 'Sign up',
    web: 'SignUpPage',
    description: 'Name, email and a password with a strength meter said in words, an optional phone number and the terms. Fields are checked on blur and on submit, with a summary of every problem.',
    code: `<SignUpPage
  logo={<Logo product="Payub" />}
  termsLabel={<>I agree to the <Link href="/terms">Terms</Link></>}
  phone
  social={<Button variant="outlined" fullWidth>Continue with a passkey</Button>}
  onSubmit={({ name, email, password, phone }) => signUp({ name, email, password, phone })}
  onSignIn={() => router.push('/sign-in')}
  error={error}
/>`,
    native: {
      name: 'SignUpScreen',
      differences: [
        { aspect: 'Autofill', web: '`autocomplete="new-password"`.', mobile: '`textContentType="newPassword"`: iCloud Keychain and Android Autofill suggest a strong password.' },
        { aspect: 'Terms', web: '`termsLabel` can hold links.', mobile: '`termsLabel` is text; put a "Read" button in `termsAction`.' },
        { aspect: 'Errors', web: 'An ErrorSummary with links to each field.', mobile: 'A danger Banner listing each problem, and the error under each field.' },
        { aspect: 'Submit', web: 'At the end of the form.', mobile: 'Pinned above the keyboard, with "Already have an account?" under it.' },
      ],
      code: `import { SignUpScreen } from '@nexub/react-native/patterns';

<SignUpScreen
  termsLabel="I agree to the Terms and Privacy Policy"
  termsAction={<Button variant="text" size="sm" onPress={openTerms}>Read</Button>}
  phone
  onSubmit={({ name, email, password, phone }) => signUp({ name, email, password, phone })}
  onSignIn={() => router.push('/sign-in')}
  error={error}
/>`,
    },
  },
  {
    slug: 'forgot-password',
    title: 'Forgot password',
    web: 'ForgotPasswordPage',
    description: 'Ask for the email, then confirm with "Check your email". The confirmation never says whether the account exists, and Resend waits out a cooldown.',
    code: `<ForgotPasswordPage
  onSubmit={(email) => sendResetLink(email)}
  onResend={(email) => sendResetLink(email)}
  resendAfter={30}
  onBackToSignIn={() => router.push('/sign-in')}
/>`,
  },
  {
    slug: 'verify-code',
    title: 'Verify code',
    web: 'VerifyCodePage',
    description: 'One-time code for sign-in or a second factor: boxes that take the OS code suggestion and submit when full, a resend countdown, the code lifetime and other ways to verify.',
    code: `<VerifyCodePage
  destination="+65 •••• 4821"
  onComplete={(code) => verify(code)}
  onResend={resend}
  expiresAt={expiresAt}
  onChangeDestination={changeNumber}
  methods={[{ id: 'app', label: 'Use an authenticator app' }, { id: 'recovery', label: 'Use a recovery code' }]}
  onMethodChange={setMethod}
  loading={checking}
  error={error}
/>`,
    native: {
      name: 'VerifyCodeScreen',
      preview: 'pattern/verify',
      differences: [
        { aspect: 'Autofill', web: '`autocomplete="one-time-code"` on the first box.', mobile: 'SMS code autofill from the keyboard.' },
        { aspect: 'Resend', web: 'A countdown line that becomes a "Resend code" link.', mobile: 'A full-width Resend button, disabled while it counts down.' },
        { aspect: 'Continue', web: 'Always shown.', mobile: 'Shown with `submitLabel`, or when there is no `onResend`; the code also submits when full.' },
      ],
      code: `import { VerifyCodeScreen } from '@nexub/react-native/patterns';

<VerifyCodeScreen
  destination="+65 •••• 4821"
  onComplete={verify}
  onResend={resend}
  expiresAt={expiresAt}
  onChangeDestination={changeNumber}
  methods={[{ id: 'app', label: 'Use an authenticator app' }, { id: 'recovery', label: 'Use a recovery code' }]}
  onMethodChange={setMethod}
  loading={checking}
  error={error}
/>`,
    },
  },
  {
    slug: 'onboarding',
    title: 'Onboarding',
    web: 'OnboardingPage',
    description: 'A setup wizard: one question per step, "Step n of N", Back, Continue and Skip, a check before each move forward and a completion view. Focus moves to each step heading.',
    code: `<OnboardingPage
  steps={[
    { id: 'use', title: 'What will you use it for?', content: <RadioCardGroup>…</RadioCardGroup>, validate: () => Boolean(use) || 'Pick one to continue' },
    { id: 'alerts', title: 'Choose your alerts', optional: true, content: <AlertOptions /> },
  ]}
  onComplete={saveSetup}
  completeDescription="Your workspace is ready."
  completeActions={<Button onClick={goHome}>Go to dashboard</Button>}
/>`,
    native: {
      name: 'OnboardingScreen',
      preview: 'pattern/onboarding',
      differences: [
        { aspect: 'Purpose', web: 'A form wizard: steps with content, validation and a completion view.', mobile: 'Intro slides, not a form wizard: swipeable value slides with Get started and Sign in.' },
        { aspect: 'Progress', web: 'A progress bar, or the named steps when there is room.', mobile: 'Page dots under the slides.' },
      ],
      code: `import { OnboardingScreen } from '@nexub/react-native/patterns';

<OnboardingScreen slides={slides} onGetStarted={start} onSignIn={signIn} />`,
    },
  },
  {
    slug: 'kyc',
    title: 'Identity verification',
    web: 'KycPage',
    description: 'Personal details, a document with photo instructions and uploads, a review with links back to each part, then the status of the application: submitted, under review, approved or rejected with a way to fix it.',
    code: `<KycPage
  defaultValues={{ legalName: user.name, country: 'SG' }}
  countries={['SG', 'MY', 'IN']}
  onSubmit={(values) => submitKyc(values)}
  status={application?.status}
  rejectionReason={application?.reason}
/>`,
  },
] satisfies ReadonlyArray<{ slug: string; title: string; web: string; description: string; code: string; native?: NativeTwin }>;
