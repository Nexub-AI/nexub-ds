import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SavedViews } from './SavedViews.js';

const views = [
  { id: 'mine', name: 'My open deals' },
  { id: 'big', name: 'Over $10k' },
];

describe('SavedViews', () => {
  it('shows the active view, selects, updates and deletes', async () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    render(<SavedViews views={views} activeId="mine" onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete} />);
    const trigger = screen.getByRole('button', { name: 'My open deals' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Over $10k' }));
    expect(onSelect).toHaveBeenCalledWith('big');
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Update “My open deals”' }));
    expect(onUpdate).toHaveBeenCalledWith('mine');
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Delete “My open deals”' }));
    expect(onDelete).toHaveBeenCalledWith('mine');
  });

  it('saves a new view by name', async () => {
    const onSave = vi.fn();
    render(<SavedViews views={[]} onSelect={() => {}} onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: 'Views' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Save as new view…' }));
    const dialog = screen.getByRole('dialog', { name: 'Save as new view' });
    expect(dialog).toBeInTheDocument();
    await userEvent.type(screen.getByRole('textbox', { name: 'View name' }), 'Overdue{Enter}');
    expect(onSave).toHaveBeenCalledWith('Overdue');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
