'use client'; // docs preview: server pages import every example

import { AgentAvatar, Avatar } from '@nexub/react';
import { CreditCard, Terminal } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar name="Ada Lovelace" size="lg" />
      <AgentAvatar name="Payhub agent" icon={<CreditCard />} size="lg" />
      <AgentAvatar name="devX agent" icon={<Terminal />} category="blue" size="lg" />
      <AgentAvatar name="Nexub agent" size="lg" />
    </div>
  );
}
