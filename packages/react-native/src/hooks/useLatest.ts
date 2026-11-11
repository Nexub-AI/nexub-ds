import { useLayoutEffect, useRef } from 'react';

/**
 * A ref that always holds the latest `value` (updated before effects run), so
 * an effect or gesture handler can call the newest callback without listing it
 * as a dependency and re-running. Same idea as React 19.2's useEffectEvent,
 * which our >=19.1 peer range can't rely on. No SSR on native, so plain
 * useLayoutEffect.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
