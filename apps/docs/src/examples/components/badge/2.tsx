'use client'; // docs preview: server pages import every example

import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {(['success', 'danger', 'warning'] as const).map((t) => (
        <Badge key={t} tone={t} leadingIcon={<span className="w-[6px] h-[6px] rounded-full bg-current inline-block" />}>
          {t === 'success' ? 'Online' : t === 'danger' ? 'Offline' : 'Away'}
        </Badge>
      ))}
    </div>
  );
}
