import { flushSync } from 'react-dom';

/**
 * Run a DOM update as a view transition (styles: @nexub/themes/view-transitions).
 * React state set inside `update` is flushed synchronously, so the browser
 * snapshots the new DOM rather than the stale one. Resolves when the transition
 * has finished (or right after the update where the API is missing / on the server).
 */
export function startViewTransition(update: () => void | Promise<void>): Promise<void> {
  const run = () => {
    let result: void | Promise<void> = undefined;
    flushSync(() => {
      result = update();
    });
    return result;
  };
  const doc = typeof document === 'undefined' ? undefined : (document as Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => { finished: Promise<void> };
  });
  if (doc?.startViewTransition) return doc.startViewTransition(run).finished;
  return Promise.resolve(run());
}
