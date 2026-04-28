/**
 * Feature-detect navigator.mediaDevices.getDisplayMedia. Used to hide the
 * "Capture screen…" button on browsers that don't support it (notably iOS
 * Safari). Has to be called from the client; returns false on the server.
 */
export function isScreenCaptureSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (!navigator.mediaDevices) return false;
  return typeof navigator.mediaDevices.getDisplayMedia === 'function';
}
