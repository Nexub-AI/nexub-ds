'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Avatar, MultiSelect, type MultiSelectOption } from '@nexub/react';

const all: MultiSelectOption[] = [
  { value: 'u1', label: 'Aisha Rahman', description: 'Finance' },
  { value: 'u2', label: 'Ben Ong', description: 'Sales' },
  { value: 'u3', label: 'Chen Wei', description: 'On leave', disabled: true },
  { value: 'u4', label: 'Dana Lee', description: 'Product' },
  { value: 'u5', label: 'Eli Tan', description: 'Support' },
].map((p) => ({ ...p, avatar: <Avatar size="xs" name={p.label} /> }));

export default function Example() {
  const [value, setValue] = React.useState<string[]>(['u1']);
  const [options, setOptions] = React.useState(all);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <div className="w-full max-w-md">
      <MultiSelect
        aria-label="Reviewers"
        options={options}
        value={value}
        onValueChange={setValue}
        loading={loading}
        onSearch={(text) => {
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            const q = text.toLowerCase();
            setOptions(all.filter((p) => p.label.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)));
            setLoading(false);
          }, 300);
        }}
      />
    </div>
  );
}
