'use client'; // docs preview: server pages import every example

import { Label, Input } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1 items-start w-[280px]">
      <Label htmlFor="email-ex">Email</Label>
      <Input id="email-ex" type="email" placeholder="you@example.com" />
    </div>
  );
}
