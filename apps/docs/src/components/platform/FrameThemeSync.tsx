'use client';

import * as React from 'react';

/** Inside a docs preview frame: follow the parent page's theme and brand live. */
export function FrameThemeSync() {
  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'nexub-theme') return;
      const root = document.documentElement;
      root.setAttribute('data-theme', e.data.scheme === 'dark' ? 'dark' : 'light');
      root.style.colorScheme = e.data.scheme === 'dark' ? 'dark' : 'light';
      if (!e.data.brand || e.data.brand === 'nexub' || e.data.brand === 'base') root.removeAttribute('data-product');
      else root.setAttribute('data-product', e.data.brand);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
  return null;
}
