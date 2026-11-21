import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { Sortable, type SortableList } from './Sortable.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';
import { Kanban, type KanbanColumn } from '../Kanban/Kanban.js';
import { DataTable } from '../DataTable/DataTable.js';
import { moveItem, useReorder } from './reorder.js';

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

  it('moveItem with isLocked: locked items keep their index, others flow around them', () => {
    const locked = (n: number) => n === 0 || n === 9;
    // 1 moves to the end, past the locked 9; nothing lands above the locked first item.
    expect(moveItem([[0, 1, 9, 3, 4]], [0, 1], [0, 4], locked)).toEqual([[0, 3, 9, 4, 1]]);
    expect(moveItem([[0, 1, 2]], [0, 2], [0, 0], locked)).toEqual([[0, 2, 1]]);
    // Across lists, the target's locked first item stays first.
    expect(moveItem([[1], [0, 2]], [0, 0], [1, 0], locked)).toEqual([[], [0, 1, 2]]);
  });
});

describe('Sortable 11.4', () => {
  const words = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];

  function Controlled<T>(props: { initial: T[]; label: (t: T) => string } & Record<string, unknown>) {
    const { initial, label, ...rest } = props;
    const [items, setItems] = React.useState(initial);
    return (
      <Sortable aria-label="Items" items={items} getLabel={label} onReorder={setItems} {...rest}>
        {(t) => label(t)}
      </Sortable>
    );
  }

  // A 3-column grid: cells 100 wide and 40 tall, 110 / 50 apart.
  function mockGrid() {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const item = this.matches('[data-nx-reorder-item]');
      const i = item ? [...this.parentElement!.children].indexOf(this) : 0;
      const [left, top] = item ? [(i % 3) * 110, Math.floor(i / 3) * 50] : [0, 0];
      const [width, height] = item ? [100, 40] : [330, 200];
      return { left, top, right: left + width, bottom: top + height, width, height, x: left, y: top, toJSON: () => ({}) };
    });
  }

  it('works without ids (strings and id-less objects) and keeps each row’s element through a move', async () => {
    render(<Controlled initial={words.slice(0, 3)} label={(w: string) => w} />);
    const alpha = screen.getByText('Alpha').closest('li');
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(order()).toEqual(['Bravo', 'Alpha', 'Charlie']);
    expect(screen.getByText('Alpha').closest('li')).toBe(alpha);

    const objs = words.slice(0, 3).map((name) => ({ name }));
    render(<Controlled initial={objs} label={(o: { name: string }) => o.name} aria-label="Objects" />);
    const list = screen.getByRole('list', { name: 'Objects' });
    const bravo = screen.getAllByText('Bravo')[1]!.closest('li');
    screen.getAllByRole('button', { name: 'Move Bravo' })[1]!.focus();
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
    expect([...list.children].map((li) => li.textContent)).toEqual(['Bravo', 'Alpha', 'Charlie']);
    expect(screen.getAllByText('Bravo')[1]!.closest('li')).toBe(bravo);
  });

  it('disabled: every handle is off and nothing moves', async () => {
    const onReorder = vi.fn();
    render(
      <Sortable items={words.slice(0, 3)} getLabel={(w) => w} onReorder={onReorder} disabled>
        {(w) => w}
      </Sortable>,
    );
    screen.getAllByRole('button').forEach((b) => expect(b).toBeDisabled());
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('isLocked: a locked first item stays first, by keyboard and by drag', async () => {
    mockLayout();
    render(<Controlled initial={words.slice(0, 4)} label={(w: string) => w} isLocked={(w: string) => w === 'Alpha'} />);
    expect(screen.getByRole('button', { name: 'Alpha is locked' })).toBeDisabled();
    screen.getByRole('button', { name: 'Move Bravo' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
    expect(order()).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);

    const grip = screen.getByRole('button', { name: 'Move Delta' });
    press(grip, 10, 130);
    drag(grip, 10, 5); // above Alpha
    expect(screen.getByText('Bravo').closest('li')).toHaveAttribute('data-nx-drop', 'before'); // the line shows where it lands
    fireEvent.pointerUp(grip, { pointerId: 1 });
    expect(order()).toEqual(['Alpha', 'Delta', 'Bravo', 'Charlie']);
  });

  it('isLocked: keyboard moves skip over a locked item in the middle', async () => {
    render(<Controlled initial={words.slice(0, 4)} label={(w: string) => w} isLocked={(w: string) => w === 'Charlie'} />);
    screen.getByRole('button', { name: 'Move Bravo' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(order()).toEqual(['Alpha', 'Delta', 'Charlie', 'Bravo']);
    expect(screen.getByText('Bravo moved to position 4 of 4')).toBeInTheDocument();
  });

  it('layout="grid": arrows move by one cell or one row, and the drop line follows the pointer across a row', async () => {
    mockGrid();
    render(<Controlled initial={words} label={(w: string) => w} layout="grid" />);
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(order()).toEqual(['Bravo', 'Charlie', 'Delta', 'Alpha', 'Echo']);
    expect(screen.getByText('Alpha moved to position 4 of 5')).toBeInTheDocument();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(order()).toEqual(['Bravo', 'Charlie', 'Delta', 'Echo', 'Alpha']);
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
    expect(order()).toEqual(['Bravo', 'Alpha', 'Charlie', 'Delta', 'Echo']);

    const grip = screen.getByRole('button', { name: 'Move Echo' });
    press(grip, 120, 60);
    drag(grip, 20, 20); // left half of the first cell
    expect(screen.getByText('Bravo').closest('li')).toHaveAttribute('data-nx-drop', 'before');
    fireEvent.pointerUp(grip, { pointerId: 1 });
    expect(order()).toEqual(['Echo', 'Bravo', 'Alpha', 'Charlie', 'Delta']);
  });

  it('layout="grid" in RTL: ArrowLeft moves forward', async () => {
    mockGrid();
    render(
      <NexubProvider dir="rtl">
        <Controlled initial={words.slice(0, 3)} label={(w: string) => w} layout="grid" />
      </NexubProvider>,
    );
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowLeft}{/Alt}');
    expect(order()).toEqual(['Bravo', 'Alpha', 'Charlie']);
  });

  it('grid, flat, locked and disabled lists have no axe violations', async () => {
    const { baseElement } = render(
      <>
        <Controlled initial={words} label={(w: string) => w} layout="grid" isLocked={(w: string) => w === 'Alpha'} />
        <Controlled initial={words} label={(w: string) => w} variant="flat" disabled aria-label="Flat" />
      </>,
    );
    const { violations } = await axe.run(baseElement, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
  });

  it('variant="flat" drops the card chrome', () => {
    render(<Controlled initial={words.slice(0, 2)} label={(w: string) => w} variant="flat" />);
    expect(screen.getAllByRole('listitem')[0]!.className).not.toMatch(/\bborder\b/);
  });

  it('Sortable.Group: items move between lists, including into an empty one', async () => {
    function Group() {
      const [lists, setLists] = React.useState<SortableList<string>[]>([
        { id: 'backlog', label: 'Backlog', items: ['Alpha', 'Bravo'] },
        { id: 'sprint', label: 'Sprint', items: [] },
      ]);
      return (
        <Sortable.Group lists={lists} onChange={setLists} getLabel={(w) => w}>
          <Sortable<string> list="backlog">{(w) => w}</Sortable>
          <Sortable<string> list="sprint">{(w) => w}</Sortable>
        </Sortable.Group>
      );
    }
    render(<Group />);
    screen.getByRole('button', { name: 'Move Bravo' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(screen.getByRole('list', { name: 'Sprint' })).toHaveTextContent('Bravo');
    expect(screen.getByText('Bravo moved to Sprint, position 1 of 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move Bravo' })).toHaveFocus();
  });
});

describe('useReorder canMove', () => {
  // Two lists; nothing may enter list 1 at its top.
  function Host({ onMove }: { onMove: (next: string[][]) => void }) {
    const [lists, setLists] = React.useState([['Alpha', 'Bravo'], ['Charlie']]);
    const { itemProps, listProps, handle, live } = useReorder({
      lists,
      getId: (w) => w,
      getLabel: (w) => w,
      canMove: (_from, [l, i]) => !(l === 1 && i === 0),
      onMove: (next) => (onMove(next), setLists(next)),
    });
    return (
      <>
        {lists.map((items, l) => (
          <section key={l}>
            <ul {...listProps(l)}>
              {items.map((w, i) => (
                <li key={w} {...itemProps([l, i])}>
                  {handle([l, i])}
                  {w}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {live}
      </>
    );
  }

  it('refuses a keyboard move with an announcement; a refused drag shows no line and snaps back', async () => {
    mockLayout();
    const onMove = vi.fn();
    render(<Host onMove={onMove} />);
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(screen.getByText("Can't move here")).toBeInTheDocument();
    expect(onMove).not.toHaveBeenCalled();

    const grip = screen.getByRole('button', { name: 'Move Bravo' });
    press(grip, 10, 50);
    drag(grip, 310, 5); // above Charlie: refused
    expect(document.querySelector('[data-nx-drop]')).toBeNull();
    fireEvent.pointerUp(grip, { pointerId: 1 });
    expect(onMove).not.toHaveBeenCalled();

    press(grip, 10, 50);
    drag(grip, 310, 35); // below Charlie: allowed
    expect(screen.getByText('Charlie').closest('li')).toHaveAttribute('data-nx-drop', 'after');
    fireEvent.pointerUp(grip, { pointerId: 1 });
    expect(onMove).toHaveBeenCalledWith([['Alpha'], ['Charlie', 'Bravo']]);
  });
});
