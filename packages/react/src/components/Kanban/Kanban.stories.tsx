import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Kanban, type KanbanColumn } from './Kanban.js';
import { Sortable } from '../Sortable/Sortable.js';
import { ErrorState } from '../ErrorState/ErrorState.js';

const meta: Meta = {
  title: 'Components/Kanban',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

type Card = { id: string; title: string };

function Board() {
  const [columns, setColumns] = React.useState<KanbanColumn<Card>[]>([
    { id: 'todo', title: 'To do', items: [{ id: '1', title: 'Write release notes' }, { id: '2', title: 'Update pricing page' }] },
    { id: 'doing', title: 'In progress', items: [{ id: '3', title: 'Billing migration' }] },
    { id: 'done', title: 'Done', items: [] },
  ]);
  return <Kanban columns={columns} getId={(c) => c.id} getLabel={(c) => c.title} onChange={setColumns} renderCard={(c) => c.title} />;
}

function List() {
  const [items, setItems] = React.useState(['Revenue', 'Active users', 'Churn']);
  return (
    <Sortable aria-label="Dashboard widgets" items={items} getId={(i) => i} getLabel={(i) => i} onReorder={setItems} className="max-w-sm">
      {(i) => i}
    </Sortable>
  );
}

export const Board_: Story = { name: 'Board', render: () => <Board /> };
export const SortableList: Story = { render: () => <List /> };

const noCards: KanbanColumn<Card>[] = [
  { id: 'todo', title: 'To do', items: [] },
  { id: 'done', title: 'Done', items: [] },
];
const board = { getId: (c: Card) => c.id, getLabel: (c: Card) => c.title, onChange: () => {}, renderCard: (c: Card) => c.title };

export const DataStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Kanban {...board} columns={noCards} loading />
      <Kanban {...board} columns={noCards} />
      <Kanban {...board} columns={noCards} errorState={<ErrorState className="py-4" title="Could not load the board" onRetry={() => {}} />} />
    </div>
  ),
};

type Ticket = { id: string; title: string; owner: string; priority?: 'high' };
const ticketColumns: KanbanColumn<Ticket>[] = [
  { id: 'todo', title: 'To do', items: [{ id: 't1', title: 'Renew SSL certificate', owner: 'ana', priority: 'high' }, { id: 't2', title: 'Update pricing page', owner: 'ben' }] },
  { id: 'doing', title: 'Doing', items: [{ id: 't3', title: 'Migrate invoices', owner: 'ana' }] },
  { id: 'done', title: 'Done', items: [{ id: 't4', title: 'Onboard Acme', owner: 'ben' }] },
];

/** 11.4: swimlanes, a WIP limit through canMove, header and footer slots, card tones, and an Archive drop area. */
export const Workflow: Story = {
  render: () => {
    const [cols, setCols] = React.useState(ticketColumns);
    const [archived, setArchived] = React.useState<string[]>([]);
    const WIP = 2;
    return (
      <div className="flex flex-col gap-2">
        <Kanban
          columns={cols}
          getId={(t) => t.id}
          getLabel={(t) => t.title}
          lanes={[{ id: 'ana', title: 'Ana' }, { id: 'ben', title: 'Ben' }]}
          getLane={(t) => t.owner}
          onChange={(next, move) =>
            setCols(next.map((c) => ({ ...c, items: c.items.map((t) => (t.id === (move.item as Ticket).id && move.to.laneId ? { ...t, owner: move.to.laneId } : t)) })))
          }
          canMove={({ to }) => to.columnId !== 'doing' || cols.find((c) => c.id === 'doing')!.items.length < WIP}
          renderColumnHeader={(c, count) => (
            <span className="flex w-full items-center justify-between">
              {c.title}
              <span className="text-label-md font-normal text-on-surface-muted">{c.id === 'doing' ? `${count} / ${WIP}` : count}</span>
            </span>
          )}
          renderColumnFooter={(c) => (
            <button type="button" className="rounded-shape-control px-2 py-1 text-start text-label-md text-primary">
              + Add to {c.title}
            </button>
          )}
          getTone={(t) => (t.priority === 'high' ? 'danger' : undefined)}
          columnWidth="sm"
          dropTargets={[{ id: 'archive', label: 'Archive', onDrop: (t) => setArchived((a) => [...a, t.title]) }]}
          renderCard={(t) => (
            <span className="flex flex-col">
              {t.title}
              {t.priority === 'high' && <span className="text-label-sm text-error">High priority</span>}
            </span>
          )}
        />
        <span className="text-body-sm">Archived: {archived.join(', ') || '—'}</span>
      </div>
    );
  },
};

/** 11.4: a read-only board (no handles). */
export const ReadOnly: Story = {
  render: () => <Kanban readOnly columns={ticketColumns} getId={(t) => t.id} getLabel={(t) => t.title} onChange={() => {}} renderCard={(t) => t.title} />,
};
