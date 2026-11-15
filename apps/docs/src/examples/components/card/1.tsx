'use client'; // docs preview: server pages import every example

import { Card, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2.5 items-start w-[280px]">
      <Card variant="flat"><Text size="body-sm">Flat</Text></Card>
      <Card variant="surface"><Text size="body-sm">Surface</Text></Card>
      <Card variant="interactive"><Text size="body-sm">Interactive</Text></Card>
    </div>
  );
}
