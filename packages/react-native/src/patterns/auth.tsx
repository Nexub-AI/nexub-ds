import * as React from 'react';
import { View } from 'react-native';
import { Lock, ShieldCheck } from '@nexub/icons/native';
import { Button } from '../components/actions';
import { PasswordInput, TextField } from '../components/inputs';
import { Banner } from '../components/feedback';
import { OTPInput, StickyFooter } from '../components/mobile';
import { ScreenContainer } from '../primitives/ScreenContainer';
import { Text, Heading } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';

export interface AuthScreenProps {
  /** Brand mark above the title. */
  logo?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Primary action(s), kept above the keyboard. */
  footer: React.ReactNode;
  /** Error from the last attempt (announced). */
  error?: string;
}

/** Frame for sign-in, sign-up and verification screens (web AuthCard, full screen). */
export function AuthScreen({ logo, title, description, children, footer, error }: AuthScreenProps) {
  const { tokens } = useTheme();
  return (
    <StickyFooter footer={footer}>
      <ScreenContainer
        edges={['top', 'left', 'right']}
        gap="6"
        contentStyle={{ paddingTop: tokens.spacing[10] }}
      >
        <View style={{ gap: tokens.spacing[2] }}>
          {logo}
          <Heading variant="headline-md">{title}</Heading>
          {description && (
            <Text variant="body-md" color="on-surface-variant">
              {description}
            </Text>
          )}
        </View>
        {error && <Banner tone="danger">{error}</Banner>}
        <View style={{ gap: tokens.spacing[4] }}>{children}</View>
      </ScreenContainer>
    </StickyFooter>
  );
}

export interface SignInScreenProps {
  onSubmit: (email: string, password: string) => void;
  /** Offer passkey/biometric sign-in (name the method: "Sign in with Face ID"). */
  biometricLabel?: string;
  onBiometric?: () => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
  loading?: boolean;
  error?: string;
  logo?: React.ReactNode;
  /** Copy overrides. */
  title?: string;
  submitLabel?: string;
}

/** Email + password sign-in with platform autofill, plus an optional biometric/passkey path. */
export function SignInScreen({
  onSubmit,
  biometricLabel,
  onBiometric,
  onForgotPassword,
  onCreateAccount,
  loading,
  error,
  logo,
  title = 'Sign in',
  submitLabel = 'Sign in',
}: SignInScreenProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <AuthScreen
      logo={logo}
      title={title}
      error={error}
      footer={
        <>
          <Button
            size="lg"
            fullWidth
            loading={loading}
            disabled={!email || !password}
            onPress={() => onSubmit(email, password)}
          >
            {submitLabel}
          </Button>
          {onBiometric && biometricLabel && (
            <Button
              size="lg"
              fullWidth
              variant="tonal"
              leadingIcon={ShieldCheck}
              onPress={onBiometric}
            >
              {biometricLabel}
            </Button>
          )}
          {onCreateAccount && (
            <Button size="lg" fullWidth variant="text" onPress={onCreateAccount}>
              Create an account
            </Button>
          )}
        </>
      }
    >
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="username"
        returnKeyType="next"
      />
      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        returnKeyType="go"
        onSubmitEditing={() => email && password && onSubmit(email, password)}
      />
      {onForgotPassword && (
        <Button
          variant="text"
          size="sm"
          onPress={onForgotPassword}
          style={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Button>
      )}
    </AuthScreen>
  );
}

export interface VerifyCodeScreenProps {
  /** Where the code went, e.g. "+65 •••• 4821". */
  destination: string;
  onComplete: (code: string) => void;
  onResend: () => void;
  /** Seconds before Resend is allowed again. @default 30 */
  resendAfter?: number;
  length?: number;
  error?: string;
}

/** One-time code entry (SMS autofill ready) with a resend countdown. */
export function VerifyCodeScreen({
  destination,
  onComplete,
  onResend,
  resendAfter = 30,
  length = 6,
  error,
}: VerifyCodeScreenProps) {
  const [left, setLeft] = React.useState(resendAfter);
  React.useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <AuthScreen
      title="Enter the code"
      description={`We sent a ${length}-digit code to ${destination}.`}
      footer={
        <Button
          size="lg"
          fullWidth
          variant="text"
          disabled={left > 0}
          onPress={() => {
            setLeft(resendAfter);
            onResend();
          }}
        >
          {left > 0 ? `Resend code in ${left}s` : 'Resend code'}
        </Button>
      }
    >
      <OTPInput
        label="Verification code"
        length={length}
        onComplete={onComplete}
        error={error}
        autoFocus
      />
    </AuthScreen>
  );
}

export interface LockScreenProps {
  /** "Unlock with Face ID" / "Unlock with fingerprint" (name the method). */
  unlockLabel: string;
  onUnlock: () => void;
  /** Fallback to the app passcode or password. */
  onUsePasscode?: () => void;
  logo?: React.ReactNode;
  appName?: string;
}

/** Biometric unlock on app open/resume, with a passcode fallback. */
export function LockScreen({
  unlockLabel,
  onUnlock,
  onUsePasscode,
  logo,
  appName,
}: LockScreenProps) {
  const { roles, tokens } = useTheme();
  return (
    <StickyFooter
      footer={
        <>
          <Button size="lg" fullWidth leadingIcon={ShieldCheck} onPress={onUnlock}>
            {unlockLabel}
          </Button>
          {onUsePasscode && (
            <Button size="lg" fullWidth variant="text" onPress={onUsePasscode}>
              Use passcode
            </Button>
          )}
        </>
      }
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.spacing[4],
          padding: tokens.spacing[6],
        }}
      >
        {logo ?? (
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: roles['primary-container'],
            }}
          >
            <Lock size="xl" color={roles['on-primary-container']} />
          </View>
        )}
        <Heading variant="headline-sm" style={{ textAlign: 'center' }}>
          {appName ? `${appName} is locked` : 'Locked'}
        </Heading>
      </View>
    </StickyFooter>
  );
}
