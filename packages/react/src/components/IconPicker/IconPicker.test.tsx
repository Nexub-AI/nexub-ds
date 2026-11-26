import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { IconPicker } from './IconPicker.js';

beforeEach(() => localStorage.clear());

describe('IconPicker (11.2)', () => {
  it('opens the @nexub/icons grid, searches and picks a name', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <IconPicker aria-label="Doc icon" name="icon" onValueChange={onValueChange} />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Doc icon' });
    expect(trigger).toHaveTextContent('Pick an icon');
    await userEvent.click(trigger);
    const listbox = await screen.findByRole('listbox', { name: 'Pick an icon' });
    expect(within(listbox).getByRole('option', { name: 'Arrow up right' })).toBeInTheDocument();
    await userEvent.type(screen.getByRole('searchbox'), 'calendar days');
    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('CalendarDays');
    expect(trigger).toHaveTextContent('Calendar days');
    expect(container.querySelector('input[type=hidden][name=icon]')).toHaveValue('CalendarDays');
    expect(JSON.parse(localStorage.getItem('nx-icon-recent')!)).toEqual(['CalendarDays']);
  });

  it('a value draws its icon in the trigger', async () => {
    render(<IconPicker aria-label="Icon" value="Star" />);
    const trigger = screen.getByRole('combobox', { name: 'Icon' });
    expect(trigger).toHaveTextContent('Star');
    await vi.waitFor(() =>
      expect(trigger.querySelector('svg:not(.lucide-chevron-down)')).not.toBeNull(),
    );
  });

  it('icons limits and orders the set; categories add headings and a jump row; recent comes first', async () => {
    const { rerender } = render(
      <IconPicker.Panel recent={[]} icons={['Star', 'Heart', 'NotAnIcon']} />,
    );
    const options = await screen.findAllByRole('option');
    expect(options.map((o) => o.getAttribute('aria-label'))).toEqual(['Star', 'Heart']);
    rerender(
      <IconPicker.Panel
        recent={['Mail']}
        categories={[
          { label: 'Finance', icons: ['Wallet', 'Receipt'] },
          { label: 'People', icons: ['User', 'Users'] },
        ]}
      />,
    );
    expect(screen.getByRole('group', { name: 'Recently used' })).toBeInTheDocument();
    await userEvent.click(
      within(screen.getByRole('group', { name: 'Categories' })).getByRole('button', {
        name: 'People',
      }),
    );
    expect(screen.getByRole('option', { name: 'User' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Wallet' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <IconPicker aria-label="Doc icon" value="Star" />
        <IconPicker.Panel recent={['Mail']} icons={['Star', 'Heart', 'Mail']} />
      </div>,
    );
    await screen.findByRole('listbox');
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

describe('IconPicker 12.1: hydration', () => {
  it('hydrates without a mismatch when the server had the icons cached and the browser not yet', async () => {
    const { renderToString } = await import('react-dom/server');
    const { hydrateRoot } = await import('react-dom/client');
    const server = await import('./IconPicker.js');
    await server.loadIcons(); // the server process has every icon cached
    const html = renderToString(<server.IconPicker aria-label="Icon" value="CalendarDays" />);
    vi.resetModules(); // the browser starts with a fresh module: nothing cached
    const client = await import('./IconPicker.js');
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);
    const onRecoverableError = vi.fn();
    await React.act(async () => {
      hydrateRoot(container, <client.IconPicker aria-label="Icon" value="CalendarDays" />, {
        onRecoverableError,
      });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    container.remove();
  });
});
