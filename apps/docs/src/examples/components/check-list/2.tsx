'use client'; // docs preview: server pages import every example

import { CheckList } from '@nexub/react';

export default function Example() {
  return (
    <CheckList
      aria-label="Workspace setup"
      items={[
        { label: 'Create workspace', status: 'done' },
        { label: 'Connect bank account', status: 'done' },
        { label: 'Invite your team', status: 'pending' },
        { label: 'Send first invoice', status: 'pending' },
      ]}
    />
  );
}
