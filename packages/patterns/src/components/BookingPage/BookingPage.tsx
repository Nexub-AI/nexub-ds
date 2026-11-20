import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  Countdown,
  DatePicker,
  DescriptionList,
  Form,
  Progress,
  SkeletonPreset,
  SuccessCheck,
  TimeSlotPicker,
  cn,
  useControllableState,
} from '@nexub/react';
import {
  PageFrame,
  usePageMessages,
  useTemplateLocale,
  type PageFrameProps,
  type PageTemplateMessages,
} from '../PageFrame/PageFrame.js';

/** One bookable time: the shape TimeSlotPicker takes. */
export interface BookingSlot {
  value: string;
  label?: string;
  disabled?: boolean;
  hint?: string;
}

export interface BookingPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  /** @default messages.bookTitle */
  title?: React.ReactNode;
  /** What is being booked: shown in the summary. */
  service?: { title: React.ReactNode; duration?: React.ReactNode; price?: React.ReactNode; description?: React.ReactNode };
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  isDateDisabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  /** The times for the chosen date. Your app loads them when the date changes. */
  slots: BookingSlot[];
  slotsLoading?: boolean;
  /** Shown in place of the times, e.g. an ErrorState with Retry. */
  slotsError?: React.ReactNode;
  /** The chosen slot's `value`. */
  slot?: string;
  defaultSlot?: string;
  onSlotChange?: (slot: string | undefined) => void;
  /** Extra fields on the confirm step (name, notes). They sit in the form that `onConfirm` receives. */
  details?: React.ReactNode;
  /** Makes the booking. A rejected promise shows its message and stays on the confirm step. */
  onConfirm: (booking: { date: Date; slot: string; formData: FormData }) => void | Promise<unknown>;
  /** Until when the chosen time is held: shows a countdown; past it the confirm button is disabled. */
  holdUntil?: number | Date;
  onHoldExpire?: () => void;
  /** Shows the confirmed view straight away (a deep link, a reload after booking). */
  confirmed?: boolean;
  confirmation?: { title?: React.ReactNode; description?: React.ReactNode; reference?: string; actions?: React.ReactNode };
  /** The clock the hold countdown reads. Pass a fixed one in tests and screenshots. */
  now?: () => number;
  messages?: Partial<PageTemplateMessages>;
}

/**
 * Booking in three steps (date → time → confirm) and a confirmed view. With room
 * (a 60rem container) the three sit side by side; narrower, one step shows at a time
 * with Back / Continue. The switch is CSS only, so server and client render the same.
 */
export const BookingPage = React.forwardRef<HTMLElement, BookingPageProps>(function BookingPage(
  {
    title,
    service,
    date: dateProp,
    defaultDate,
    onDateChange,
    isDateDisabled,
    minDate,
    maxDate,
    slots,
    slotsLoading,
    slotsError,
    slot: slotProp,
    defaultSlot,
    onSlotChange,
    details,
    onConfirm,
    holdUntil,
    onHoldExpire,
    confirmed,
    confirmation,
    now,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const locale = useTemplateLocale();
  const [date, setDate] = useControllableState<Date | undefined>({ value: dateProp, defaultValue: defaultDate, onChange: onDateChange });
  const [slot, setSlot] = useControllableState<string | undefined>({ value: slotProp, defaultValue: defaultSlot, onChange: onSlotChange });
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [doneState, setDone] = React.useState(false);
  // Keyed by the deadline, so a new hold starts fresh.
  const [expiredFor, setExpiredFor] = React.useState<number>();
  const deadline = holdUntil == null ? undefined : +holdUntil;
  const expired = deadline != null && expiredFor === deadline;
  const done = confirmed ?? doneState;
  const id = React.useId();
  const headings = React.useRef<Record<string, HTMLHeadingElement | null>>({});

  // Each step is a new view on a phone: move focus to its heading (not on first render).
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headings.current[done ? 'done' : step]?.focus();
  }, [step, done]);

  const chosen = slots.find((s) => s.value === slot);
  const slotLabel = slot == null ? undefined : (chosen?.label ?? slot);
  const dateLabel = date && new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date);

  const confirm = async (formData: FormData) => {
    if (!date || slot == null || expired) return;
    setBusy(true);
    setError(undefined);
    try {
      await onConfirm({ date, slot, formData });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const summary = (
    <DescriptionList.Root divided>
      {service && (
        <DescriptionList.Item label={service.title} helpText={service.duration}>
          {service.price}
        </DescriptionList.Item>
      )}
      <DescriptionList.Item label={m.date}>{dateLabel ?? '–'}</DescriptionList.Item>
      <DescriptionList.Item label={m.time}>{slotLabel ?? '–'}</DescriptionList.Item>
      {done && confirmation?.reference && <DescriptionList.Item label={m.reference}>{confirmation.reference}</DescriptionList.Item>}
    </DescriptionList.Root>
  );

  if (done)
    return (
      <PageFrame ref={ref} width="sm" {...props}>
        <div role="status" className="flex flex-col items-center gap-4 py-8 text-center">
          <SuccessCheck size="lg" />
          <h1
            ref={(el) => {
              headings.current.done = el;
            }}
            tabIndex={-1}
            className="text-headline-sm text-[var(--color-on-surface)] outline-none"
          >
            {confirmation?.title ?? m.bookingConfirmed}
          </h1>
          {confirmation?.description && <p className="text-body-md text-[var(--color-on-surface-muted)]">{confirmation.description}</p>}
        </div>
        <Card className="px-4 py-2 text-start">{summary}</Card>
        {confirmation?.actions && <div className="flex flex-col gap-2 @xl:flex-row @xl:justify-center">{confirmation.actions}</div>}
      </PageFrame>
    );

  const panel = (n: 1 | 2 | 3, heading: string, body: React.ReactNode, className?: string) => (
    <section aria-labelledby={`${id}-${n}`} className={cn('min-w-0 flex-col gap-3', step === n ? 'flex' : 'hidden @[60rem]:flex', className)}>
      <h2
        id={`${id}-${n}`}
        ref={(el) => {
          headings.current[n] = el;
        }}
        tabIndex={-1}
        className="text-title-md text-[var(--color-on-surface)] outline-none"
      >
        {heading}
      </h2>
      {body}
    </section>
  );

  return (
    <PageFrame ref={ref} width="lg" title={title ?? m.bookTitle} {...props}>
      <div className="flex flex-col gap-2 @[60rem]:hidden">
        <Progress value={step} max={3} aria-label={m.stepOf(step, 3)} />
        <p className="text-label-md text-[var(--color-on-surface-variant)]">{m.stepOf(step, 3)}</p>
      </div>

      <div className="grid gap-6 @[60rem]:grid-cols-3">
        {panel(
          1,
          m.pickDate,
          <>
            {service?.description && <p className="text-body-sm text-[var(--color-on-surface-muted)]">{service.description}</p>}
            <DatePicker
              aria-label={m.pickDate}
              value={date}
              onValueChange={(d) => {
                setDate(d);
                // The times belong to the old date.
                if (slot != null) setSlot(undefined);
              }}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={isDateDisabled}
              sheet="auto"
            />
          </>,
        )}

        {panel(
          2,
          m.pickTime,
          !date ? (
            <p className="text-body-md text-[var(--color-on-surface-muted)]">{m.pickDateFirst}</p>
          ) : slotsError != null ? (
            slotsError
          ) : slotsLoading ? (
            <div aria-busy="true">
              <SkeletonPreset preset="listRow" count={3} />
            </div>
          ) : (
            <TimeSlotPicker
              aria-label={m.pickTime}
              slots={slots}
              // '' keeps the group controlled while nothing is chosen.
              value={slot ?? ''}
              onValueChange={(v: string) => setSlot(v)}
              groupBy="period"
              columns="auto"
              emptyState={<p className="text-body-md text-[var(--color-on-surface-muted)]">{m.noTimes}</p>}
            />
          ),
        )}

        {panel(
          3,
          m.yourBooking,
          <>
            <Card className="px-4 py-2">{summary}</Card>
            {deadline != null && !expired && slot != null && (
              <p className="flex flex-wrap items-center gap-2 text-body-sm text-[var(--color-on-surface-muted)]">
                {m.heldFor}
                <Countdown
                  to={deadline}
                  format="m:ss"
                  variant="chip"
                  tone="auto"
                  now={now}
                  onExpire={() => {
                    setExpiredFor(deadline);
                    onHoldExpire?.();
                  }}
                />
              </p>
            )}
            {expired && (
              <Alert
                tone="warning"
                role="alert"
                action={
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => {
                      setSlot(undefined);
                      setStep(2);
                    }}
                  >
                    {m.pickAnotherTime}
                  </Button>
                }
              >
                {m.holdExpired}
              </Alert>
            )}
            <Form onSubmit={confirm}>
              {details}
              {error && (
                <Alert tone="danger" role="alert">
                  {error}
                </Alert>
              )}
              <Button type="submit" size="lg" fullWidth loading={busy} disabled={!date || slot == null || expired}>
                {m.confirmBooking}
              </Button>
            </Form>
          </>,
        )}
      </div>

      <div className="flex justify-between gap-2 @[60rem]:hidden">
        {step > 1 ? (
          <Button variant="text" disabled={busy} onClick={() => setStep((step - 1) as 1 | 2)}>
            {m.back}
          </Button>
        ) : (
          <span />
        )}
        {step < 3 && (
          <Button disabled={step === 1 ? !date : slot == null} onClick={() => setStep((step + 1) as 2 | 3)}>
            {m.continue}
          </Button>
        )}
      </div>
    </PageFrame>
  );
});
