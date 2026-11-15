'use client'; // docs preview: server pages import every example

import { Alert } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-[480px]">
      <Alert tone="success" title="Saved" onClose={() => {}}>Your changes have been saved.</Alert>
    </div>
  );
}
