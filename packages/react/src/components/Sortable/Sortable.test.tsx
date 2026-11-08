import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Sortable } from './Sortable.js';
import { Kanban, type KanbanColumn } from '../Kanban/Kanban.js';
import { DataTable } from '../DataTable/DataTable.js';
import { moveItem } from './reorder.js';

type Task = { id: string; title: string };
const tasks: Task[] = [
  { id: 'a', title: 'Alpha' },
  { id: 'b', title: 'Bravo' },
  { id: 'c', title: 'Charlie' },
];

function List() {
  const [items, setItems] = React.useState(tasks);
  return (
    <Sortable aria-label="Priorities" items={items} getId={(t) => t.id} getLabel={(t) => t.title} onReorder={setItems}>
      {(t) => t.title}
    </Sortable>
  );
}

const order = () => screen.getAllByRole('listitem').map((li) => li.textContent);

describe('reorder', () => {
  it('moveItem moves within and across lists', () => {
    expect(moveItem([[1, 2, 3]], [0, 0], [0, 2])).toEqual([[2, 3, 1]]);
    expect(moveItem([[1, 2], [3]], [0, 1], [1, 0])).toEqual([[1], [2, 3]]);
  });

  it('Sortable: Alt+Arrow moves, keeps focus on the handle, and announces', async () => {
    render(<List />);
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{ArrowDown}{/Alt}');
    expect(order()).toEqual(['Bravo', 'Charlie', 'Alpha']);
    expect(screen.getByRole('button', { name: 'Move Alpha' })).toHaveFocus();
    expect(screen.getByText('Alpha moved to position 3 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move Alpha' })).toHaveAccessibleDescription('Alt+Arrow keys move it');
  });

  it('Sortable: drag and drop with the native events', () => {
    render(<List />);
    const [first, , third] = screen.getAllByRole('listitem');
    const dataTransfer = { effectAllowed: '' };
    fireEvent.dragStart(third!, { dataTransfer });
    fireEvent.dragOver(first!, { dataTransfer });
    fireEvent.drop(first!, { dataTransfer });
    expect(order()).toEqual(['Charlie', 'Alpha', 'Bravo']);
  });

  it('Kanban: Alt+ArrowRight moves a card to the next column', async () => {
    function Board() {
      const [cols, setCols] = React.useState<KanbanColumn<Task>[]>([
        { id: 'todo', title: 'To do', items: tasks.slice(0, 2) },
        { id: 'done', title: 'Done', items: tasks.slice(2) },
      ]);
      return <Kanban columns={cols} getId={(t) => t.id} getLabel={(t) => t.title} onChange={setCols} renderCard={(t) => t.title} />;
    }
    render(<Board />);
    screen.getByRole('button', { name: 'Move Bravo' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(screen.getByRole('region', { name: /Done/ })).toHaveTextContent('Bravo');
    expect(screen.getByText('Bravo moved to Done, position 2 of 2')).toBeInTheDocument();
  });

  it('DataTable: onRowOrderChange adds row handles', async () => {
    function Table() {
      const [data, setData] = React.useState(tasks);
      return (
        <DataTable<Task>
          caption="Tasks"
          columns={[{ accessorKey: 'title', header: 'Title' }]}
          data={data}
          getRowId={(t) => t.id}
          getRowLabel={(t) => t.title}
          onRowOrderChange={setData}
        />
      );
    }
    render(<Table />);
    screen.getByRole('button', { name: 'Move Charlie' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
    const cells = screen.getAllByRole('cell').map((c) => c.textContent).filter(Boolean);
    expect(cells).toEqual(['Alpha', 'Charlie', 'Bravo']);
    expect(screen.getByRole('button', { name: 'Move Charlie' })).toHaveFocus();
  });
});
