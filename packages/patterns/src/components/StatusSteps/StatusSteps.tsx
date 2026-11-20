import * as React from 'react';
import { cn, useNexubMessages } from '@nexub/react';
import { AlertCircle, Check } from '@nexub/icons';

export type StatusStepStatus = 'done' | 'current' | 'upcoming' | 'error';

export interface StatusStep {
  /** Stable key. @default the step's position */
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  status: StatusStepStatus;
  /** When it happened, e.g. a `<time>` element. */
  timestamp?: React.ReactNode;
  /** A link or small button for this step, e.g. "Upload again". */
  action?: React.ReactNode;
}

export type StatusStepsProps = Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children'> & {
  steps: StatusStep[];
  /** @default 'md' */
  size?: 'sm' | 'md';
} & ({ 'aria-label': string } | { 'aria-labelledby': string });

const markers: Record<StatusStepStatus, string> = {
  done: 'bg-[var(--color-primary)] text-[var(--color-on-primary)]',
  current: 'border-2 border-[var(--color-primary)] bg-[var(--color-surface)]',
  upcoming: 'border-2 border-[var(--color-outline-variant)] bg-[var(--color-surface)]',
  error: 'bg-[var(--color-error)] text-[var(--color-on-error)]',
};

/**
 * Where something stands, as a read-only list of steps (10.7): an application
 * under review, an order on its way. Each step says its status in text for
 * screen readers, so the marker is never the only signal. For a form the user
 * moves through, use `Stepper`.
 */
export const StatusSteps = React.forwardRef<HTMLOListElement, StatusStepsProps>(
  ({ steps, size = 'md', className, ...props }, ref) => {
    const t = useNexubMessages();
    const statusText: Record<StatusStepStatus, string> = {
      done: t.stepCompleted,
      current: t.stepCurrent,
      upcoming: t.stepUpcoming,
      error: t.stepProblem,
    };
    const sm = size === 'sm';
    return (
      <ol ref={ref} data-nx="status-steps" className={cn('m-0 flex list-none flex-col p-0', className)} {...props}>
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={step.id ?? i}
              data-status={step.status}
              aria-current={step.status === 'current' ? 'step' : undefined}
              className={cn('flex', sm ? 'gap-2' : 'gap-3')}
            >
              <span aria-hidden="true" className="flex shrink-0 flex-col items-center">
                <span className={cn('grid place-items-center rounded-full', sm ? 'size-5' : 'size-6', markers[step.status])}>
                  {step.status === 'done' && <Check size="xs" />}
                  {step.status === 'error' && <AlertCircle size="xs" />}
                  {step.status === 'current' && <span className="size-2 rounded-full bg-[var(--color-primary)]" />}
                </span>
                {/* The line to the next step: solid once this step is done, muted after. */}
                {!last && (
                  <span
                    className={cn(
                      'my-1 w-px flex-1',
                      step.status === 'done' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-outline-variant)]',
                    )}
                  />
                )}
              </span>
              <div className={cn('flex min-w-0 flex-1 flex-col gap-0.5', !last && (sm ? 'pb-4' : 'pb-6'))}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span
                    className={cn(
                      sm ? 'text-label-md' : 'text-label-lg',
                      'font-medium',
                      step.status === 'error'
                        ? 'text-[var(--color-error)]'
                        : step.status === 'upcoming'
                          ? 'text-[var(--color-on-surface-muted)]'
                          : 'text-[var(--color-on-surface)]',
                    )}
                  >
                    <span className="sr-only">{statusText[step.status]}: </span>
                    {step.title}
                  </span>
                  {step.timestamp != null && (
                    <span className="text-body-sm tabular-nums text-[var(--color-on-surface-muted)]">{step.timestamp}</span>
                  )}
                </div>
                {step.description != null && (
                  <div className="text-body-sm text-[var(--color-on-surface-variant)]">{step.description}</div>
                )}
                {step.action != null && <div className="mt-1">{step.action}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);
StatusSteps.displayName = 'StatusSteps';
