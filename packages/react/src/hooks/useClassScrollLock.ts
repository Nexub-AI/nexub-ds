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
