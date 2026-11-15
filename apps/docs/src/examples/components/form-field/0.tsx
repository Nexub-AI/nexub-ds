'use client'; // docs preview: server pages import every example

import { Label, Input, HelperText } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1 items-start w-[280px]">
      <Label htmlFor="field-name" required>Full name</Label>
      <Input id="field-name" placeholder="Jane Smith" />
      <HelperText>Enter your legal name.</HelperText>
    </div>
  );
}
