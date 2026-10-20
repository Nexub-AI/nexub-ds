/**
 * Run a DOM update as a view transition (styles: @nexub/themes/view-transitions).
 * Where the API is missing, or on the server, the update just runs.
 */
export function startViewTransition(update: () => void | Promise<void>): void {
  const doc = typeof document === 'undefined' ? undefined : (document as Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => unknown;
  });
  if (doc?.startViewTransition) doc.startViewTransition(update);
  else void update();
}
