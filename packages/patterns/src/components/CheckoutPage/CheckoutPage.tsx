import * as React from 'react';
import { Alert, Amount, Button, FormField, MoneyInput, Progress } from '@nexub/react';
import { CheckCircle2, ShieldCheck } from '@nexub/icons';
import { InfoList } from '../InfoList/index.js';
import {
  PageFrame,
  formatMoney,
  usePageMessages,
  useTemplateLocale,
  type PageFrameProps,
  type PageTemplateMessages,
  type Quote,
  type ReviewRow,
} from '../PageFrame/PageFrame.js';

export interface CheckoutPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  from: string;
  to: string;
  /** Available balance in `from`. */
  balance: number;
  /** Quote for an amount: fee, rate and arrival are shown before anything else. */
  quote: (amount: number) => Quote;
  /** Rows on the review step. Defaults to amount, fee, rate, recipient gets, arrives. */
  reviewRows?: (amount: number, quote: Quote) => ReviewRow[];
  /** "Confirm and send". */
  confirmLabel: string;
  /** Named second factor under the button: "You'll confirm with your passkey". */
  confirmHint?: string;
  /** Moves the money. A rejected promise shows its message and stays on review. */
  onConfirm: (amount: number) => void | Promise<void>;
  /** Result screen title. @default messages.sent */
  resultTitle?: string;
  resultDescription?: string;
  onDone: () => void;
  messages?: Partial<PageTemplateMessages>;
}

type Step = 'amount' | 'review' | 'done';

/**
 * Three-step pay flow: amount (live fee and rate) → review (every number,
 * one confirming action) → result. Web twin of the native `AmountStep`,
 * `ReviewStep` and `ResultScreen`.
 */
export const CheckoutPage = React.forwardRef<HTMLElement, CheckoutPageProps>(function CheckoutPage(
  {
    from,
    to,
    balance,
    quote,
    reviewRows,
    confirmLabel,
    confirmHint,
    onConfirm,
    resultTitle,
    resultDescription,
    onDone,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const locale = useTemplateLocale();
  const [step, setStep] = React.useState<Step>('amount');
  const [amount, setAmount] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  const fmt = (n: number, c: string) => formatMoney(n, c, locale);
  const over = amount != null && amount > balance;
  const q = amount && !over ? quote(amount) : undefined;
  const index = step === 'amount' ? 1 : step === 'review' ? 2 : 3;

  // Each step is a new view: move focus to its heading so screen readers follow.
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const rows: ReviewRow[] =
    amount && q
      ? reviewRows?.(amount, q) ?? [
          { label: m.amountToSend, value: fmt(amount, from) },
          { label: m.fee, value: fmt(q.fee, from) },
          { label: m.rate, value: `1 ${from} = ${q.rate} ${to}` },
          { label: m.recipientGets, value: fmt((amount - q.fee) * q.rate, to) },
          { label: m.arrives, value: q.arrives },
        ]
      : [];

  const confirm = async () => {
    if (!amount) return;
    setBusy(true);
    setError(undefined);
    try {
      await onConfirm(amount);
      setStep('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const title = step === 'amount' ? m.howMuch : step === 'review' ? m.checkDetails : resultTitle ?? m.sent;

  return (
    <PageFrame ref={ref} width="sm" {...props}>
      {step !== 'done' && (
        <div className="flex flex-col gap-2">
          <Progress value={index} max={3} aria-label={m.stepOf(index, 3)} />
          <p className="text-label-md text-[var(--color-on-surface-variant)]">{m.stepOf(index, 3)}</p>
        </div>
      )}

      {step === 'done' ? (
        <div role="status" className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-success-container)] text-[var(--color-success)]">
            <CheckCircle2 size={40} aria-hidden="true" />
          </span>
          <h1 ref={headingRef} tabIndex={-1} className="text-headline-sm text-[var(--color-on-surface)] outline-none">
            {title}
          </h1>
          {amount != null && <Amount value={amount} currency={from} locale={locale} size="display" />}
          {resultDescription && <p className="text-body-md text-[var(--color-on-surface-muted)]">{resultDescription}</p>}
          <Button size="lg" fullWidth onClick={onDone}>
            {m.done}
          </Button>
        </div>
      ) : (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="text-headline-sm text-[var(--color-on-surface)] outline-none">
            {title}
          </h1>

          {step === 'amount' && (
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (amount && !over) setStep('review');
              }}
            >
              <FormField.Root invalid={over}>
                <FormField.Label>{m.amountToSend}</FormField.Label>
                <FormField.Control>
                  <MoneyInput currency={from} locale={locale} value={amount} onValueChange={setAmount} />
                </FormField.Control>
                {over ? (
                  <FormField.Error>{m.overBalance(fmt(balance, from))}</FormField.Error>
                ) : (
                  <FormField.Description>{m.balance(fmt(balance, from))}</FormField.Description>
                )}
              </FormField.Root>
              {q && amount && (
                <div aria-live="polite" className="rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] px-4">
                  <InfoList.Root>
                    <InfoList.Item label={m.fee} value={fmt(q.fee, from)} />
                    <InfoList.Item label={m.rate} value={`1 ${from} = ${q.rate} ${to}`} />
                    <InfoList.Item label={m.recipientGets} value={fmt((amount - q.fee) * q.rate, to)} />
                    <InfoList.Item label={m.arrives} value={q.arrives} />
                  </InfoList.Root>
                </div>
              )}
              <Button type="submit" size="lg" fullWidth disabled={!amount || over}>
                {m.continue}
              </Button>
            </form>
          )}

          {step === 'review' && (
            <div className="flex flex-col gap-6">
              {error && (
                <Alert tone="danger" role="alert">
                  {error}
                </Alert>
              )}
              <div className="rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] px-4">
                <InfoList.Root>
                  {rows.map((r) => (
                    <InfoList.Item key={r.label} label={r.label} value={r.value} />
                  ))}
                </InfoList.Root>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  fullWidth
                  loading={busy}
                  leadingIcon={confirmHint ? <ShieldCheck size="sm" aria-hidden="true" /> : undefined}
                  onClick={confirm}
                >
                  {confirmLabel}
                </Button>
                {confirmHint && <p className="text-center text-body-sm text-[var(--color-on-surface-muted)]">{confirmHint}</p>}
                <Button variant="ghost" size="lg" fullWidth disabled={busy} onClick={() => setStep('amount')}>
                  {m.edit}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </PageFrame>
  );
});
