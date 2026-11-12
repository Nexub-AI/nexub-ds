'use client'; // docs preview: server pages import every example

import { ThinkingIndicator } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-start">
      <ThinkingIndicator label="Searching 4 sources" />
      <ThinkingIndicator size="sm" />
      <ThinkingIndicator size="sm" label={null} />
    </div>
  );
}
