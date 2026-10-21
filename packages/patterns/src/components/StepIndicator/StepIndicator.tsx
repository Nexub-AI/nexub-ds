import * as React from 'react';
import { cn } from '@nexub/react';
import { Check } from '@nexub/icons';

export interface StepIndicatorStep {
  label: string;
  description?: string;
}

export interface StepIndicatorProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepIndicatorStep[];
  currentStep: number;
}

export const StepIndicator = React.forwardRef<HTMLOListElement, StepIndicatorProps>(
  ({ steps, currentStep, className, ...props }, ref) => (
    <ol ref={ref} className={cn('flex flex-col gap-0', className)} {...props}>
      {steps.map((step, index) => {
        const status =
          index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming';

        return (
          <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
            {/* connector line */}
            {index < steps.length - 1 && (
              <div
                className="absolute start-4 top-8 h-full w-px bg-[var(--color-outline-variant)]"
                aria-hidden="true"
              />
            )}

            {/* circle */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                status === 'complete' &&
                  'bg-[var(--color-primary)] text-[var(--color-on-primary)]',
                status === 'current' &&
                  'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface)]',
                status === 'upcoming' &&
                  'border-2 border-[var(--color-outline-variant)] text-[var(--color-on-surface-muted)] bg-[var(--color-surface)]',
              )}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {status === 'complete' ? (
                <Check size="xs" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </div>

            {/* label */}
            <div className="flex flex-col gap-0.5 pt-0.5">
              <p className="text-sm font-medium text-[var(--color-on-surface)]">
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-[var(--color-on-surface-muted)]">{step.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  ),
);

StepIndicator.displayName = 'StepIndicator';
