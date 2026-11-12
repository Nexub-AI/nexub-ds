'use client'; // docs preview: server pages import every example

import { Marquee } from '@nexub/react';

const tools = ['Slack', 'Xero', 'Google Workspace', 'Stripe', 'QuickBooks', 'WhatsApp'];

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <Marquee>
        {tools.map((t) => (
          <span key={t} className="text-title-md text-[var(--color-on-surface-variant)]">{t}</span>
        ))}
      </Marquee>
    </div>
  );
}
