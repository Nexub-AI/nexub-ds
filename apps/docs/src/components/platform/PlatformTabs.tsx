'use client';

import * as React from 'react';
import { Monitor, Smartphone } from '@nexub/icons';
import { SegmentedControl } from '@nexub/react';

export type Platform = 'web' | 'mobile';
const KEY = 'nexub-platform';
const EVENT = 'nexub-platform-change';

function read(): Platform | null {
  try {
    const hash = window.location.hash;
    if (hash === '#mobile') return 'mobile';
    const v = localStorage.getItem(KEY);
    return v === 'web' || v === 'mobile' ? v : null;
  } catch {
    return null;
  }
}

/** The visitor's platform choice, shared by every switch on the page and remembered across pages. */
export function usePlatform(fallback: Platform): [Platform, (p: Platform) => void] {
  const [platform, setPlatform] = React.useState<Platform>(fallback);
  React.useEffect(() => {
    const sync = () => setPlatform(read() ?? fallback);
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('hashchange', sync);
    };
  }, [fallback]);
  const set = React.useCallback((p: Platform) => {
    try {
      localStorage.setItem(KEY, p);
    } catch {}
    if (window.location.hash === '#mobile' && p === 'web') history.replaceState(null, '', window.location.pathname);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [platform, set];
}

export function PlatformSwitch({ available = ['web', 'mobile'], fallback = 'web' }: { available?: Platform[]; fallback?: Platform }) {
  const [platform, setPlatform] = usePlatform(fallback);
  const value = available.includes(platform) ? platform : available[0];
  return (
    <SegmentedControl.Root
      aria-label="Platform"
      value={value}
      onValueChange={(v) => v && setPlatform(v as Platform)}
      className="self-start"
    >
      <SegmentedControl.Item value="web" disabled={!available.includes('web')} className="gap-2">
        <Monitor size={16} aria-hidden="true" /> Web
      </SegmentedControl.Item>
      <SegmentedControl.Item value="mobile" disabled={!available.includes('mobile')} className="gap-2">
        <Smartphone size={16} aria-hidden="true" /> iOS &amp; Android
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

/**
 * Shows the panel for the chosen platform. Both panels are server-rendered;
 * the hidden one is `hidden` so it stays out of the accessibility tree.
 */
export function PlatformPanel({
  platform,
  fallback = 'web',
  available = ['web', 'mobile'],
  children,
}: {
  platform: Platform;
  fallback?: Platform;
  available?: Platform[];
  children: React.ReactNode;
}) {
  const [current] = usePlatform(fallback);
  const shown = available.includes(current) ? current : available[0];
  return (
    <div id={platform === 'mobile' ? 'mobile' : undefined} hidden={shown !== platform} data-platform-panel={platform}>
      {children}
    </div>
  );
}
