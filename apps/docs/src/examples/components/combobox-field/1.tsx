'use client'; // docs preview: server pages import every example

import { ComboboxField } from '@nexub/react';

const people = [
  { value: 'u1', label: 'Aisha Rahman', description: 'Finance lead', keywords: ['aisha@nexub.test'], group: 'Finance' },
  { value: 'u2', label: 'Ben Ong', description: 'Accountant', group: 'Finance' },
  { value: 'u3', label: 'Chen Wei', description: 'Account executive', group: 'Sales' },
  { value: 'u4', label: 'Dana Lee', description: 'On leave', group: 'Sales', disabled: true },
];

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <ComboboxField label="Manager" noneOption="No manager" options={people} error="Pick who approves leave" />
    </div>
  );
}
