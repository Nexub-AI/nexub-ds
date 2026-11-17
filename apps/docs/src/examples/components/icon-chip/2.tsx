'use client'; // docs preview: server pages import every example

import { IconChip } from '@nexub/react';
import { Wallet } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <IconChip size="sm" category="emerald">
        <Wallet />
      </IconChip>
      <IconChip size="md" category="emerald">
        <Wallet />
      </IconChip>
      <IconChip size="lg" category="emerald">
        <Wallet />
      </IconChip>
      <IconChip size="lg" category="emerald" shape="circle">
        <Wallet />
      </IconChip>
      <IconChip>
        <Wallet />
      </IconChip>
    </div>
  );
}
