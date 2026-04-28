'use client';

import * as React from 'react';

/**
 * Hand-rolled Cloudflare Turnstile wrapper. No npm dependency — three lines
 * of script-injection plus an explicit-render call. Site key comes from
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY (baked at build time via next.config.mjs).
 *
 * Returns a `getToken()` function via ref so the caller can pull a fresh
 * token on submit. Tokens are single-use and expire ~5 minutes after issue.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          appearance?: 'always' | 'execute' | 'interaction-only';
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'invisible';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
      remove: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const SCRIPT_ID = 'cf-turnstile-script';

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('turnstile_load_failed')));
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `${SCRIPT_SRC}?render=explicit`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('turnstile_load_failed')));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export interface TurnstileHandle {
  /** Returns the current token, or undefined if not yet solved. */
  getToken: () => string | undefined;
  /** Force a fresh challenge — call after a failed submit so the next attempt has a new token. */
  reset: () => void;
}

interface Props {
  siteKey: string;
  /** Fires when a fresh token is issued. */
  onToken?: (token: string) => void;
  /** Fires on widget error or expiry. */
  onError?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

export const Turnstile = React.forwardRef<TurnstileHandle, Props>(function Turnstile(
  { siteKey, onToken, onError, theme = 'auto' },
  ref,
) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const widgetIdRef = React.useRef<string | undefined>(undefined);

  React.useImperativeHandle(
    ref,
    () => ({
      getToken: () => window.turnstile?.getResponse(widgetIdRef.current),
      reset: () => widgetIdRef.current && window.turnstile?.reset(widgetIdRef.current),
    }),
    [],
  );

  React.useEffect(() => {
    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          appearance: 'interaction-only',
          theme,
          callback: (token) => onToken?.(token),
          'error-callback': () => onError?.(),
          'expired-callback': () => onError?.(),
        });
      })
      .catch(() => {
        if (!cancelled) onError?.();
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [siteKey, onToken, onError, theme]);

  return <div ref={containerRef} />;
});
