import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FilterBuilder, type FilterGroup } from './FilterBuilder.js';

const meta: Meta = {
  title: 'Components/FilterBuilder',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const fields = [
  { id: 'name', label: 'Deal name', type: 'text' as const },
  { id: 'amount', label: 'Amount', type: 'number' as const },
  { id: 'stage', label: 'Stage', type: 'select' as const, options: [{ value: 'won', label: 'Won' }, { value: 'lost', label: 'Lost' }] },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<FilterGroup>({
      id: 'root',
      combinator: 'and',
      rules: [
        { id: 'a', field: 'stage', operator: 'equals', value: 'won' },
        { id: 'g', combinator: 'or', rules: [{ id: 'b', field: 'amount', operator: 'greaterThan', value: '10000' }, { id: 'c', field: 'name', operator: 'contains', value: 'Acme' }] },
      ],
    });
    return (
      <div style={{ maxWidth: 640 }}>
        <FilterBuilder fields={fields} value={value} onValueChange={setValue} />
      </div>
    );
  },
};
