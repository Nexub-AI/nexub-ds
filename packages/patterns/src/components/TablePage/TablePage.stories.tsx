import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Badge, Button, FilterChip, type DataTableColumn } from '@nexub/react';
import { TablePage } from './TablePage.js';

const meta: Meta = {
  title: 'Patterns/Pages/TablePage',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

interface Project {
  id: string;
  name: string;
  owner: string;
  status: 'Active' | 'Paused';
  budget: string;
}
const projects: Project[] = [
  { id: 'p1', name: 'Northwind renewal', owner: 'Ada Park', status: 'Active', budget: '$18,000' },
  { id: 'p2', name: 'Harbour onboarding', owner: 'Idris Cole', status: 'Active', budget: '$6,400' },
  { id: 'p3', name: 'Lumen audit', owner: 'Mina Sato', status: 'Paused', budget: '$9,200' },
  { id: 'p4', name: 'Tidewater migration', owner: 'Kai Brandt', status: 'Active', budget: '$31,000' },
];
const columns: DataTableColumn<Project>[] = [
  { accessorKey: 'name', header: 'Project' },
  { accessorKey: 'owner', header: 'Owner' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge tone={row.original.status === 'Active' ? 'success' : 'neutral'} variant="soft" dot>
        {row.original.status}
      </Badge>
    ),
  },
  { accessorKey: 'budget', header: 'Budget', meta: { align: 'end' } },
];
const tabs = [
  { id: 'all', label: 'All', count: 4 },
  { id: 'active', label: 'Active', count: 3 },
  { id: 'paused', label: 'Paused', count: 1 },
];
const noop = () => {};

function Demo({ empty }: { empty?: boolean }) {
  const [tab, setTab] = React.useState('all');
  const [query, setQuery] = React.useState(empty ? 'zebra' : '');
  const [mine, setMine] = React.useState(false);
  const data = projects.filter(
    (p) => (tab === 'all' || p.status.toLowerCase() === tab) && p.name.toLowerCase().includes(query.toLowerCase()) && (!mine || p.owner === 'Ada Park'),
  );
  return (
    <TablePage
      as="div"
      title="Projects"
      description="Everything your team has in flight."
      actions={<Button>New project</Button>}
      columns={columns}
      data={data}
      getRowId={(p) => p.id}
      tabs={tabs}
      tab={tab}
      onTabChange={setTab}
      search={{ value: query, onChange: setQuery, placeholder: 'Search projects…' }}
      filters={
        <FilterChip selected={mine} onClick={() => setMine(!mine)}>
          Mine
        </FilterChip>
      }
      activeFilterCount={mine ? 1 : 0}
      onClearFilters={() => {
        setQuery('');
        setMine(false);
      }}
      onRowOpen={noop}
      rowActions={(p) => (
        <Button variant="text" size="sm" aria-label={`Edit ${p.name}`}>
          Edit
        </Button>
      )}
      bulkActions={(rows, clear) => (
        <Button variant="tonal" size="sm" onClick={clear}>
          Archive {rows.length}
        </Button>
      )}
    />
  );
}

/** Segments, search, a filter chip, row and bulk actions. */
export const Default: Story = { render: () => <Demo /> };

/** Nothing matches the search: "no results" with Clear filters. */
export const Empty: Story = { render: () => <Demo empty /> };
