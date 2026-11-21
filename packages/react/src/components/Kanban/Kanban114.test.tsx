import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Kanban, type KanbanColumn, type KanbanMove, type KanbanProps } from './Kanban.js';

type Task = { id: string; title: string; owner?: string; priority?: 'high' };
const start: KanbanColumn<Task>[] = [
  { id: 'todo', title: 'To do', items: [{ id: 'a', title: 'Alpha', owner: 'ana', priority: 'high' }, { id: 'b', title: 'Bravo', owner: 'ben' }] },
  { id: 'doing', title: 'Doing', items: [] },
  { id: 'done', title: 'Done', items: [{ id: 'c', title: 'Charlie', owner: 'ana' }] },
];

function Board(props: Partial<KanbanProps<Task>> & { onMove?: (m: KanbanMove<Task>) => void }) {
  const [cols, setCols] = React.useState(start);
  const { onMove, ...rest } = props;
  return (
    <Kanban
      columns={cols}
      getId={(t) => t.id}
      getLabel={(t) => t.title}
      onChange={(next, move) => {
        onMove?.(move);
        setCols(next);
      }}
      renderCard={(t) => <span>{t.title}</span>}
      {...rest}
    />
  );
}

const titles = (region: HTMLElement) => within(region).queryAllByRole('listitem').map((li) => li.textContent);

describe('Kanban (11.4)', () => {
  it('readOnly shows no drag handles', () => {
    render(<Board readOnly />);
    expect(screen.queryByRole('button', { name: /^Move/ })).not.toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('onChange names the card and where it moved', async () => {
    const onMove = vi.fn();
    render(<Board onMove={onMove} />);
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ item: expect.objectContaining({ id: 'a' }), from: { columnId: 'todo', laneId: undefined }, to: { columnId: 'doing', laneId: undefined } }));
  });

  it('canMove refuses a move before it lands', async () => {
    const onMove = vi.fn();
    render(<Board onMove={onMove} canMove={({ to }) => to.columnId !== 'doing'} />);
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(onMove).not.toHaveBeenCalled();
    expect(titles(screen.getByRole('region', { name: /To do/ }))).toEqual(['Alpha', 'Bravo']);
  });

  it('a card dropped on a drop target leaves the board and calls onDrop', async () => {
    const onDrop = vi.fn();
    render(<Board dropTargets={[{ id: 'archive', label: 'Archive', onDrop }]} />);
    expect(screen.getByRole('region', { name: 'Archive' })).toBeInTheDocument();
    screen.getByRole('button', { name: 'Move Charlie' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(onDrop).toHaveBeenCalledWith(expect.objectContaining({ id: 'c' }), { columnId: 'done', laneId: undefined });
    expect(titles(screen.getByRole('region', { name: /^Done/ }))).toEqual([]);
  });

  it('custom column headers, footers, tones and width', () => {
    const { container } = render(
      <Board
        columnWidth="sm"
        renderColumnHeader={(c, count) => <span>{`${c.title} · ${count} of 3`}</span>}
        renderColumnFooter={(c) => <button type="button">{`Add to ${c.title}`}</button>}
        getTone={(t) => (t.priority === 'high' ? 'danger' : undefined)}
      />,
    );
    expect(screen.getByRole('heading', { name: 'To do · 2 of 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to Doing' })).toBeInTheDocument();
    expect(container.querySelector('[data-tone="danger"]')).toHaveTextContent('Alpha');
    expect(container.querySelector('[data-column="todo"]')).toHaveClass('w-60');
  });

  it('swimlanes place cards by lane, and a move between lanes reports the new lane', async () => {
    const onMove = vi.fn();
    render(
      <Board
        onMove={onMove}
        lanes={[{ id: 'ana', title: 'Ana' }, { id: 'ben', title: 'Ben' }]}
        getLane={(t) => t.owner}
      />,
    );
    const ana = screen.getByRole('group', { name: 'Ana' });
    const ben = screen.getByRole('group', { name: 'Ben' });
    expect(titles(within(ana).getByRole('region', { name: /To do/ }))).toEqual(['Alpha']);
    expect(titles(within(ben).getByRole('region', { name: /To do/ }))).toEqual(['Bravo']);
    expect(titles(within(ana).getByRole('region', { name: /^Done/ }))).toEqual(['Charlie']);
    within(ana).getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ from: { columnId: 'todo', laneId: 'ana' }, to: { columnId: 'doing', laneId: 'ana' } }));
  });
});
