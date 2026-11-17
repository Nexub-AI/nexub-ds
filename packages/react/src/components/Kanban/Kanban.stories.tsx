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
