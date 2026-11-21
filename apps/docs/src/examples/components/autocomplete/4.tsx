'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Autocomplete } from '@nexub/react';

const people = [
  { value: 'u1', label: 'Aisha Rahman', description: 'aisha@nexub.test' },
  { value: 'u2', label: 'Ben Ong', description: 'ben@nexub.test' },
  { value: 'u3', label: 'Chen Wei', description: 'On leave', disabled: true },
  { value: 'u4', label: 'Dana Lee', description: 'dana@nexub.test' },
];

export default function Example() {
  const [added, setAdded] = React.useState<string[]>([]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Autocomplete
        label="Add a reviewer"
        clearOnSelect
        options={people.filter((p) => !added.includes(p.value))}
        onValueChange={(v) => setAdded((a) => [...a, v])}
      />
      <p className="text-body-sm text-on-surface-muted">
        Reviewers: {added.map((v) => people.find((p) => p.value === v)?.label).join(', ') || '—'}
      </p>
    </div>
  );
}
