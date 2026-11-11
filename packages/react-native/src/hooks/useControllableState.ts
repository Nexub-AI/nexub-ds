import { useCallback, useState } from 'react';
import { useLatest } from './useLatest';

// Same contract as @nexub/react's hook.
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
  const onChangeRef = useLatest(onChange);
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChangeRef.current?.(next);
    },
    [isControlled, onChangeRef],
  );
  return [isControlled ? controlled : uncontrolled, setValue] as const;
}
