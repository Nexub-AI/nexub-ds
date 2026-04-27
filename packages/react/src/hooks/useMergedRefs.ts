import { useCallback, useRef, type Ref } from 'react';
import type React from 'react';

function setRef<T>(ref: Ref<T> | undefined, value: T) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
  } else {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function useMergedRefs<T>(...refs: Array<Ref<T> | undefined>) {
  // Store refs in a ref so the callback reads the latest list on every
  // invocation without needing them as dependencies. The previous approach
  // passed the spread array directly as deps — a new array is created on
  // every call, so useCallback never actually memoised the function.
  const refsRef = useRef(refs);
  refsRef.current = refs;

  return useCallback((node: T) => {
    for (const ref of refsRef.current) setRef(ref, node);
  }, []); // stable — reads current refs via refsRef.current
}
