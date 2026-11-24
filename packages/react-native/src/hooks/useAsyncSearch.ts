import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatest } from './useLatest';

/**
 * The search callback shared by ComboboxField and MultiSelect. Return a promise of options and
 * the field shows them (with a loading row and an error row). Return nothing to manage `options`
 * and `loading` yourself, as on web.
 */
export type AsyncSearch<O> = (query: string) => Promise<readonly O[]> | void;

export interface AsyncSearchState<O> {
  /** The latest results, or `null` before any promise has resolved (show `options`). */
  results: readonly O[] | null;
  loading: boolean;
  /** The latest search rejected. */
  failed: boolean;
  /** Runs `onSearch` after the debounce. `immediate` skips the wait (opening the sheet, retry). */
  search: (query: string, immediate?: boolean) => void;
  /** Drops the results and any search in flight. */
  reset: () => void;
}

const isThenable = (x: unknown): x is PromiseLike<unknown> =>
  !!x && typeof (x as { then?: unknown }).then === 'function';

/**
 * Debounced async search with a stale-response guard: each run takes a number, and a result is
 * used only while its number is still the latest, so a slow answer to "a" can't replace the
 * answer to "ab". Unmounting drops everything in flight.
 */
export function useAsyncSearch<O>(onSearch: AsyncSearch<O> | undefined, debounce: number): AsyncSearchState<O> {
  const [results, setResults] = useState<readonly O[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const run = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const live = useRef(true);
  const onSearchRef = useLatest(onSearch);

  useEffect(() => {
    live.current = true;
    return () => {
      // Answers still in flight check `live` and drop themselves.
      live.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const start = useCallback(
    (query: string) => {
      const id = ++run.current;
      const out = onSearchRef.current?.(query);
      if (!isThenable(out)) return;
      setLoading(true);
      setFailed(false);
      out.then(
        (next) => {
          if (!live.current || id !== run.current) return;
          setResults(next as readonly O[]);
          setLoading(false);
        },
        () => {
          if (!live.current || id !== run.current) return;
          setFailed(true);
          setLoading(false);
        },
      );
    },
    [onSearchRef],
  );

  const search = useCallback(
    (query: string, immediate?: boolean) => {
      if (!onSearchRef.current) return;
      clearTimeout(timer.current);
      if (immediate || debounce <= 0) start(query);
      else timer.current = setTimeout(() => start(query), debounce);
    },
    [debounce, onSearchRef, start],
  );

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    run.current++;
    setResults(null);
    setLoading(false);
    setFailed(false);
  }, []);

  return { results, loading, failed, search, reset };
}
