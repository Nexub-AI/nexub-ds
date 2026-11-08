'use client';

import * as React from 'react';
import { Check } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  steps: StepperStep[];
  /** Index of the step being shown. */
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
  const completed = new Set(completedProp ?? steps.slice(0, current).map((_, i) => i));
  const firstOpen = steps.findIndex((_, i) => !completed.has(i));
  const vertical = orientation === 'vertical';

  return (
    <nav ref={ref} className={className} {...props}>
      <ol className={cn('m-0 flex list-none p-0', vertical ? 'flex-col' : 'flex-row items-start')}>
        {steps.map((step, i) => {
          const done = completed.has(i);
          const isCurrent = i === current;
          const reachable = Boolean(onStepChange) && !isCurrent && (nonLinear || done || i === firstOpen);
          const marker = (
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-label-md font-semibold',
                done && !isCurrent
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : isCurrent
                    ? 'border-2 border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-primary)]'
                    : 'border-2 border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface-muted)]',
              )}
            >
              {done && !isCurrent ? <Check size="xs" /> : i + 1}
            </span>
          );
          const text = (
            <span className={cn('flex min-w-0 flex-col gap-0.5', vertical ? 'items-start text-start' : 'items-center text-center')}>
              <span className="sr-only">{t.stepOf(i + 1, steps.length)}:</span>{' '}
              <span className={cn('text-label-lg font-medium', isCurrent || done ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface-muted)]')}>
                {step.label}
              </span>
              {done && <span className="sr-only">, {t.stepCompleted}</span>}
              {step.description && <span className="text-body-sm text-[var(--color-on-surface-muted)]">{step.description}</span>}
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
              key={step.id}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'relative flex',
                vertical ? 'pb-6 last:pb-0' : 'flex-1 justify-center',
                // Connector to the next step.
                i < steps.length - 1 &&
                  (vertical
                    ? 'after:absolute after:start-4 after:top-9 after:bottom-1 after:w-px'
                    : 'after:absolute after:top-4 after:start-[calc(50%+1.25rem)] after:end-[calc(-50%+1.25rem)] after:h-px'),
                i < steps.length - 1 && (done ? 'after:bg-[var(--color-primary)]' : 'after:bg-[var(--color-outline-variant)]'),
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
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
