'use client';

import * as React from 'react';
import { useTheme } from '@nexub/react';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

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
        background: 'var(--color-bg-muted)',
        borderRadius: 'var(--radius-lg)',
        padding: '3px',
        gap: '2px',
        border: '1px solid var(--color-border-default)',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          aria-pressed={theme === opt.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-md)',
            background: theme === opt.value ? 'var(--color-bg-default)' : 'transparent',
            border: theme === opt.value ? '1px solid var(--color-border-default)' : '1px solid transparent',
            color: theme === opt.value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'all var(--duration-fast) var(--ease-out)',
          }}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
