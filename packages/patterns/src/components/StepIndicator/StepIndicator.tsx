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
                className="absolute left-4 top-8 h-full w-px bg-[var(--color-border-default)]"
                aria-hidden="true"
              />
            )}

            {/* circle */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                status === 'complete' &&
                  'bg-[var(--color-brand-primary-500)] text-white',
                status === 'current' &&
                  'border-2 border-[var(--color-brand-primary-500)] text-[var(--color-brand-primary-500)] bg-[var(--color-bg-default)]',
                status === 'upcoming' &&
                  'border-2 border-[var(--color-border-default)] text-[var(--color-text-muted)] bg-[var(--color-bg-default)]',
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
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-[var(--color-text-muted)]">{step.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  ),
);

StepIndicator.displayName = 'StepIndicator';
