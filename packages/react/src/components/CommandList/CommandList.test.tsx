import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, it, expect, vi } from 'vitest';
import { Dialog } from '../Dialog/Dialog.js';
import { CommandList, type CommandListItem } from './CommandList.js';

const items: CommandListItem[] = [
  {
    value: 'new',
    label: 'New invoice',
    description: 'Create a draft',
    keywords: ['bill'],
    group: 'Actions',
    shortcut: ['⌘', 'N'],
  },
  { value: 'export', label: 'Export CSV', group: 'Actions' },
  { value: 'acme', label: 'Acme Corp', group: 'Customers' },
  { value: 'zeta', label: 'Zeta Holdings', disabled: true, group: 'Customers' },
];

describe('CommandList (11.2)', () => {
  it('renders a focused, named search box and grouped list', () => {
    render(<CommandList label="Jump to" items={items} />);
    const input = screen.getByRole('combobox', { name: 'Jump to' });
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('placeholder', 'Search…');
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('Actions')).toBeInTheDocument();
    expect(within(listbox).getByText('Customers')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Zeta Holdings/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('filters by label, description and keywords; shows the empty text', async () => {
    render(<CommandList items={items} emptyText="Nothing here" />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'bill');
    expect(screen.getByRole('option', { name: /New invoice/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Export CSV/ })).not.toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, 'qqqq');
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('arrow keys, Home and End move the highlight with focus in the input; Enter selects', async () => {
    const onSelect = vi.fn();
    render(<CommandList items={items} onSelect={onSelect} />);
    const input = screen.getByRole('combobox');
    const active = () => document.getElementById(input.getAttribute('aria-activedescendant') ?? '');
    // cmdk highlights the first item on mount; aria-activedescendant follows from the first move.
    expect(screen.getByRole('option', { name: /New invoice/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{ArrowDown}');
    expect(active()).toHaveTextContent('Export CSV');
    await userEvent.keyboard('{End}');
    expect(active()).toHaveTextContent('Acme Corp');
    await userEvent.keyboard('{Home}');
    expect(active()).toHaveTextContent('New invoice');
    expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('export', items[1]);
  });

  it('click selects; disabled items do not', async () => {
    const onSelect = vi.fn();
    render(<CommandList items={items} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('option', { name: /Zeta Holdings/ }));
    expect(onSelect).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('option', { name: /Acme Corp/ }));
    expect(onSelect).toHaveBeenCalledWith('acme', items[2]);
  });

  it('async: onSearch gets the text and the list is not filtered locally; loading sets aria-busy', async () => {
    const onSearch = vi.fn();
    const { rerender } = render(<CommandList items={[]} onSearch={onSearch} loading />);
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    await userEvent.type(screen.getByRole('combobox'), 'acm');
    expect(onSearch).toHaveBeenLastCalledWith('acm');
    rerender(<CommandList items={[{ value: 'z', label: 'Zeta Holdings' }]} onSearch={onSearch} />);
    expect(screen.getByRole('option', { name: 'Zeta Holdings' })).toBeInTheDocument();
  });

  it('autoFocus={false} leaves focus alone', () => {
    render(<CommandList items={items} autoFocus={false} />);
    expect(screen.getByRole('combobox')).not.toHaveFocus();
  });

  it('works inside a Dialog and has no axe violations', async () => {
    const { baseElement } = render(
      <Dialog.Root open>
        <Dialog.Content aria-describedby={undefined}>
          <Dialog.Title>Move to folder</Dialog.Title>
          <CommandList label="Folders" items={items} />
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('combobox', { name: 'Folders' }),
    );
    const { violations } = await axe.run(baseElement, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
  });
});

describe('CommandList 12.1: long lists render only the rows in view', () => {
  const groups = ['Files', 'People', 'Settings'];
  const many = Array.from({ length: 300 }, (_, i) => ({
    value: `item-${i + 1}`,
    label: `Item ${i + 1}`,
    group: groups[Math.floor(i / 100)],
  }));

  it('renders a window with its group heading; rows know their place in all 300', () => {
    render(<CommandList items={many} label="Go to" />);
    const rows = screen.getAllByRole('option');
    expect(rows.length).toBeLessThan(40);
    expect(rows[0]).toHaveAccessibleName('Item 1');
    expect(rows[0]).toHaveAttribute('aria-setsize', '300');
    expect(rows[0]).toHaveAttribute('aria-posinset', '1');
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.queryByText('Settings')).toBeNull(); // far below the window
  });

  it('arrows loop over every item; End reaches the last group; Enter picks it', async () => {
    const onSelect = vi.fn();
    render(<CommandList items={many} label="Go to" onSelect={onSelect} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, '{ArrowUp}'); // loops from the first item to the last
    const last = screen.getByRole('option', { name: 'Item 300' });
    expect(last).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', last.id);
    // Its heading row is out of the window: still the group's name, just not shown.
    expect(screen.getByRole('group', { name: 'Settings' })).toContainElement(last);
    await userEvent.keyboard('{Home}{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Item 2' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith('item-300', many[299]);
  });

  it('search ranks across groups the way cmdk does', async () => {
    render(<CommandList items={many} label="Go to" />);
    await userEvent.type(screen.getByRole('combobox'), 'Item 250');
    expect(screen.getAllByRole('option')[0]).toHaveAccessibleName('Item 250');
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
