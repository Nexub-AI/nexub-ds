import * as React from 'react';
import { Alert, Button, FormField, Input, PasswordInput } from '@nexub/react';
import { ShieldCheck } from '@nexub/icons';
import { AuthCard } from '../AuthCard/index.js';
import { usePageMessages, type PageTemplateMessages } from '../PageFrame/PageFrame.js';

export interface SignInPageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSubmit' | 'title'> {
  onSubmit: (email: string, password: string) => void;
  /** Passkey/biometric sign-in, named: "Sign in with a passkey". */
  biometricLabel?: string;
  onBiometric?: () => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
  loading?: boolean;
  /** Error from the last attempt (announced). */
  error?: string;
  logo?: React.ReactNode;
  /** Copy overrides. */
  title?: string;
  description?: string;
  submitLabel?: string;
  /** Landmark element. @default 'main' */
  as?: 'main' | 'div';
  messages?: Partial<PageTemplateMessages>;
}

/**
 * Email + password sign-in with browser autofill (`username`,
 * `current-password`, `webauthn`) and an optional passkey path. Web twin of
 * the native `SignInScreen`.
 */
export const SignInPage = React.forwardRef<HTMLElement, SignInPageProps>(function SignInPage(
  {
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
    as: Tag = 'main',
    messages,
    className,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      className={['flex min-h-full w-full items-start justify-center px-4 py-10 sm:items-center', className].filter(Boolean).join(' ')}
      {...props}
    >
      <AuthCard
        logo={logo}
        title={title ?? m.signIn}
        description={description}
        footer={
          onCreateAccount && (
            <Button variant="link" onClick={onCreateAccount}>
              {m.createAccount}
            </Button>
          )
        }
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (email && password) onSubmit(email, password);
          }}
        >
          {error && (
            <Alert tone="danger" role="alert">
              {error}
            </Alert>
          )}
          <FormField.Root required>
            <FormField.Label>{m.email}</FormField.Label>
            <FormField.Control>
              <Input
                type="email"
                autoComplete="username webauthn"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField.Control>
          </FormField.Root>
          <FormField.Root required>
            <div className="flex items-center justify-between gap-2">
              <FormField.Label>{m.password}</FormField.Label>
              {onForgotPassword && (
                <Button type="button" variant="link" size="xs" onClick={onForgotPassword}>
                  {m.forgotPassword}
                </Button>
              )}
            </div>
            <FormField.Control>
              <PasswordInput autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormField.Control>
          </FormField.Root>
          <Button type="submit" size="lg" fullWidth loading={loading} disabled={!email || !password}>
            {submitLabel ?? m.signIn}
          </Button>
          {onBiometric && biometricLabel && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              leadingIcon={<ShieldCheck size="sm" aria-hidden="true" />}
              onClick={onBiometric}
            >
              {biometricLabel}
            </Button>
          )}
        </form>
      </AuthCard>
    </Tag>
  );
});
