'use client';

import * as React from 'react';
import { useTheme } from '@nexub/react';
import { Moon, Sun, Monitor } from '@nexub/icons';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // `theme` is read from localStorage, which is unavailable during SSR.
  // The server always renders with the defaultTheme ('system'), while the
  // client may resolve a stored preference ('dark'/'light'), causing a
  // hydration mismatch on aria-pressed and the active-button styles.
  // Solution: treat the component as unresolved until after first mount —
  // every button renders identically on both server and client, then the
  // correct active state is applied after hydration.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const activeTheme = mounted ? theme : null;

  const options = [
    { value: 'light' as const, icon: <Sun size={14} />, label: 'Light' },
    { value: 'dark' as const, icon: <Moon size={14} />, label: 'Dark' },
    { value: 'system' as const, icon: <Monitor size={14} />, label: 'System' },
  ];

  return (
    <div
      role="group"
      aria-label="Theme"
      style={{
        display: 'flex',
        background: 'var(--color-surface-container-high)',
        borderRadius: 'var(--shape-control)',
        padding: '3px',
        gap: '2px',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          aria-pressed={activeTheme === opt.value}
          className="nx-state-layer nx-press"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--shape-control)',
            background: activeTheme === opt.value ? 'var(--color-secondary-container)' : 'transparent',
            border: 'none',
            color: activeTheme === opt.value ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
            cursor: 'pointer',
          }}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
