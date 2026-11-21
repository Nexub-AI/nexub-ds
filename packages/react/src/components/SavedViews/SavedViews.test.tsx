import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('SavedViews sheet (10.6)', () => {
  it('the menu is sheet="auto" by default (11.0); sheet={false} turns it off', async () => {
    const { unmount } = render(<SavedViews views={[{ id: 'a', name: 'Alpha' }]} onSelect={() => {}} />);
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByRole('menu')).toHaveAttribute('data-nx-sheet', 'auto');
    unmount();
    render(<SavedViews views={[{ id: 'a', name: 'Alpha' }]} onSelect={() => {}} sheet={false} />);
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByRole('menu')).not.toHaveAttribute('data-nx-sheet');
  });

  it('passes sheet to the menu', async () => {
    render(<SavedViews views={[{ id: 'a', name: 'Alpha' }]} onSelect={() => {}} sheet="auto" />);
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByRole('menu')).toHaveAttribute('data-nx-sheet', 'auto');
  });
});

describe('SavedViews 11.5', () => {
  it('a promise from onSave keeps the dialog busy; a rejection shows its message', async () => {
    let reject!: (e: Error) => void;
    const onSave = vi.fn(() => new Promise<void>((_, r) => (reject = r)));
    render(<SavedViews views={[]} onSelect={() => {}} onSave={onSave} maxLength={10} />);
    await userEvent.click(screen.getByRole('button', { name: 'Views' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Save as new view…' }));
    const input = screen.getByRole('textbox', { name: 'View name' });
    expect(input).toHaveAttribute('maxlength', '10');
    await userEvent.type(input, 'Overdue{Enter}');
    expect(onSave).toHaveBeenCalledWith('Overdue');
    expect(screen.getByRole('dialog').querySelector('form')).toHaveAttribute('aria-busy', 'true');
    reject(new Error('Name taken'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Name taken');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renames the active view', async () => {
    const onRename = vi.fn(() => Promise.resolve());
    render(<SavedViews views={views} activeId="mine" onSelect={() => {}} onRename={onRename} />);
    await userEvent.click(screen.getByRole('button', { name: 'My open deals' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Rename “My open deals”' }));
    const input = screen.getByRole('textbox', { name: 'View name' });
    expect(input).toHaveValue('My open deals');
    await userEvent.clear(input);
    await userEvent.type(input, 'Mine{Enter}');
    expect(onRename).toHaveBeenCalledWith('mine', 'Mine');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('confirmDelete asks in an AlertDialog before deleting', async () => {
    const onDelete = vi.fn(() => Promise.resolve());
    render(<SavedViews views={views} activeId="big" onSelect={() => {}} onDelete={onDelete} confirmDelete />);
    await userEvent.click(screen.getByRole('button', { name: 'Over $10k' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Delete “Over $10k”' }));
    expect(onDelete).not.toHaveBeenCalled();
    const dialog = screen.getByRole('alertdialog', { name: 'Delete “Over $10k”?' });
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith('big');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  });

  it('a rejected onDelete without confirm shows the error beside the menu', async () => {
    const onDelete = vi.fn(() => Promise.reject(new Error('Offline')));
    render(<SavedViews views={views} activeId="big" onSelect={() => {}} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: 'Over $10k' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Delete “Over $10k”' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Offline');
  });

  it('defaultView is tagged and applied once when nothing is active', async () => {
    const onSelect = vi.fn();
    render(<SavedViews views={views} defaultView="big" onSelect={onSelect} />);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('big');
    await userEvent.click(screen.getByRole('button', { name: 'Over $10k' }));
    expect(screen.getByRole('menuitemradio', { name: /Over \$10k\s*Default/ })).toHaveAttribute('aria-checked', 'true');
  });

  it('defaultView is not applied over an activeId', () => {
    const onSelect = vi.fn();
    render(<SavedViews views={views} activeId="mine" defaultView="big" onSelect={onSelect} />);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
