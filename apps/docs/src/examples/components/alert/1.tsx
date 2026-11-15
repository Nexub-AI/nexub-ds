'use client'; // docs preview: server pages import every example

import { Alert } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start w-full max-w-[480px]">
      <Alert tone="info" title="Info">Informational message.</Alert>
      <Alert tone="success" title="Success">Operation completed successfully.</Alert>
      <Alert tone="warning" title="Warning">Something needs your attention.</Alert>
      <Alert tone="danger" title="Error">Something went wrong.</Alert>
    </div>
  );
}
