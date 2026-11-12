'use client'; // docs preview: server pages import every example

import { ErrorState } from '@nexub/react';

export default function Example() {
  return (
    <ErrorState
      tone="warning"
      title="Connection issue"
      description="Check your network and try again."
    />
  );
}
