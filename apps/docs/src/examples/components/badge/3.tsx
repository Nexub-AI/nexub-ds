'use client'; // docs preview: server pages import every example

import { AgentBadge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <AgentBadge>AI on your own key</AgentBadge>
      <AgentBadge tone="info">Buttons only</AgentBadge>
    </div>
  );
}
