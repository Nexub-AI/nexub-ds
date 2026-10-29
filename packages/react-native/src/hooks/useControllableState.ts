import { useCallback, useLayoutEffect, useRef, useState } from 'react';

// Same contract as @nexub/react's hook (no SSR on native, so plain useLayoutEffect).
export function useControllableState<T>({
  value: controlled,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const onChangeRef = useRef(onChange);
  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );
  return [isControlled ? controlled : uncontrolled, setValue] as const;
}
