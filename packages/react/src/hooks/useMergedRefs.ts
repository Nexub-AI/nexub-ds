import { useCallback, type Ref } from 'react';

function setRef<T>(ref: Ref<T> | undefined, value: T) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
  } else {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

import type React from 'react';

export function useMergedRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return useCallback(
    (node: T) => {
      for (const ref of refs) setRef(ref, node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
