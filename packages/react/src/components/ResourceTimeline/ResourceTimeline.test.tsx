import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, it, expect, vi } from 'vitest';
import { ResourceTimeline } from './ResourceTimeline.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

const resources = [
  { id: 'ana', label: 'Ana Lima', description: 'Design' },
  { id: 'ben', label: 'Ben Ode' },
];
// Fri 6 – Mon 9 November 2026.
const range = { from: new Date(2026, 10, 6), to: new Date(2026, 10, 9) };
const leave: Record<string, string[]> = { ana: ['2026-11-06'], ben: ['2026-11-09'] };
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const renderRT = (props: Partial<React.ComponentProps<typeof ResourceTimeline>> = {}, locale = 'en-GB') =>
  render(
    <NexubProvider locale={locale}>
      <ResourceTimeline
        label="Team leave"
        resources={resources}
        range={range}
        now={new Date(2026, 10, 9, 12)}
        getCell={(id, d) => (leave[id]!.includes(key(d)) ? { value: 'AL', tone: 'info' } : null)}
        {...props}
      />
    </NexubProvider>,
  );

describe('ResourceTimeline', () => {
  it('a plain table without onCellActivate: rows per resource, days across, today and weekends marked, footer totals', async () => {
    const { container } = renderRT({ footer: (d) => (d.getDate() === 6 ? 1 : 0), rowTotal: () => 1, grandTotal: 2 });
    const table = screen.getByRole('table', { name: 'Team leave' });
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Name',
      'Fri6Friday 6 November',
      'Sat7Saturday 7 November',
      'Sun8Sunday 8 November',
      'Mon9Monday 9 November',
      'Total',
    ]);
    expect(within(table).getAllByRole('rowheader').map((h) => h.textContent)).toEqual(['Ana LimaDesign', 'Ben Ode', 'Total']);
    expect(container.querySelector('[aria-current="date"]')).toHaveTextContent('Monday 9 November');
    const rows = within(table).getAllByRole('row');
    expect(within(rows[1]!).getAllByRole('cell').map((c) => c.textContent)).toEqual(['AL', '', '', '', '1']);
    expect(within(rows[3]!).getAllByRole('cell').map((c) => c.textContent)).toEqual(['1', '0', '0', '0', '2']);
    expect(container.querySelectorAll('td[tabindex]')).toHaveLength(0);
    expect(screen.getByRole('region', { name: 'Team leave' })).toHaveAttribute('tabindex', '0');
    const { violations } = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(violations.map((v) => v.id)).toEqual([]);
  });

  it('with onCellActivate: a grid with one Tab stop, arrow keys, Home/End, Enter and click activate', async () => {
    const onCellActivate = vi.fn();
    const { container } = renderRT({ onCellActivate });
    const grid = screen.getByRole('grid', { name: 'Team leave' });
    const cells = within(grid).getAllByRole('gridcell');
    expect(cells.filter((c) => c.tabIndex === 0)).toHaveLength(1);
    await userEvent.tab();
    expect(cells[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    expect(cells[5]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onCellActivate).toHaveBeenLastCalledWith('ben', new Date(2026, 10, 7), cells[5]);
    await userEvent.keyboard('{End}');
    expect(cells[7]).toHaveFocus();
    await userEvent.keyboard('{Control>}{Home}{/Control}{ArrowUp}');
    expect(cells[0]).toHaveFocus();
    await userEvent.click(cells[3]!);
    expect(onCellActivate).toHaveBeenLastCalledWith('ana', new Date(2026, 10, 9), cells[3]);
    expect(cells[3]).toHaveAttribute('tabindex', '0');
    const { violations } = await axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
    expect(violations.map((v) => v.id)).toEqual([]);
  });

  it('RTL: ArrowLeft moves to the next day', async () => {
    renderRT({ onCellActivate: () => {} }, 'ar');
    const cells = screen.getAllByRole('gridcell');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowLeft}');
    expect(cells[1]).toHaveFocus();
  });
});
