'use client';

import * as React from 'react';
import { SegmentedControl, useTheme } from '@nexub/react';
import { Moon, Sun, Monitor } from '@nexub/icons';

const options = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // The stored theme is only known on the client; render unselected until then.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <SegmentedControl.Root
      size="sm"
      aria-label="Theme"
      value={mounted ? theme : ''}
      onValueChange={(v) => v && setTheme(v as (typeof options)[number]['value'])}
    >
      {options.map(({ value, icon: Icon, label }) => (
        <SegmentedControl.Item key={value} value={value} aria-label={label} title={label} className="!px-2">
          <Icon size={14} aria-hidden="true" />
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}
