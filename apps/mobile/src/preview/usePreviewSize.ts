import { useCallback } from 'react';
import { Platform } from 'react-native';

/**
 * Web only: tells the framing docs page how tall the preview's content is, so
 * the phone frame can size itself. Posts
 * `{ type: 'nexub-preview-size', height }` to the same-origin parent.
 */
export function usePreviewSize() {
  return useCallback((_w: number, height: number) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || window.parent === window) return;
    window.parent.postMessage({ type: 'nexub-preview-size', height: Math.ceil(height) }, window.location.origin);
  }, []);
}
