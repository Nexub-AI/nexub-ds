import * as React from 'react';
import { View } from 'react-native';
import { Lock, ShieldCheck } from '@nexub/icons/native';
import { Button } from '../components/actions';
import { Checkbox, PasswordInput, TextField } from '../components/inputs';
import { Banner, Progress } from '../components/feedback';
import { OTPInput, StickyFooter } from '../components/mobile';
import { Countdown } from '../components/countdown';
import { Divider } from '../components/display';
import { PhoneInput, type PhoneInputProps } from '../components/phone';
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
        keyboardAvoiding={false}
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

/**
 * 12.5: the strings of the auth screens. The keys are the web templates' (`PageTemplateMessages`
 * in @nexub/patterns), so one translation file can serve both; `verificationCode` is native only.
 */
export interface AuthScreenMessages {
  email: string;
  password: string;
  phone: string;
  signIn: string;
  createAccount: string;
  forgotPassword: string;
  continue: string;
  enterValidEmail: string;
  enterValidPhone: string;
  /** Sign-up title. */
  signUp: string;
  name: string;
  haveAccount: string;
  or: string;
  passwordHint: string;
  passwordStrength: (label: string) => string;
  /** Weak, fair, good, strong. */
  strengthLabels: string[];
  enterName: string;
  choosePassword: string;
  acceptTerms: string;
  enterCode: string;
  codeSentTo: (length: number, destination: string) => string;
  /** The code field's accessible name (native only). */
  verificationCode: string;
  resendCode: string;
  /** Followed by the seconds left: "Resend code in 30s". */
  resendCodeIn: string;
  changeDestination: string;
  codeExpiresIn: string;
  otherMethods: string;
}

/** English defaults for `AuthScreenMessages` (the same words as web). */
export const defaultAuthScreenMessages: AuthScreenMessages = {
  email: 'Email',
  password: 'Password',
  phone: 'Phone number',
  signIn: 'Sign in',
  createAccount: 'Create an account',
  forgotPassword: 'Forgot password?',
  continue: 'Continue',
  enterValidEmail: 'Enter a valid email address',
  enterValidPhone: 'Enter a valid phone number',
  signUp: 'Create your account',
  name: 'Name',
  haveAccount: 'Already have an account?',
  or: 'or',
  passwordHint: 'Use 8 or more characters with upper and lower case letters and a number or symbol.',
  passwordStrength: (label) => `Password strength: ${label}`,
  strengthLabels: ['Weak', 'Fair', 'Good', 'Strong'],
  enterName: 'Enter your name',
  choosePassword: 'Choose a stronger password',
  acceptTerms: 'Accept the terms to continue',
  enterCode: 'Enter the code',
  codeSentTo: (length, destination) => `We sent a ${length}-digit code to ${destination}.`,
  verificationCode: 'Verification code',
  resendCode: 'Resend code',
  resendCodeIn: 'Resend code in',
  changeDestination: 'Use a different number',
  codeExpiresIn: 'Code expires in',
  otherMethods: 'Other ways to verify',
};

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
  /** 12.5: a line under the title, as web. */
  description?: string;
  submitLabel?: string;
  /** 12.5: string overrides, keyed as web (`email`, `password`, `forgotPassword`, `createAccount` …). */
  messages?: Partial<AuthScreenMessages>;
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
  title,
  description,
  submitLabel,
  messages,
}: SignInScreenProps) {
  const m = { ...defaultAuthScreenMessages, ...messages };
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <AuthScreen
      logo={logo}
      title={title ?? m.signIn}
      description={description}
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
            {submitLabel ?? m.signIn}
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
              {m.createAccount}
            </Button>
          )}
        </>
      }
    >
      <TextField
        label={m.email}
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
        label={m.password}
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
          {m.forgotPassword}
        </Button>
      )}
    </AuthScreen>
  );
}

// ─── SignUpScreen (12.5) ─────────────────────────────────────────────────────

export interface SignUpValues {
  name: string;
  email: string;
  password: string;
  /** E.164, only with `phone` and when a number was entered. */
  phone?: string;
}

export type PasswordRule = (password: string) => boolean;

/** 8+ characters, mixed case, a digit or symbol, 12+ characters. Three of four is "good" and accepted. As web. */
export const defaultPasswordRules: PasswordRule[] = [
  (p) => p.length >= 8,
  (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  (p) => /[\d\W_]/.test(p),
  (p) => p.length >= 12,
];

export interface SignUpScreenProps {
  onSubmit: (values: SignUpValues) => void;
  /** The terms checkbox label, e.g. "I agree to the Terms and Privacy Policy". */
  termsLabel: string;
  /** Native only: at the end of the terms row, e.g. a "Read" text button that opens the terms. */
  termsAction?: React.ReactNode;
  /** Adds an optional phone number field. */
  phone?: boolean;
  /** Country the phone field starts on (ISO 3166-1 alpha-2). */
  defaultCountry?: PhoneInputProps['defaultCountry'];
  /** Renders "Already have an account? Sign in" under the primary button. */
  onSignIn?: () => void;
  /** Above the form, followed by an "or" divider: "Continue with …" buttons. */
  social?: React.ReactNode;
  /**
   * Checks behind the strength meter. The share that passes fills four segments;
   * three or more segments is accepted. Say what you ask for in `messages.passwordHint`.
   * @default defaultPasswordRules
   */
  passwordRules?: PasswordRule[];
  loading?: boolean;
  /** Error from the last attempt (announced). */
  error?: string;
  logo?: React.ReactNode;
  title?: string;
  description?: string;
  submitLabel?: string;
  /** String overrides, keyed as web (`signUp`, `name`, `passwordHint`, `acceptTerms` …). */
  messages?: Partial<AuthScreenMessages>;
}

type SignUpField = 'name' | 'email' | 'password' | 'phone' | 'terms';
const SIGN_UP_FIELDS: SignUpField[] = ['name', 'email', 'password', 'phone', 'terms'];

/**
 * Account creation, as the web SignUpPage: name, email, a password with a strength meter that
 * is also said in words, an optional phone number and the terms. Fields are checked when they
 * lose focus and on submit; a failed submit lists every problem at the top. Platform autofill
 * hints (`textContentType`, `autoComplete`) let iCloud Keychain and Android Autofill suggest a
 * new password.
 */
export function SignUpScreen({
  onSubmit,
  termsLabel,
  termsAction,
  phone,
  defaultCountry,
  onSignIn,
  social,
  passwordRules = defaultPasswordRules,
  loading,
  error,
  logo,
  title,
  description,
  submitLabel,
  messages,
}: SignUpScreenProps) {
  const { tokens } = useTheme();
  const m = { ...defaultAuthScreenMessages, ...messages };
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [tel, setTel] = React.useState({ e164: '', national: '', valid: false });
  const [accepted, setAccepted] = React.useState(false);
  const [touched, setTouched] = React.useState<Partial<Record<SignUpField, boolean>>>({});
  const [summary, setSummary] = React.useState<string[]>([]);

  const passed = passwordRules.filter((rule) => rule(password)).length;
  const score = passwordRules.length ? Math.round((passed / passwordRules.length) * 4) : 4;
  const strength = m.strengthLabels[Math.max(score, 1) - 1] ?? '';

  const errors: Partial<Record<SignUpField, string>> = {
    name: name.trim() ? undefined : m.enterName,
    email: /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email.trim()) ? undefined : m.enterValidEmail,
    password: score >= 3 ? undefined : m.choosePassword,
    phone: phone && tel.national && !tel.valid ? m.enterValidPhone : undefined,
    terms: accepted ? undefined : m.acceptTerms,
  };
  const shown = (field: SignUpField) => (touched[field] ? errors[field] : undefined);
  const touch = (field: SignUpField) => () => setTouched((t) => ({ ...t, [field]: true }));

  const submit = () => {
    const problems = SIGN_UP_FIELDS.flatMap((field) => (errors[field] ? [errors[field]!] : []));
    if (problems.length) {
      setTouched({ name: true, email: true, password: true, phone: true, terms: true });
      setSummary(problems);
      return;
    }
    setSummary([]);
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      password,
      ...(phone && tel.e164 ? { phone: tel.e164 } : {}),
    });
  };

  return (
    <AuthScreen
      logo={logo}
      title={title ?? m.signUp}
      description={description}
      error={error}
      footer={
        <>
          <Button size="lg" fullWidth loading={loading} onPress={submit}>
            {submitLabel ?? m.createAccount}
          </Button>
          {onSignIn && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: tokens.spacing[1],
              }}
            >
              <Text variant="body-md" color="on-surface-variant">
                {m.haveAccount}
              </Text>
              <Button variant="text" size="sm" onPress={onSignIn}>
                {m.signIn}
              </Button>
            </View>
          )}
        </>
      }
    >
      {social != null && (
        <>
          <View style={{ gap: tokens.spacing[2] }}>{social}</View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[3] }}>
            <Divider style={{ flex: 1 }} />
            <Text variant="label-md" color="on-surface-muted">
              {m.or}
            </Text>
            <Divider style={{ flex: 1 }} />
          </View>
        </>
      )}
      {summary.length > 0 && <Banner tone="danger">{summary.join('\n')}</Banner>}
      <TextField
        label={m.name}
        required
        value={name}
        onChangeText={setName}
        onBlur={touch('name')}
        error={shown('name')}
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
      />
      <TextField
        label={m.email}
        required
        value={email}
        onChangeText={setEmail}
        onBlur={touch('email')}
        error={shown('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="username"
        returnKeyType="next"
      />
      <View style={{ gap: tokens.spacing[2] }}>
        <PasswordInput
          label={m.password}
          required
          value={password}
          onChangeText={setPassword}
          onBlur={touch('password')}
          error={shown('password')}
          helperText={m.passwordHint}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        {/* The bar is decoration; the words under it are the signal, announced as they change. */}
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Progress value={password ? score / 4 : 0} segments={4} label={m.passwordStrength(strength)} />
        </View>
        <Text variant="label-md" color="on-surface-variant" accessibilityLiveRegion="polite">
          {password ? m.passwordStrength(strength) : ''}
        </Text>
      </View>
      {phone && (
        <PhoneInput
          label={m.phone}
          defaultCountry={defaultCountry}
          value={tel.e164}
          onValueChange={(e164, info) => setTel({ e164, national: info.national, valid: info.valid })}
          onBlur={touch('phone')}
          error={shown('phone')}
        />
      )}
      {/* Checkbox + its error, as CheckboxField draws them (that file stays out of this entry). */}
      <View style={{ gap: tokens.spacing[1] }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: tokens.spacing[3] }}>
          <Checkbox
            label={termsLabel}
            checked={accepted}
            onCheckedChange={(checked) => {
              setAccepted(checked);
              setTouched((t) => ({ ...t, terms: true }));
            }}
            invalid={shown('terms') ? true : undefined}
            accessibilityHint={shown('terms')}
            style={{ flex: 1 }}
          />
          {termsAction != null && (
            <View style={{ paddingVertical: tokens.spacing['2-5'] }}>{termsAction}</View>
          )}
        </View>
        {shown('terms') && (
          <Text variant="body-sm" color="error" accessibilityLiveRegion="polite">
            {shown('terms')}
          </Text>
        )}
      </View>
    </AuthScreen>
  );
}

// ─── VerifyCodeScreen ────────────────────────────────────────────────────────

export interface VerifyMethod {
  id: string;
  /** "Use an authenticator app", "Text me a code", "Use a recovery code". */
  label: string;
}

export interface VerifyCodeScreenProps {
  /** Where the code went, e.g. "+65 •••• 4821". */
  destination: string;
  /** Called as soon as every box is filled, and from the Continue button. */
  onComplete: (code: string) => void;
  /** Renders "Resend code" behind a cooldown. 12.5: optional, as web. */
  onResend?: () => void;
  /** Seconds before Resend is allowed again. @default 30 */
  resendAfter?: number;
  length?: number;
  error?: string;
  /** 12.5: renders "Use a different number" (rename it with `messages.changeDestination`). */
  onChangeDestination?: () => void;
  /** 12.5: other second factors, as a short list of buttons under the code. */
  methods?: VerifyMethod[];
  onMethodChange?: (id: string) => void;
  /** 12.5: when the code stops working: shows the time left. */
  expiresAt?: number | Date;
  /** 12.5: clock for the expiry countdown (tests, previews). @default Date.now */
  now?: () => number;
  /** 12.5: the code is being checked: the boxes are read-only and Continue shows progress. */
  loading?: boolean;
  /** 12.5: brand mark above the title. */
  logo?: React.ReactNode;
  /** 12.5: copy overrides. */
  title?: string;
  description?: string;
  /**
   * 12.5: adds a Continue button that submits the code, with this label. Without `onResend`
   * the button shows anyway, labelled `messages.continue`.
   */
  submitLabel?: string;
  /** 12.5: string overrides, keyed as web (`enterCode`, `codeSentTo`, `resendCode` …). */
  messages?: Partial<AuthScreenMessages>;
}

/** One-time code entry (SMS autofill ready) with a resend countdown. */
export function VerifyCodeScreen({
  destination,
  onComplete,
  onResend,
  resendAfter = 30,
  length = 6,
  error,
  onChangeDestination,
  methods,
  onMethodChange,
  expiresAt,
  now,
  loading,
  logo,
  title,
  description,
  submitLabel,
  messages,
}: VerifyCodeScreenProps) {
  const { tokens } = useTheme();
  const m = { ...defaultAuthScreenMessages, ...messages };
  const [code, setCode] = React.useState('');
  const [left, setLeft] = React.useState(resendAfter);
  React.useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const showContinue = submitLabel != null || !onResend;
  return (
    <AuthScreen
      logo={logo}
      title={title ?? m.enterCode}
      description={description ?? m.codeSentTo(length, destination)}
      footer={
        <>
          {showContinue && (
            <Button
              size="lg"
              fullWidth
              loading={loading}
              disabled={code.length !== length}
              onPress={() => onComplete(code)}
            >
              {submitLabel ?? m.continue}
            </Button>
          )}
          {onResend && (
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
              {left > 0 ? `${m.resendCodeIn} ${left}s` : m.resendCode}
            </Button>
          )}
        </>
      }
    >
      <OTPInput
        label={m.verificationCode}
        length={length}
        value={code}
        onValueChange={setCode}
        onComplete={onComplete}
        error={error}
        readOnly={loading}
        autoFocus
      />
      {expiresAt != null && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: tokens.spacing[2],
          }}
        >
          <Text variant="body-sm" color="on-surface-muted">
            {m.codeExpiresIn}
          </Text>
          <Countdown to={expiresAt} format="m:ss" variant="chip" tone="auto" now={now} />
        </View>
      )}
      {onChangeDestination && (
        <Button variant="text" onPress={onChangeDestination} style={{ alignSelf: 'center' }}>
          {m.changeDestination}
        </Button>
      )}
      {methods && methods.length > 0 && (
        <View style={{ alignItems: 'center', gap: tokens.spacing[1] }}>
          <Text variant="label-md" color="on-surface-variant" accessibilityRole="header">
            {m.otherMethods}
          </Text>
          {methods.map((method) => (
            <Button key={method.id} variant="text" onPress={() => onMethodChange?.(method.id)}>
              {method.label}
            </Button>
          ))}
        </View>
      )}
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
  // The xl lock icon with spacing[5] around it.
  const disc = tokens.size.icon.xl + 2 * tokens.spacing[5];
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
              width: disc,
              height: disc,
              borderRadius: disc / 2,
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
