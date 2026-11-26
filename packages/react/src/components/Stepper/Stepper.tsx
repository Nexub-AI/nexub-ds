'use client';

import * as React from 'react';
import { AlertCircle, AlertTriangle, Check, Minus, X } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

/**
 * 11.4: a step's state, named as in StatusSteps. `complete` is a finished step; `error`,
 * `warning`, `skipped` and `cancelled` say how a step ended or why it is stuck.
 */
export type StepperStatus = 'complete' | 'current' | 'upcoming' | 'error' | 'warning' | 'skipped' | 'cancelled';

export interface StepperStep {
  /** Stable key. @default the label */
  id?: string;
  label: string;
  /** A line under the label. 11.4: any content (a date, a link, a badge). */
  description?: React.ReactNode;
  /** 11.4: this step's state. Wins over `current` and `completed` for this step. */
  status?: StepperStatus;
  /** 11.4: actions under the step, e.g. "Retry" on a failed step. */
  actions?: React.ReactNode;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  steps: StepperStep[];
  /**
   * Index of the step being shown, from 0. For "every step done", give the steps
   * `status: 'complete'` (12.0 removed `current={-1}`; `nexub-migrate --rules changes-in-12`).
   */
  current: number;
  /** Indexes of finished steps. @default every step before `current` */
  completed?: number[];
  /**
   * Makes steps clickable. Linear by default: finished steps, the current one
   * and the first unfinished one can be reached; the rest wait.
   */
  onStepChange?: (index: number) => void;
  /** Any step can be reached. */
  nonLinear?: boolean;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Progress through a multi-step flow. Validate each step (a `Form` per step
 * works well) and move `current` forward from its submit.
 */
export const Stepper = React.forwardRef<HTMLElement, StepperProps>(function Stepper(
  { steps, current, completed: completedProp, onStepChange, nonLinear = false, orientation = 'horizontal', className, ...props },
  ref,
) {
  const t = useNexubMessages();
  // 12.0 removed current={-1} ("every step done", deprecated in 11.4): a negative index throws in
  // development and counts as 0 in production.
  if (current < 0) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production')
      throw new Error(
        `Stepper: current={${current}} was removed in 12.0. For "every step done", give the steps status: 'complete' (npx nexub-migrate --rules changes-in-12).`,
      );
    current = 0;
  }
  const completed = new Set(completedProp ?? steps.slice(0, current).map((_, i) => i));
  // 11.4: an explicit status wins; without one, the 11.3 rules (current / completed) apply.
  const statusOf = (i: number): StepperStatus =>
    steps[i]!.status ?? (i === current ? 'current' : completed.has(i) ? 'complete' : 'upcoming');
  const isDone = (i: number) => statusOf(i) === 'complete';
  const firstOpen = steps.findIndex((_, i) => !['complete', 'skipped', 'cancelled'].includes(statusOf(i)));
  const vertical = orientation === 'vertical';
  const statusText: Partial<Record<StepperStatus, string>> = {
    complete: t.stepCompleted,
    error: t.stepProblem,
    warning: t.stepWarning,
    skipped: t.stepSkipped,
    cancelled: t.stepCancelled,
  };

  return (
    <nav ref={ref} className={className} {...props}>
      <ol className={cn('m-0 flex list-none p-0', vertical ? 'flex-col' : 'flex-row items-start')}>
        {steps.map((step, i) => {
          const status = statusOf(i);
          const done = isDone(i);
          const isCurrent = status === 'current';
          const reachable = Boolean(onStepChange) && !isCurrent && (nonLinear || done || i === firstOpen);
          const tone =
            status === 'error' ? 'border-2 border-error bg-error-container text-on-error-container'
            : status === 'warning' ? 'border-2 border-warning bg-warning-container text-on-warning-container'
            : status === 'skipped' || status === 'cancelled' ? 'border-2 border-dashed border-outline-variant bg-surface text-on-surface-muted'
            : null;
          const marker = (
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-label-md font-semibold',
                // 10.5: pending → current → done changes colour on the effects spring.
                'transition-colors duration-effects-fast ease-effects-fast',
                tone ??
                (done && !isCurrent
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : isCurrent
                    ? 'border-2 border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-primary)]'
                    : 'border-2 border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface-muted)]'),
              )}
            >
              {status === 'error' ? <AlertCircle size="xs" />
                : status === 'warning' ? <AlertTriangle size="xs" />
                : status === 'skipped' ? <Minus size="xs" />
                : status === 'cancelled' ? <X size="xs" />
                : done && !isCurrent ? <Check size="xs" className="nx-tick" /> : i + 1}
            </span>
          );
          const text = (
            <span className={cn('flex min-w-0 flex-col gap-0.5', vertical ? 'items-start text-start' : 'items-center text-center')}>
              <span className="sr-only">{t.stepOf(i + 1, steps.length)}:</span>{' '}
              <span
                className={cn(
                  'text-label-lg font-medium transition-colors duration-effects-fast ease-effects-fast',
                  status === 'cancelled' && 'line-through',
                  isCurrent || done || status === 'error' || status === 'warning' ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface-muted)]',
                )}
              >
                {step.label}
              </span>
              {statusText[status] && <span className="sr-only">, {statusText[status]}</span>}
              {step.description && <span className={cn('text-body-sm', status === 'error' ? 'text-error' : 'text-[var(--color-on-surface-muted)]')}>{step.description}</span>}
            </span>
          );
          const body = vertical ? (
            <span className="flex gap-3">
              {marker}
              <span className="pt-1">{text}</span>
            </span>
          ) : (
            <span className="flex flex-col items-center gap-2 text-center">
              {marker}
              {text}
            </span>
          );
          return (
            <li
              key={step.id ?? step.label}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'relative flex',
                vertical ? 'pb-6 last:pb-0' : 'flex-1 justify-center',
                step.actions && (vertical ? 'flex-col' : 'flex-col items-center'),
                // Connector to the next step: a track (::before) and, painted over it, the progress (::after).
                i < steps.length - 1 &&
                  (vertical
                    ? 'before:absolute before:start-4 before:top-9 before:bottom-1 before:w-px after:absolute after:start-4 after:top-9 after:w-px'
                    : 'before:absolute before:top-4 before:start-[calc(50%+1.25rem)] before:end-[calc(-50%+1.25rem)] before:h-px after:absolute after:top-4 after:start-[calc(50%+1.25rem)] after:h-px'),
                i < steps.length - 1 && 'before:bg-[var(--color-outline-variant)] after:bg-[var(--color-primary)]',
                // 10.5: the progress grows toward the next step when this one is done and then
                // covers the track exactly (the settled look is unchanged). Not done = zero length.
                i < steps.length - 1 && 'after:transition-[inset] after:duration-effects-default after:ease-effects-default',
                i < steps.length - 1 &&
                  (vertical
                    ? done ? 'after:bottom-1' : 'after:bottom-[calc(100%-2.25rem)]'
                    : done ? 'after:end-[calc(-50%+1.25rem)]' : 'after:end-[calc(50%-1.25rem)]'),
              )}
            >
              {reachable ? (
                <button
                  type="button"
                  onClick={() => onStepChange!(i)}
                  className="rounded-shape-control p-1 hover:bg-[var(--color-surface-container-high)]"
                >
                  {body}
                </button>
              ) : (
                <span className="p-1">{body}</span>
              )}
              {step.actions && (
                <div className={cn('flex flex-wrap gap-2', vertical ? 'ms-12 mt-1' : 'mt-2 justify-center')}>{step.actions}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
