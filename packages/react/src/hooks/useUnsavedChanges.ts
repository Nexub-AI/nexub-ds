'use client';

import { useEffect } from 'react';

/**
 * Asks the browser to confirm before the page unloads (reload, close, external
 * link) while `dirty` is true. In-app navigation belongs to your router: block
 * it there with the same flag.
 */
export function useUnsavedChanges(dirty: boolean): void {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);
}
