'use client'; // docs preview: server pages import every example

import { CheckboxField } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CheckboxField label="Gift wrap" description="Paper and ribbon" aside="$4.00" />
      <CheckboxField label="All invoices" checked="indeterminate" />
      <CheckboxField label="I accept the terms" error="Accept the terms to continue" />
    </div>
  );
}
