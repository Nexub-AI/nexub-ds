'use client'; // docs preview: server pages import every example

import { Checkbox, Label } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-3 items-start">
      <div className="flex items-center gap-4">
        <Checkbox size="sm" defaultChecked aria-label="Small" />
        <Checkbox size="md" defaultChecked aria-label="Medium" />
        <Checkbox size="lg" defaultChecked aria-label="Large" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms" invalid /><Label htmlFor="terms">Invalid: accept the terms to continue</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="plan" readOnly defaultChecked /><Label htmlFor="plan">Read-only: set by your plan</Label>
      </div>
    </div>
  );
}
