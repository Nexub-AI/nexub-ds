import * as React from 'react';
import { Alert, Button, Checkbox, Form, FormField, Input, PasswordInput, PhoneInput, Progress, useForm, type FormErrorItem, type PhoneInputProps } from '@nexub/react';
import { AuthCard } from '../AuthCard/index.js';
import { ErrorSummary, type ErrorSummaryItem } from '../ErrorSummary/index.js';
import { usePageMessages, type PageTemplateMessages } from '../PageFrame/PageFrame.js';

export interface SignUpValues {
  name: string;
  email: string;
  password: string;
  /** E.164, only with `phone` and when a number was entered. */
  phone?: string;
}

export type PasswordRule = (password: string) => boolean;

/** 8+ characters, mixed case, a digit or symbol, 12+ characters. Three of four is "good" and accepted. */
export const defaultPasswordRules: PasswordRule[] = [
  (p) => p.length >= 8,
  (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  (p) => /[\d\W_]/.test(p),
  (p) => p.length >= 12,
];

export interface SignUpPageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSubmit' | 'title'> {
  onSubmit: (values: SignUpValues) => void | Promise<unknown>;
  /** The terms checkbox label, e.g. "I agree to the Terms and Privacy Policy" with links. */
  termsLabel: React.ReactNode;
  /** Adds an optional phone number field. */
  phone?: boolean;
  /** Country the phone field starts on (ISO 3166-1 alpha-2). */
  defaultCountry?: PhoneInputProps['defaultCountry'];
  /** Renders the "Already have an account? Sign in" footer. */
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
  /** Landmark element. @default 'main' */
  as?: 'main' | 'div';
  messages?: Partial<PageTemplateMessages>;
}

type Field = 'name' | 'email' | 'password' | 'phone' | 'terms';
const FIELDS: Field[] = ['name', 'email', 'password', 'phone', 'terms'];

function Submit({ loading, children }: { loading?: boolean; children: React.ReactNode }) {
  const form = useForm();
  return (
    <Button type="submit" size="lg" fullWidth loading={loading || form?.submitting}>
      {children}
    </Button>
  );
}

/**
 * Account creation: name, email, a password with a strength meter that is also
 * said in words, an optional phone number and the terms. Fields are checked when
 * they lose focus and on submit; a failed submit lists every problem at the top.
 */
export const SignUpPage = React.forwardRef<HTMLElement, SignUpPageProps>(function SignUpPage(
  {
    onSubmit,
    termsLabel,
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
    as: Tag = 'main',
    messages,
    className,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const uid = React.useId();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [tel, setTel] = React.useState({ e164: '', national: '', valid: false });
  const [accepted, setAccepted] = React.useState(false);
  const [touched, setTouched] = React.useState<Partial<Record<Field, boolean>>>({});
  const [summary, setSummary] = React.useState<ErrorSummaryItem[]>([]);

  const passed = passwordRules.filter((rule) => rule(password)).length;
  const score = passwordRules.length ? Math.round((passed / passwordRules.length) * 4) : 4;
  const strength = m.strengthLabels[Math.max(score, 1) - 1] ?? '';

  const errors: Partial<Record<Field, string>> = {
    name: name.trim() ? undefined : m.enterName,
    email: /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email.trim()) ? undefined : m.enterValidEmail,
    password: score >= 3 ? undefined : m.choosePassword,
    phone: phone && tel.national && !tel.valid ? m.enterValidPhone : undefined,
    terms: accepted ? undefined : m.acceptTerms,
  };
  const shown = (field: Field) => (touched[field] ? errors[field] : undefined);
  const touch = (field: Field) => () => setTouched((t) => ({ ...t, [field]: true }));
  const root = (field: Field) => ({ id: `${uid}-${field}`, name: field, invalid: shown(field) ? true : undefined });

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      className={['@container flex min-h-full w-full items-start justify-center px-4 py-10', className].filter(Boolean).join(' ')}
      {...props}
    >
      <AuthCard
        className="@sm:my-auto"
        logo={logo}
        title={title ?? m.signUp}
        description={description}
        footer={
          onSignIn && (
            <p>
              {m.haveAccount}{' '}
              <Button variant="link" onClick={onSignIn}>
                {m.signIn}
              </Button>
            </p>
          )
        }
      >
        {social && (
          <>
            <div className="flex flex-col gap-2">{social}</div>
            <div className="flex items-center gap-3 text-label-md text-[var(--color-on-surface-muted)]">
              <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-outline-variant)]" />
              {m.or}
              <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-outline-variant)]" />
            </div>
          </>
        )}
        <Form
          className="gap-4"
          validate={() => errors}
          onInvalidSubmit={(items: FormErrorItem[]) => {
            setTouched({ name: true, email: true, password: true, phone: true, terms: true });
            // Field order; the links point at the fields' own ids.
            setSummary(
              FIELDS.flatMap((field) => {
                const item = items.find((i) => i.name === field);
                return item ? [{ id: `${uid}-${field}`, message: item.message }] : [];
              }),
            );
          }}
          onSubmit={() => {
            setSummary([]);
            return onSubmit({
              name: name.trim(),
              email: email.trim(),
              password,
              ...(phone && tel.e164 ? { phone: tel.e164 } : {}),
            });
          }}
        >
          <ErrorSummary errors={summary} />
          {error && (
            <Alert tone="danger" role="alert">
              {error}
            </Alert>
          )}
          {/* `required={false}` on the controls: required is said (aria-required, the label mark) but
              checked here, so every message comes from `messages`, on blur and on submit alike. */}
          <FormField.Root required {...root('name')}>
            <FormField.Label>{m.name}</FormField.Label>
            <FormField.Control>
              <Input required={false} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={touch('name')} />
            </FormField.Control>
            <FormField.Error>{shown('name')}</FormField.Error>
          </FormField.Root>
          <FormField.Root required {...root('email')}>
            <FormField.Label>{m.email}</FormField.Label>
            <FormField.Control>
              <Input
                required={false}
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={touch('email')}
              />
            </FormField.Control>
            <FormField.Error>{shown('email')}</FormField.Error>
          </FormField.Root>
          <FormField.Root required {...root('password')}>
            <FormField.Label>{m.password}</FormField.Label>
            <FormField.Control>
              <PasswordInput
                required={false}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={touch('password')}
              />
            </FormField.Control>
            {/* The bar is decoration; the words under it are the signal, announced as they change. */}
            <Progress aria-hidden="true" value={password ? score : 0} max={4} segments={4} size="sm" />
            <p aria-live="polite" className="min-h-5 text-label-md text-[var(--color-on-surface-variant)]">
              {password ? m.passwordStrength(strength) : ''}
            </p>
            <FormField.Description>{m.passwordHint}</FormField.Description>
            <FormField.Error>{shown('password')}</FormField.Error>
          </FormField.Root>
          {phone && (
            <FormField.Root {...root('phone')}>
              <FormField.Label>{m.phone}</FormField.Label>
              <FormField.Control>
                <PhoneInput
                  defaultCountry={defaultCountry}
                  value={tel.e164}
                  onValueChange={(e164, info) => setTel({ e164, national: info.national, valid: info.valid })}
                  onBlur={touch('phone')}
                  sheet="auto"
                />
              </FormField.Control>
              <FormField.Error>{shown('phone')}</FormField.Error>
            </FormField.Root>
          )}
          <FormField.Root required {...root('terms')}>
            <div className="flex items-start gap-3">
              <FormField.Control>
                <Checkbox
                  required={false}
                  className="mt-0.5"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked === true)}
                  onBlur={touch('terms')}
                />
              </FormField.Control>
              <FormField.Label className="font-normal">{termsLabel}</FormField.Label>
            </div>
            <FormField.Error>{shown('terms')}</FormField.Error>
          </FormField.Root>
          <Submit loading={loading}>{submitLabel ?? m.createAccount}</Submit>
        </Form>
      </AuthCard>
    </Tag>
  );
});
