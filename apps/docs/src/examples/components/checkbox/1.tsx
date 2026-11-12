'use client'; // docs preview: server pages import every example

import { Checkbox, Label } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">I agree to the terms and conditions</Label>
    </div>
  );
}
