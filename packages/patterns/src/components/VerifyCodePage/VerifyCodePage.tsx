import * as React from 'react';
import { Alert, Button, Countdown, OTPInput } from '@nexub/react';
import { AuthCard } from '../AuthCard/index.js';
import { usePageMessages, type PageTemplateMessages } from '../PageFrame/PageFrame.js';
import { Resend } from './Resend.js';

export interface VerifyMethod {
  id: string;
  /** "Use an authenticator app", "Text me a code", "Use a recovery code". */
  label: string;
}

export interface VerifyCodePageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Where the code went, already masked: "+65 •••• 4821", "m•••@example.com". */
  destination: string;
  /** @default 6 */
  length?: number;
  /** Called as soon as every box is filled, and from the Continue button. */
  onComplete: (code: string) => void | Promise<unknown>;
  /** Renders "Resend code" behind a cooldown. */
  onResend?: () => void | Promise<unknown>;
  /** Seconds before Resend is allowed again. @default 30 */
  resendAfter?: number;
  /** Renders "Use a different number" (rename it with `messages.changeDestination`). */
  onChangeDestination?: () => void;
  /** Other second factors, as a short list of links. */
  methods?: VerifyMethod[];
  onMethodChange?: (id: string) => void;
  /** When the code stops working: shows the time left. */
  expiresAt?: number | Date;
  /** Clock for the countdowns (tests, stories). @default Date.now */
  now?: () => number;
  /** The code is being checked: the boxes are read-only and Continue shows progress. */
  loading?: boolean;
  /** Error from the last attempt (announced). Clears the boxes and returns focus to the first. */
  error?: string;
  logo?: React.ReactNode;
  title?: string;
  description?: string;
  submitLabel?: string;
  /** Landmark element. @default 'main' */
  as?: 'main' | 'div';
  messages?: Partial<PageTemplateMessages>;
}

/**
 * One-time code entry for sign-in, sign-up or a second factor: boxes that take
 * the OS code suggestion, a resend cooldown and other ways to verify. Web twin
 * of the native `VerifyCodeScreen`.
 */
export const VerifyCodePage = React.forwardRef<HTMLElement, VerifyCodePageProps>(function VerifyCodePage(
  {
    destination,
    length = 6,
    onComplete,
    onResend,
    resendAfter = 30,
    onChangeDestination,
    methods,
    onMethodChange,
    expiresAt,
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
  const [code, setCode] = React.useState('');
  const boxes = React.useRef<HTMLDivElement>(null);

  // A wrong code: start over from the first box.
  React.useEffect(() => {
    if (!error) return;
    setCode('');
    boxes.current?.querySelector('input')?.focus();
  }, [error]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      className={['@container flex min-h-full w-full items-start justify-center px-4 py-10', className].filter(Boolean).join(' ')}
      {...props}
    >
      <AuthCard
        className="@sm:my-auto"
        logo={logo}
        title={title ?? m.enterCode}
        description={description ?? m.codeSentTo(length, destination)}
        footer={
          (onResend || onChangeDestination || methods?.length) && (
            <>
              {onResend && (
                <Resend label={m.resendCode} waitLabel={m.resendCodeIn} after={resendAfter} now={now} onResend={onResend} />
              )}
              {onChangeDestination && (
                <Button variant="link" onClick={onChangeDestination}>
                  {m.changeDestination}
                </Button>
              )}
              {methods && methods.length > 0 && (
                <nav aria-label={m.otherMethods} className="flex flex-col items-center gap-1 pt-2">
                  <p className="text-label-md text-[var(--color-on-surface-variant)]">{m.otherMethods}</p>
                  <ul className="m-0 flex list-none flex-col items-center gap-1 p-0">
                    {methods.map((method) => (
                      <li key={method.id}>
                        <Button variant="link" onClick={() => onMethodChange?.(method.id)}>
                          {method.label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )
        }
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.length === length) void onComplete(code);
          }}
        >
          {error && (
            <Alert tone="danger" role="alert">
              {error}
            </Alert>
          )}
          <div ref={boxes} className="flex justify-center">
            {/* Narrower boxes until the page has room, so six fit a 320px phone. */}
            <OTPInput
              className="[--otp-w:2rem] @sm:[--otp-w:2.5rem]"
              length={length}
              value={code}
              onValueChange={setCode}
              onComplete={(value) => void onComplete(value)}
              invalid={Boolean(error)}
              readOnly={loading}
            />
          </div>
          {expiresAt != null && (
            <p className="flex flex-wrap items-center justify-center gap-2 text-body-sm text-[var(--color-on-surface-muted)]">
              {m.codeExpiresIn}
              <Countdown to={expiresAt} format="m:ss" variant="chip" tone="auto" now={now} />
            </p>
          )}
          <Button type="submit" size="lg" fullWidth loading={loading} disabled={code.length !== length}>
            {submitLabel ?? m.continue}
          </Button>
        </form>
      </AuthCard>
    </Tag>
  );
});
