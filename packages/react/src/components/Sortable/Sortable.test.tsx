import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
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

// jsdom has no layout: items stack 40px apart in 280px-wide columns 300px apart.
function mockLayout() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const section = this.closest('section');
    const left = section ? [...document.querySelectorAll('section')].indexOf(section) * 300 : 0;
    const item = this.matches('[data-nx-reorder-item]');
    const top = item ? [...this.parentElement!.children].indexOf(this) * 40 : 0;
    const height = item ? 36 : 200;
    return { left, top, right: left + 280, bottom: top + height, width: 280, height, x: left, y: top, toJSON: () => ({}) };
  });
}
const press = (el: Element, x: number, y: number) => fireEvent.pointerDown(el, { button: 0, pointerId: 1, clientX: x, clientY: y });
const drag = (el: Element, x: number, y: number) => fireEvent.pointerMove(el, { pointerId: 1, clientX: x, clientY: y });

afterEach(() => vi.restoreAllMocks());

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

  it('Sortable: pointer drag shows the drop line, reorders and announces', () => {
    mockLayout();
    render(<List />);
    const grip = screen.getByRole('button', { name: 'Move Charlie' });
    press(grip, 10, 90);
    drag(grip, 10, 10);
    expect(screen.getByText('Alpha').closest('li')).toHaveAttribute('data-nx-drop', 'before');
    expect(grip.closest('li')).toHaveAttribute('data-nx-dragging');
    fireEvent.pointerUp(grip, { pointerId: 1 });
    expect(order()).toEqual(['Charlie', 'Alpha', 'Bravo']);
    expect(screen.getByText('Charlie moved to position 1 of 3')).toBeInTheDocument();
    expect(document.querySelector('[data-nx-drop], [data-nx-dragging]')).toBeNull();
  });

  it('Sortable: Escape and pointercancel cancel a drag; a press under the threshold does nothing', () => {
    mockLayout();
    const onReorder = vi.fn();
    render(
      <Sortable items={tasks} getId={(t) => t.id} getLabel={(t) => t.title} onReorder={onReorder}>
        {(t) => t.title}
      </Sortable>,
    );
    const grip = screen.getByRole('button', { name: 'Move Alpha' });
    press(grip, 10, 10);
    drag(grip, 10, 100);
    fireEvent.keyDown(grip, { key: 'Escape' });
    expect(document.querySelector('[data-nx-drop]')).toBeNull();
    fireEvent.pointerUp(grip, { pointerId: 1 });

    press(grip, 10, 10);
    drag(grip, 10, 100);
    fireEvent.pointerCancel(grip, { pointerId: 1 });

    press(grip, 10, 10);
    drag(grip, 12, 11);
    fireEvent.pointerUp(grip, { pointerId: 1 });
    expect(onReorder).not.toHaveBeenCalled();
    expect(order()).toEqual(['Alpha', 'Bravo', 'Charlie']);
  });

  it('Sortable: unmounting mid-drag cancels it and removes the key listener (8.4 hook deps)', () => {
    mockLayout();
    const { unmount } = render(<List />);
    const grip = screen.getByRole('button', { name: 'Move Charlie' });
    press(grip, 10, 90);
    drag(grip, 10, 10);
    const remove = vi.spyOn(window, 'removeEventListener');
    unmount();
    expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function), true);
  });

  it('Kanban: pointer drag moves a card into an empty column', () => {
    mockLayout();
    function Board() {
      const [cols, setCols] = React.useState<KanbanColumn<Task>[]>([
        { id: 'todo', title: 'To do', items: tasks },
        { id: 'done', title: 'Done', items: [] },
      ]);
      return <Kanban columns={cols} getId={(t) => t.id} getLabel={(t) => t.title} onChange={setCols} renderCard={(t) => t.title} />;
    }
    render(<Board />);
    const grip = screen.getByRole('button', { name: 'Move Alpha' });
    press(grip, 10, 10);
    drag(grip, 400, 50);
    const done = screen.getByRole('region', { name: /Done/ });
    expect(done.querySelector('ul')).toHaveAttribute('data-nx-drop', 'inside');
    fireEvent.pointerUp(grip, { pointerId: 1 });
    expect(done).toHaveTextContent('Alpha');
    expect(screen.getByText('Alpha moved to Done, position 1 of 1')).toBeInTheDocument();
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
    // A second move reads the reordered data, not the first render's (8.4 hook deps).
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
    expect(screen.getAllByRole('cell').map((c) => c.textContent).filter(Boolean)).toEqual(['Charlie', 'Alpha', 'Bravo']);
  });
});
