'use client'; // docs preview: server pages import every example

import { Skeleton } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start w-[280px]">
      <Skeleton shape="line" width="60%" />
      <Skeleton shape="line" width="100%" />
      <Skeleton shape="line" width="80%" />
      <div className="flex gap-2 flex-nowrap items-center justify-center">
        <Skeleton shape="circle" width={40} height={40} />
        <div className="flex flex-col gap-1.5 items-start flex-1">
          <Skeleton shape="line" width="70%" />
          <Skeleton shape="line" width="50%" />
        </div>
      </div>
    </div>
  );
}
