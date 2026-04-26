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
      <div style={{ width: '280px' }}>
        <Autocomplete
          options={countryOptions}
          placeholder="Search countries..."
          value={selected}
          onValueChange={setSelected}
        />
        {selected && (
          <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-muted, #64748b)' }}>
            Selected: {countryOptions.find((o) => o.value === selected)?.label}
          </p>
        )}
      </div>
    );
  },
};
