'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { ComboboxField } from '@nexub/react';

const countries = ['Australia', 'India', 'Indonesia', 'Malaysia', 'New Zealand', 'Philippines', 'Singapore', 'Thailand', 'United Kingdom', 'United States', 'Vietnam'].map((label) => ({
  value: label.toLowerCase().replace(/ /g, '-'),
  label,
}));

export default function Example() {
  const [value, setValue] = React.useState<string | null>('singapore');
  return (
    <div className="w-full max-w-sm">
      <ComboboxField label="Country" description="Where the company is registered" options={countries} value={value} onValueChange={setValue} />
    </div>
  );
}
