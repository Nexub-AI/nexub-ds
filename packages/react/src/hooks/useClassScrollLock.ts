'use client';

import * as React from 'react';

let scrollLocks = 0;

/**
 * CSP-safe page scroll lock: toggles `nexub-scroll-lock` (from @nexub/themes/base)
 * on <html> instead of injecting a <style> tag. On while mounted; counted, so
 * nested overlays (a Sheet and a CommandPalette) share one lock.
 */
export function useClassScrollLock() {
  React.useEffect(() => {
    const html = document.documentElement;
    if (scrollLocks++ === 0) {
      // Keep the scrollbar's space so the page doesn't shift sideways.
      html.classList.toggle('nexub-scroll-gutter', window.innerWidth > html.clientWidth);
      html.classList.add('nexub-scroll-lock');
    }
    return () => {
      if (--scrollLocks === 0) html.classList.remove('nexub-scroll-lock', 'nexub-scroll-gutter');
    };
  }, []);
}

export type ScrollLock = 'style' | 'class';

/**
 * Which scroll lock a modal Root asked for. `'style'` (7.x default) is Radix's
 * react-remove-scroll, which injects a <style> (needs a CSP nonce, see
 * NexubProvider `nonce`); `'class'` is the class lock above, no <style> at all.
 */
export const ScrollLockContext = React.createContext<{ scrollLock: ScrollLock; modal: boolean }>({
  scrollLock: 'style',
  modal: true,
});

/** Plain overlay for scrollLock="class": Radix's RemoveScroll lives in its Overlay. */
export const ClassLockOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function ClassLockOverlay(props, ref) {
    useClassScrollLock();
    return React.createElement('div', { ref, 'data-state': 'open', ...props });
  },
);
