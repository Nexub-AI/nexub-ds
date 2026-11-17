import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Autocomplete } from './Autocomplete.js';

const meta: Meta = {
  title: 'Components/Autocomplete',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const countryOptions = [
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'in', label: 'India' },
  { value: 'jp', label: 'Japan' },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('');
    return (
      <div style={{ width: '280px', maxWidth: '100%' }}>
        <Autocomplete
          options={countryOptions}
          placeholder="Search countries..."
          value={selected}
          onValueChange={setSelected}
        />
        {selected && (
          <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-on-surface-muted, #64748b)' }}>
            Selected: {countryOptions.find((o) => o.value === selected)?.label}
          </p>
        )}
      </div>
    );
  },
};

// The 5.x default: the list always shows under the input.

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <Autocomplete size="sm" aria-label="Small" options={countryOptions} value="ca" />
      <Autocomplete size="md" aria-label="Medium" options={countryOptions} value="ca" />
      <Autocomplete size="lg" aria-label="Large" options={countryOptions} value="ca" />
      <Autocomplete readOnly aria-label="Read-only" options={countryOptions} value="ca" />
    </div>
  ),
};
