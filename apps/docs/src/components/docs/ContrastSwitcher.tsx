'use client';

import * as React from 'react';
import { SegmentedControl } from '@nexub/react';

type Contrast = 'auto' | 'medium' | 'high';

const options: { value: Contrast; label: string; title: string }[] = [
  { value: 'auto', label: 'Auto', title: 'Contrast: follow the system' },
  { value: 'medium', label: 'Med', title: 'Medium contrast' },
  { value: 'high', label: 'High', title: 'High contrast' },
];

// Must match ThemeScript's contrastStorageKey in app/layout.tsx.
const STORAGE_KEY = 'nexub-contrast';

// 'auto' removes the attribute, so prefers-contrast: more still selects high.
function applyContrast(c: Contrast) {
  const root = document.documentElement;
  if (c === 'auto') root.removeAttribute('data-contrast');
  else root.setAttribute('data-contrast', c);
  try {
    if (c === 'auto') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, c);
  } catch {
    // localStorage not available
  }
}

export function ContrastSwitcher() {
  // ThemeScript already applied the stored level; read it back after mount.
  const [contrast, setContrast] = React.useState<Contrast | ''>('');
  React.useEffect(() => {
    const attr = document.documentElement.getAttribute('data-contrast');
    setContrast(attr === 'medium' || attr === 'high' ? attr : 'auto');
  }, []);

  return (
    <SegmentedControl.Root
      size="sm"
      aria-label="Contrast"
      value={contrast}
      onValueChange={(v) => {
        if (!v) return;
        applyContrast(v as Contrast);
        setContrast(v as Contrast);
      }}
    >
      {options.map(({ value, label, title }) => (
        <SegmentedControl.Item key={value} value={value} title={title} className="!px-2">
          {label}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}
