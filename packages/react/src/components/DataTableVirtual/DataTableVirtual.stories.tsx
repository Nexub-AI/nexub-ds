import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import type { DataTableColumn } from '../DataTable/DataTable.js';
import { DataTableVirtual } from './DataTableVirtual.js';
import { ErrorState } from '../ErrorState/ErrorState.js';

const meta: Meta = {
  title: 'Data Display/DataTableVirtual',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

interface Row {
  id: number;
  name: string;
  amount: number;
}

const columns: DataTableColumn<Row>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'amount', header: 'Amount', meta: { align: 'end' } },
];

// Deterministic data; a fixed maxHeight keeps the rendered window identical per run.
const data: Row[] = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, name: `Account ${i + 1}`, amount: (i * 37) % 1000 }));

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <DataTableVirtual caption="Accounts" captionHidden columns={columns} data={data} maxHeight={320} enableSorting />
    </div>
  ),
};

const stateColumns = columns.slice(1);

export const DataStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <DataTableVirtual caption="Accounts, loading" captionHidden columns={stateColumns} data={[]} maxHeight={320} loading />
      <DataTableVirtual caption="Accounts, empty" captionHidden columns={stateColumns} data={[]} maxHeight={320} />
      <DataTableVirtual
        caption="Accounts, failed"
        captionHidden
        columns={stateColumns}
        data={[]}
        maxHeight={320}
        errorState={<ErrorState className="py-4" title="Could not load accounts" onRetry={() => {}} />}
      />
    </div>
  ),
};
