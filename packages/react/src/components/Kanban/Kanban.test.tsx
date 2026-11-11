import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Kanban, type KanbanColumn } from './Kanban.js';

// Pointer drag and Alt+ArrowRight live in Sortable.test.tsx (shared reorder hook).
type Task = { id: string; title: string };
const start: KanbanColumn<Task>[] = [
  { id: 'todo', title: 'To do', items: [{ id: 'a', title: 'Alpha' }, { id: 'b', title: 'Bravo' }] },
  { id: 'done', title: 'Done', items: [{ id: 'c', title: 'Charlie' }] },
];

function Board({ onChange }: { onChange?: (c: KanbanColumn<Task>[]) => void }) {
  const [cols, setCols] = React.useState(start);
  return (
    <Kanban
      columns={cols}
      getId={(t) => t.id}
      getLabel={(t) => t.title}
      onChange={(next) => {
        onChange?.(next);
        setCols(next);
      }}
      renderCard={(t) => <strong>{t.title}</strong>}
    />
  );
}

const cards = (column: string) =>
  within(screen.getByRole('region', { name: new RegExp(column) })).queryAllByRole('listitem').map((li) => li.textContent);

describe('Kanban', () => {
  it('each column is a region named by its title, with a count and rendered cards', () => {
    render(<Board />);
    const todo = screen.getByRole('region', { name: /To do/ });
    expect(within(todo).getByRole('heading', { level: 3 })).toHaveTextContent('To do2');
    expect(within(todo).getByText('Alpha').tagName).toBe('STRONG');
    expect(cards('Done')).toEqual(['Charlie']);
  });

  it('Alt+ArrowDown/Up reorders within a column and keeps the column ids', async () => {
    const onChange = vi.fn();
    render(<Board onChange={onChange} />);
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(cards('To do')).toEqual(['Bravo', 'Alpha']);
    expect(onChange.mock.calls[0]![0].map((c: KanbanColumn<Task>) => c.id)).toEqual(['todo', 'done']);
    expect(screen.getByRole('button', { name: 'Move Alpha' })).toHaveFocus();
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
    expect(cards('To do')).toEqual(['Alpha', 'Bravo']);
  });

  it('Alt+ArrowLeft moves a card back a column and announces it', async () => {
    render(<Board />);
    screen.getByRole('button', { name: 'Move Charlie' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowLeft}{/Alt}');
    expect(cards('Done')).toEqual([]);
    expect(cards('To do')).toContain('Charlie');
    expect(screen.getByText(/Charlie moved to To do/)).toBeInTheDocument();
  });

  it('plain arrows do not move cards', async () => {
    const onChange = vi.fn();
    render(<Board onChange={onChange} />);
    screen.getByRole('button', { name: 'Move Alpha' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).not.toHaveBeenCalled();
  });
});
