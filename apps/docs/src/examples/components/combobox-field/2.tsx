'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { ComboboxField, type ComboboxOption } from '@nexub/react';

const companies: ComboboxOption[] = ['Acme Corp', 'Apex Labs', 'Nexub Pte Ltd', 'Zeta Holdings'].map((label, i) => ({ value: `c${i}`, label }));

export default function Example() {
  const [options, setOptions] = React.useState<ComboboxOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState<string | null>('c2');
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  return (
    <div className="w-full max-w-sm">
      <ComboboxField
        label="Company"
        options={options}
        loading={loading}
        value={value}
        onValueChange={setValue}
        selectedOption={companies.find((o) => o.value === value)}
        onSearch={(text) => {
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            setOptions(companies.filter((o) => o.label.toLowerCase().includes(text.toLowerCase())));
            setLoading(false);
          }, 300);
        }}
      />
    </div>
  );
}
