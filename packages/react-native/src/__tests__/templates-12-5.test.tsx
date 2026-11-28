// 12.5: the web templates on native: SignUpScreen, StatusScreen, and the web props of
// SignInScreen and VerifyCodeScreen.
import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, NexubNativeProvider } from '../index';
import { SignInScreen, SignUpScreen, StatusScreen, VerifyCodeScreen } from '../patterns';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const wrap = (ui: React.ReactElement) =>
  render(
    <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
      {ui}
    </NexubNativeProvider>,
  );
/** Containers with a role (alert) that aren't single accessible elements. */
const withRole = (role: string) => screen.container.queryAll((n) => n.props.accessibilityRole === role);

describe('SignInScreen (12.5 props)', () => {
  it('takes a description and string overrides keyed as web', async () => {
    await wrap(
      <SignInScreen
        onSubmit={() => {}}
        onForgotPassword={() => {}}
        description="Welcome back"
        messages={{ email: 'E-Mail', password: 'Passwort', signIn: 'Anmelden', forgotPassword: 'Passwort vergessen?' }}
      />,
    );
    expect(screen.getByText('Welcome back')).toBeTruthy();
    expect(screen.getByLabelText('E-Mail')).toBeTruthy();
    expect(screen.getByLabelText('Passwort')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Anmelden' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Passwort vergessen?' })).toBeTruthy();
  });
});

describe('SignUpScreen', () => {
  const fill = async (password = 'Correct-Horse-9') => {
    await fireEvent.changeText(screen.getByLabelText('Name'), '  Asha  ');
    await fireEvent.changeText(screen.getByLabelText('Email'), 'asha@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), password);
  };

  it('lists every problem on a failed submit and does not call onSubmit', async () => {
    const onSubmit = jest.fn();
    await wrap(<SignUpScreen onSubmit={onSubmit} termsLabel="I agree to the Terms" />);
    await fireEvent.press(screen.getByRole('button', { name: 'Create an account' }));
    expect(onSubmit).not.toHaveBeenCalled();
    // In the summary and under each field.
    expect(screen.getAllByText(/Enter your name/).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/Enter a valid email address/).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/Accept the terms to continue/).length).toBeGreaterThan(1);
  });

  it('checks a field when it loses focus', async () => {
    await wrap(<SignUpScreen onSubmit={() => {}} termsLabel="I agree to the Terms" />);
    expect(screen.queryByText('Enter a valid email address')).toBeNull();
    await fireEvent.changeText(screen.getByLabelText('Email'), 'not-an-email');
    await fireEvent(screen.getByLabelText('Email'), 'blur');
    expect(screen.getByText('Enter a valid email address')).toBeTruthy();
  });

  it('says the password strength in words and refuses a weak one', async () => {
    const onSubmit = jest.fn();
    await wrap(<SignUpScreen onSubmit={onSubmit} termsLabel="I agree to the Terms" />);
    await fill('abc');
    expect(screen.getByText('Password strength: Weak')).toBeTruthy();
    await fireEvent.press(screen.getByRole('checkbox', { name: 'I agree to the Terms' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Create an account' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByText(/Choose a stronger password/).length).toBeGreaterThan(0);
    await fireEvent.changeText(screen.getByLabelText('Password'), 'Correct-Horse-9');
    expect(screen.getByText('Password strength: Strong')).toBeTruthy();
  });

  it('submits trimmed values once everything is valid', async () => {
    const onSubmit = jest.fn();
    await wrap(<SignUpScreen onSubmit={onSubmit} termsLabel="I agree to the Terms" />);
    await fill();
    await fireEvent.press(screen.getByRole('checkbox', { name: 'I agree to the Terms' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Create an account' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Asha', email: 'asha@example.com', password: 'Correct-Horse-9' });
  });

  it('offers new-password autofill and the sign-in way back', async () => {
    const onSignIn = jest.fn();
    await wrap(<SignUpScreen onSubmit={() => {}} termsLabel="I agree" onSignIn={onSignIn} social={null} />);
    const password = screen.getByLabelText('Password');
    expect(password.props.textContentType).toBe('newPassword');
    expect(password.props.autoComplete).toBe('new-password');
    expect(screen.getByText('Already have an account?')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSignIn).toHaveBeenCalled();
  });

  it('shows the social slot with an "or" divider, and the phone field when asked', async () => {
    await wrap(
      <SignUpScreen
        onSubmit={() => {}}
        termsLabel="I agree"
        phone
        defaultCountry="SG"
        social={<SignUpSocial />}
      />,
    );
    expect(screen.getByRole('button', { name: 'Continue with a passkey' })).toBeTruthy();
    expect(screen.getByText('or')).toBeTruthy();
    expect(screen.getByLabelText('Phone number')).toBeTruthy();
  });
});

function SignUpSocial() {
  return (
    <Button variant="outlined" onPress={() => {}}>
      Continue with a passkey
    </Button>
  );
}

describe('VerifyCodeScreen (12.5 props)', () => {
  it('keeps the default footer: no Continue while Resend is offered', async () => {
    await wrap(<VerifyCodeScreen destination="+65 •••• 4821" onComplete={() => {}} onResend={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull();
    expect(screen.getByText('We sent a 6-digit code to +65 •••• 4821.')).toBeTruthy();
  });

  it('shows Continue without onResend, enabled once the code is full', async () => {
    const onComplete = jest.fn();
    await wrap(<VerifyCodeScreen destination="+65 •••• 4821" onComplete={onComplete} length={4} />);
    const go = screen.getByRole('button', { name: 'Continue' });
    expect(go).toBeDisabled();
    await fireEvent.changeText(screen.getByLabelText('Verification code'), '1234');
    expect(onComplete).toHaveBeenCalledTimes(1); // when full
    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
    expect(onComplete).toHaveBeenCalledTimes(2);
    expect(onComplete).toHaveBeenLastCalledWith('1234');
  });

  it('offers other methods, a different number and the time left', async () => {
    const onMethodChange = jest.fn();
    const onChangeDestination = jest.fn();
    const now = () => 0;
    await wrap(
      <VerifyCodeScreen
        destination="+65 •••• 4821"
        onComplete={() => {}}
        onResend={() => {}}
        submitLabel="Verify"
        onChangeDestination={onChangeDestination}
        methods={[{ id: 'app', label: 'Use an authenticator app' }]}
        onMethodChange={onMethodChange}
        expiresAt={5 * 60 * 1000}
        now={now}
      />,
    );
    expect(screen.getByRole('button', { name: 'Verify' })).toBeTruthy();
    expect(screen.getByText('Code expires in')).toBeTruthy();
    expect(screen.getByText('5:00')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Other ways to verify' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Use an authenticator app' }));
    expect(onMethodChange).toHaveBeenCalledWith('app');
    await fireEvent.press(screen.getByRole('button', { name: 'Use a different number' }));
    expect(onChangeDestination).toHaveBeenCalled();
  });

  it('marks the code read-only while it is checked', async () => {
    await wrap(<VerifyCodeScreen destination="x" onComplete={() => {}} loading />);
    expect(screen.getByLabelText('Verification code').props.readOnly).toBe(true);
  });
});

describe('StatusScreen', () => {
  it('uses the localised words for the kind, with the code and one header', async () => {
    await wrap(<StatusScreen kind="notFound" code="404" />);
    expect(screen.getByText('404')).toBeTruthy();
    expect(screen.getAllByRole('header')).toHaveLength(1);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('server error is announced and offers Retry', async () => {
    const onRetry = jest.fn();
    await wrap(<StatusScreen kind="serverError" onRetry={onRetry} />);
    // The text block is the alert (and an assertive live region on Android); its header stays reachable.
    const [alert] = withRole('alert');
    expect(alert!.props.accessibilityLiveRegion).toBe('assertive');
    expect(screen.getByRole('header', { name: 'Something went wrong' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('not found offers Back to home; actions replace the defaults', async () => {
    const onHome = jest.fn();
    const { rerender } = await wrap(<StatusScreen kind="notFound" onHome={onHome} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Back to home' }));
    expect(onHome).toHaveBeenCalled();
    await rerender(
      <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
        <StatusScreen kind="maintenance" title="Back at 6 pm" actions={<SignUpSocial />} illustration={null} />
      </NexubNativeProvider>,
    );
    expect(screen.getByText('Back at 6 pm')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Back to home' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Continue with a passkey' })).toBeTruthy();
    expect(withRole('alert')).toHaveLength(0);
  });
});
