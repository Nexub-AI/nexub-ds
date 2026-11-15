'use client'; // docs preview: server pages import every example

import { Progress } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2.5 items-start w-[280px]">
      <Progress value={80} tone="success" />
      <Progress value={55} tone="info" />
      <Progress value={30} tone="warning" />
      <Progress value={20} tone="danger" />
    </div>
  );
}
