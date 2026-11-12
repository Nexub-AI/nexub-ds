'use client'; // docs preview: server pages import every example

import { KeyboardShortcut } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <KeyboardShortcut keys={['⌘', 'K']} aria-label="Command K" />
      <KeyboardShortcut keys={['Ctrl', 'Shift', 'P']} />
    </div>
  );
}
