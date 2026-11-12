'use client'; // docs preview: server pages import every example

import { Skeleton } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <Skeleton shape="line" width={80} />
      <Skeleton shape="rect" width={80} height={40} />
      <Skeleton shape="circle" width={40} height={40} />
    </div>
  );
}
