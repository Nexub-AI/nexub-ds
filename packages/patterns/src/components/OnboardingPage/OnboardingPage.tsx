import * as React from 'react';
import { Alert, Button, Progress, Stepper, SuccessCheck } from '@nexub/react';
import { PageFrame, usePageMessages, type PageFrameProps, type PageTemplateMessages } from '../PageFrame/PageFrame.js';
import { useWizard, type WizardCheck } from './useWizard.js';

export interface OnboardingStepContext {
  index: number;
  total: number;
  /** Validate and go on, e.g. from a form's submit inside the step. */
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode | ((ctx: OnboardingStepContext) => React.ReactNode);
  /** Adds Skip, which moves on without `validate`. */
  optional?: boolean;
  /** Runs on Continue. `false` or a message keeps the user on the step; the message is announced. */
  validate?: () => WizardCheck | Promise<WizardCheck>;
}

export interface OnboardingPageProps extends Omit<PageFrameProps, 'title' | 'children' | 'width'> {
  steps: OnboardingStep[];
  /** Controlled step index. */
  step?: number;
  /** @default 0 */
  defaultStep?: number;
  onStepChange?: (index: number) => void;
  /** After the last step. A rejected promise shows its message and stays on the step. */
  onComplete: () => void | Promise<unknown>;
  /** Called with the step that was skipped. */
  onSkip?: (step: OnboardingStep) => void;
  /** Completion view title. @default messages.allSet */
  completeTitle?: string;
  completeDescription?: string;
  /** Buttons on the completion view: "Go to dashboard". */
  completeActions?: React.ReactNode;
  /** Something outside the steps is in progress: the buttons wait. */
  loading?: boolean;
  /** An error from outside the steps (announced). */
  error?: string;
  /** @default 'sm' */
  width?: 'sm' | 'md';
  messages?: Partial<PageTemplateMessages>;
}

/**
 * A setup wizard: one question per step, progress that says "Step n of N",
 * Back / Continue / Skip, a check before each move forward and a completion
 * view. Focus moves to each step's heading. The native `OnboardingScreen` is
 * intro slides, not a form wizard.
 */
export const OnboardingPage = React.forwardRef<HTMLElement, OnboardingPageProps>(function OnboardingPage(
  {
    steps,
    step: stepProp,
    defaultStep,
    onStepChange,
    onComplete,
    onSkip,
    completeTitle,
    completeDescription,
    completeActions,
    loading,
    error,
    width = 'sm',
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const total = steps.length;
  const wizard = useWizard({
    count: total,
    step: stepProp,
    defaultStep,
    onStepChange,
    validate: (i) => steps[i]?.validate?.(),
    onComplete,
    invalidMessage: m.stepInvalid,
  });
  const index = Math.min(wizard.index, total - 1);
  const current = steps[index];
  const busy = wizard.busy || loading;
  const message = wizard.error ?? error;

  if (wizard.done || !current) {
    return (
      <PageFrame ref={ref} width={width} {...props}>
        <div role="status" className="flex flex-col items-center gap-4 py-8 text-center">
          <SuccessCheck size="lg" />
          <h1 ref={wizard.headingRef} tabIndex={-1} className="text-headline-sm text-[var(--color-on-surface)] outline-none">
            {completeTitle ?? m.allSet}
          </h1>
          {completeDescription && <p className="text-body-md text-[var(--color-on-surface-muted)]">{completeDescription}</p>}
          {completeActions && <div className="flex w-full flex-col gap-2">{completeActions}</div>}
        </div>
      </PageFrame>
    );
  }

  const label = m.stepOf(index + 1, total);
  return (
    <PageFrame ref={ref} width={width} {...props}>
      {/* The bar where the page is narrow, the named steps once there is room. */}
      <div className="flex flex-col gap-2 @xl:hidden">
        <Progress value={index + 1} max={total} aria-label={label} />
        <p className="text-label-md text-[var(--color-on-surface-variant)]">{label}</p>
      </div>
      <Stepper
        className="hidden @xl:block"
        aria-label={label}
        steps={steps.map((s) => ({ id: s.id, label: s.title }))}
        current={index}
      />

      <div className="flex flex-col gap-2">
        <h1 ref={wizard.headingRef} tabIndex={-1} className="text-headline-sm text-[var(--color-on-surface)] outline-none">
          {current.title}
        </h1>
        {current.description && <p className="text-body-md text-[var(--color-on-surface-muted)]">{current.description}</p>}
      </div>

      {message && (
        <Alert tone="danger" role="alert">
          {message}
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        {typeof current.content === 'function'
          ? current.content({ index, total, next: () => void wizard.next(), back: wizard.back, goTo: wizard.goTo })
          : current.content}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {index > 0 && (
          <Button variant="text" size="lg" disabled={busy} onClick={wizard.back}>
            {m.back}
          </Button>
        )}
        <div className="ms-auto flex flex-wrap items-center gap-2">
          {current.optional && (
            <Button
              variant="text"
              size="lg"
              disabled={busy}
              onClick={() => {
                onSkip?.(current);
                void wizard.skip();
              }}
            >
              {m.skip}
            </Button>
          )}
          <Button size="lg" loading={busy} onClick={() => void wizard.next()}>
            {index === total - 1 ? m.finish : m.continue}
          </Button>
        </div>
      </div>
    </PageFrame>
  );
});
