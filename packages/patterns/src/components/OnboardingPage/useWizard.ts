import * as React from 'react';
import { useControllableState } from '@nexub/react';

export type WizardCheck = boolean | string | void;

export interface WizardOptions {
  /** Number of steps. */
  count: number;
  step?: number;
  defaultStep?: number;
  onStepChange?: (index: number) => void;
  /** Checks a step before leaving it forwards: `false` or a message keeps the user there. */
  validate?: (index: number) => WizardCheck | Promise<WizardCheck>;
  /** Runs after the last step passes. A rejection shows its message and stays. */
  onComplete?: () => void | Promise<unknown>;
  /** Shown when `validate` returns `false` or an empty message. */
  invalidMessage: string;
}

/**
 * Internal step mechanics shared by OnboardingPage and KycPage: the current
 * index (controlled or not), validation before moving on, busy and error state
 * around async work, and focus moved to the step heading on every change after
 * the first render.
 */
export function useWizard({ count, step, defaultStep = 0, onStepChange, validate, onComplete, invalidMessage }: WizardOptions) {
  const [index = 0, setIndex] = useControllableState<number>({ value: step, defaultValue: defaultStep, onChange: onStepChange });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [done, setDone] = React.useState(false);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  // Each step is a new view: move focus to its heading so screen readers follow.
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [index, done]);

  const goTo = (next: number) => {
    setError(undefined);
    setIndex(Math.max(0, Math.min(count - 1, next)));
  };

  const advance = async (check: boolean) => {
    setBusy(true);
    setError(undefined);
    try {
      const result = check ? await validate?.(index) : true;
      if (result === false || typeof result === 'string') {
        setError(result || invalidMessage);
      } else if (index < count - 1) {
        setIndex(index + 1);
      } else {
        await onComplete?.();
        setDone(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return {
    index,
    busy,
    error,
    done,
    headingRef,
    /** Validate, then go on (or complete on the last step). */
    next: () => advance(true),
    /** Go on without validating: an optional step. */
    skip: () => advance(false),
    back: () => goTo(index - 1),
    goTo,
    /** Back to the first step after completing (KYC "Fix and resubmit"). */
    restart: () => {
      setDone(false);
      goTo(0);
    },
  };
}
