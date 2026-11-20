import * as React from 'react';
import { Alert, Button, Form, FormField, Input, useForm } from '@nexub/react';
import { Mail } from '@nexub/icons';
import { AuthCard } from '../AuthCard/index.js';
import { usePageMessages, type PageTemplateMessages } from '../PageFrame/PageFrame.js';
import { Resend } from '../VerifyCodePage/Resend.js';

export interface ForgotPasswordPageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSubmit' | 'title'> {
  /** Sends the reset link. When it resolves the page shows "Check your email"; a rejection stays on the form (say why in `error`). */
  onSubmit: (email: string) => void | Promise<unknown>;
  /** Show the confirmation. Leave unset to let the page switch after `onSubmit` resolves. */
  sent?: boolean;
  /** Prefills the email, e.g. from the sign-in form. */
  defaultEmail?: string;
  /** Renders "Resend email" on the confirmation, behind a cooldown. */
  onResend?: (email: string) => void | Promise<unknown>;
  /** Seconds before Resend is allowed again. @default 30 */
  resendAfter?: number;
  onBackToSignIn?: () => void;
  /** Clock for the cooldown (tests, stories). @default Date.now */
  now?: () => number;
  loading?: boolean;
  /** Error from the last attempt (announced). */
  error?: string;
  logo?: React.ReactNode;
  title?: string;
  description?: string;
  submitLabel?: string;
  /** Landmark element. @default 'main' */
  as?: 'main' | 'div';
  messages?: Partial<PageTemplateMessages>;
}

function Submit({ loading, children }: { loading?: boolean; children: React.ReactNode }) {
  const form = useForm();
  return (
    <Button type="submit" size="lg" fullWidth loading={loading || form?.submitting}>
      {children}
    </Button>
  );
}

/**
 * Password recovery in one page: ask for the email, then confirm. The
 * confirmation never says whether the account exists ("If an account exists for …").
 */
export const ForgotPasswordPage = React.forwardRef<HTMLElement, ForgotPasswordPageProps>(function ForgotPasswordPage(
  {
    onSubmit,
    sent: sentProp,
    defaultEmail = '',
    onResend,
    resendAfter = 30,
    onBackToSignIn,
    now,
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
  const [email, setEmail] = React.useState(defaultEmail);
  const [sentState, setSentState] = React.useState(false);
  const sent = sentProp ?? sentState;
  const back = onBackToSignIn && (
    <Button variant="link" onClick={onBackToSignIn}>
      {m.backToSignIn}
    </Button>
  );

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      className={['@container flex min-h-full w-full items-start justify-center px-4 py-10', className].filter(Boolean).join(' ')}
      {...props}
    >
      {sent ? (
        <AuthCard
          className="@sm:my-auto"
          logo={logo}
          title={m.checkEmail}
          footer={
            (onResend || back) && (
              <>
                {onResend && (
                  <Resend
                    label={m.resendEmail}
                    waitLabel={m.resendEmailIn}
                    after={resendAfter}
                    now={now}
                    onResend={() => onResend(email.trim())}
                  />
                )}
                {back}
              </>
            )
          }
        >
          {error && (
            <Alert tone="danger" role="alert">
              {error}
            </Alert>
          )}
          <div role="status" className="flex flex-col items-center gap-3 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]">
              <Mail size="md" aria-hidden="true" />
            </span>
            <p className="break-words text-body-md text-[var(--color-on-surface)]">{m.resetSent(email.trim())}</p>
          </div>
        </AuthCard>
      ) : (
        <AuthCard
          className="@sm:my-auto"
          logo={logo}
          title={title ?? m.resetPassword}
          description={description ?? m.resetDescription}
          footer={back}
        >
          <Form
            className="gap-4"
            validate={() => ({ email: /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email.trim()) ? undefined : m.enterValidEmail })}
            onSubmit={async () => {
              try {
                await onSubmit(email.trim());
                setSentState(true);
              } catch {
                // Stays on the form; the app says why through `error`.
              }
            }}
          >
            {error && (
              <Alert tone="danger" role="alert">
                {error}
              </Alert>
            )}
            <FormField.Root required name="email">
              <FormField.Label>{m.email}</FormField.Label>
              <FormField.Control>
                {/* Checked here, not by the browser, so the message comes from `messages`. */}
                <Input
                  required={false}
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormField.Control>
              <FormField.Error />
            </FormField.Root>
            <Submit loading={loading}>{submitLabel ?? m.sendResetLink}</Submit>
          </Form>
        </AuthCard>
      )}
    </Tag>
  );
});
