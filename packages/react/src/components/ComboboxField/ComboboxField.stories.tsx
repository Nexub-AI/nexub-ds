import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ComboboxField, ComboboxPicker, type ComboboxOption } from './ComboboxField.js';

const meta: Meta<typeof ComboboxField> = {
  title: 'Forms/ComboboxField',
  component: ComboboxField,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ComboboxField>;

const people: ComboboxOption[] = [
  { value: 'u1', label: 'Aisha Rahman', description: 'Finance lead', group: 'Finance' },
  { value: 'u2', label: 'Ben Ong', description: 'Accountant', group: 'Finance' },
  { value: 'u3', label: 'Chen Wei', description: 'Account executive', group: 'Sales' },
  { value: 'u4', label: 'Dana Lee', description: 'On leave', group: 'Sales', disabled: true },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div style={{ maxWidth: 360 }}>
        <ComboboxField label="Manager" description="Approves leave and claims" noneOption="No manager" options={people} value={value} onValueChange={setValue} />
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <ComboboxField label="Invalid" error="Pick a manager" required options={people} />
      <ComboboxField label="Read-only" readOnly options={people} defaultValue="u2" />
      <ComboboxField label="Disabled" disabled options={people} defaultValue="u3" />
      <ComboboxPicker aria-label="Small picker" size="sm" options={people} />
    </div>
  ),
};

/** Server search: `onSearch` with `loading`; `selectedOption` labels the value before any search runs. */
export const AsyncSearch: Story = {
  render: () => {
    const all = ['Acme Corp', 'Apex Labs', 'Nexub Pte Ltd', 'Zeta Holdings'].map((label, i) => ({ value: `c${i}`, label }));
    const [options, setOptions] = React.useState<ComboboxOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [value, setValue] = React.useState<string | null>('c2');
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    return (
      <div style={{ maxWidth: 360 }}>
        <ComboboxField
          label="Company"
          options={options}
          loading={loading}
          value={value}
          onValueChange={setValue}
          selectedOption={all.find((o) => o.value === value)}
          onSearch={(text) => {
            clearTimeout(timer.current);
            setLoading(true);
            timer.current = setTimeout(() => {
              setOptions(all.filter((o) => o.label.toLowerCase().includes(text.toLowerCase())));
              setLoading(false);
            }, 300);
          }}
        />
      </div>
    );
  },
};
