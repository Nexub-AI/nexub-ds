import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from '../components/Combobox/Combobox.js';
import { DataTable, type DataTableColumn } from '../components/DataTable/DataTable.js';
import { Kanban } from '../components/Kanban/Kanban.js';
import { SearchInput } from '../components/SearchInput/SearchInput.js';

// Large-data surfaces for the interaction-latency tripwire (visual/perf.spec.ts).
// Sizes default small so visual baselines stay light; the perf spec opens them
// with `&args=size:1000` (or similar).
const meta: Meta<{ size: number }> = { title: 'Perf/Large data', argTypes: { size: { control: 'number' } } };
export default meta;
type Story = StoryObj<typeof meta>;

interface Row {
  id: string;
  name: string;
  email: string;
  team: string;
}
const teams = ['Billing', 'Growth', 'Platform', 'Support'];
const makeRows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({
    id: String(i),
    name: `Person ${i + 1}`,
    email: `person${i + 1}@example.com`,
    team: teams[i % teams.length]!,
  }));
const columns: DataTableColumn<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'team', header: 'Team' },
];

const Table = React.memo(function Table({ rows, query }: { rows: Row[]; query: string }) {
  const q = query.toLowerCase();
  const data = React.useMemo(() => rows.filter((r) => r.name.toLowerCase().includes(q)), [rows, q]);
  return <DataTable caption="People" captionHidden columns={columns} data={data} getRowId={(r) => r.id} enableSorting />;
});

/** Filtering a big table from a deferred query: the search field never waits for the rows. */
export const DataTableFilter: Story = {
  args: { size: 12 },
  render: function Render({ size }) {
    const rows = React.useMemo(() => makeRows(Number(size)), [size]);
    const [search, setSearch] = React.useState('');
    const query = React.useDeferredValue(search);
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <SearchInput aria-label="Filter people" value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} />
        <Table rows={rows} query={query} />
      </div>
    );
  },
};

export const ComboboxOptions: Story = {
  args: { size: 12 },
  render: ({ size }) => (
    <div style={{ width: 280, maxWidth: '100%' }}>
      <Combobox.Root>
        <Combobox.Input placeholder="Search options…" aria-label="Search options" />
        <Combobox.List>
          <Combobox.Empty>No match.</Combobox.Empty>
          {Array.from({ length: Number(size) }, (_, i) => (
            <Combobox.Item key={i} value={`Option ${i + 1}`}>
              Option {i + 1}
            </Combobox.Item>
          ))}
        </Combobox.List>
      </Combobox.Root>
    </div>
  ),
};

type Card = { id: string; title: string };
export const KanbanBoard: Story = {
  args: { size: 6 },
  render: function Render({ size }) {
    const [columns, setColumns] = React.useState(() =>
      ['To do', 'Doing', 'Done'].map((title, c) => ({
        id: title,
        title,
        items: Array.from({ length: Math.ceil(Number(size) / 3) }, (_, i): Card => ({ id: `${c}-${i}`, title: `Task ${c * 1000 + i + 1}` })),
      })),
    );
    return <Kanban columns={columns} getId={(c) => c.id} getLabel={(c) => c.title} onChange={setColumns} renderCard={(c) => c.title} />;
  },
};
