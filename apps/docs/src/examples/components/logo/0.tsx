'use client'; // docs preview: server pages import every example

import { Logo } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Logo />
      <Logo variant="icon" />
      <Logo mark="mono" />
      <span className="rounded-shape-container bg-[var(--color-inverse-surface)] p-3">
        <Logo tone="inverse" />
      </span>
    </div>
  );
}
