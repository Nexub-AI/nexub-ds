'use client'; // docs preview: server pages import every example

import { Avatar } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-center justify-center">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Avatar key={s} name="Alex J" size={s} />
      ))}
    </div>
  );
}
