'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect.js';

export interface AsyncAction<A extends unknown[], R> {
  /** Calls `fn`. Resolves to its result, or `undefined` if it threw or a newer call (or `reset`) superseded it. Never rejects. */
  run: (...args: A) => Promise<R | undefined>;
  /** True while the latest call is in flight. */
  pending: boolean;
  /** What the latest call threw; cleared by the next `run` or `reset`. */
  error: unknown;
  /** Clears `pending` and `error` and ignores any call still in flight. */
  reset: () => void;
}

/**
 * Wraps an async function with pending/error state. The latest call wins:
 * results and errors from older calls are dropped, and so is anything that
 * settles after unmount.
 *
 * ```tsx
 * const save = useAsyncAction(async (draft: Draft) => api.save(draft));
 * <Button loading={save.pending} onClick={() => save.run(draft)}>Save</Button>
 * {save.error ? <Alert tone="danger">Could not save</Alert> : null}
 * ```
 *
 * For optimistic UI, pair it with React 19 `useOptimistic`: apply the
 * optimistic value inside `startTransition`, then `await run(...)`; React
 * drops the optimistic value when the transition ends. Inside a
 * `<form action>`, a `type="submit"` Button already tracks pending on its own.
 */
export function useAsyncAction<A extends unknown[], R>(
  fn: (...args: A) => Promise<R> | R,
): AsyncAction<A, R> {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const latest = useRef(0);
  const fnRef = useRef(fn);
  useIsomorphicLayoutEffect(() => {
    fnRef.current = fn;
  });
  // Unmount makes every in-flight call stale, so nothing sets state afterwards.
  useEffect(() => () => void latest.current++, []);

  const run = useCallback(async (...args: A) => {
    const id = ++latest.current;
    setPending(true);
    setError(undefined);
    try {
      const result = await fnRef.current(...args);
      return id === latest.current ? result : undefined;
    } catch (e) {
      if (id === latest.current) setError(e);
      return undefined;
    } finally {
      if (id === latest.current) setPending(false);
    }
  }, []);

  const reset = useCallback(() => {
    latest.current++;
    setPending(false);
    setError(undefined);
  }, []);

  return { run, pending, error, reset };
}
