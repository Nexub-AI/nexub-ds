import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { DataTableVirtual } from './DataTableVirtual.js';

const rows = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Row ${i}` }));
const columns = [{ accessorKey: 'name', header: 'Name' }];

describe('DataTableVirtual', () => {
  // jsdom has no layout: give elements a size so the virtualizer has a viewport.
  const restore: Array<() => void> = [];
  beforeAll(() => {
    const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 600, height: 400, top: 0, left: 0, right: 600, bottom: 400, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);
    restore.push(() => rect.mockRestore());
    for (const [proto, key] of [[HTMLElement.prototype, 'offsetHeight'], [Element.prototype, 'clientHeight']] as const) {
      const original = Object.getOwnPropertyDescriptor(proto, key);
      Object.defineProperty(proto, key, { configurable: true, get: () => 400 });
      restore.push(() => original && Object.defineProperty(proto, key, original));
    }
  });
  afterAll(() => restore.forEach((r) => r()));

  it('renders a window of rows but reports the full count', () => {
    render(<DataTableVirtual caption="Rows" columns={columns} data={rows} maxHeight={400} />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-rowcount', '1001');
    const rendered = screen.getAllByRole('row').filter((r) => r.hasAttribute('aria-rowindex'));
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(100);
    expect(rendered[0]).toHaveAttribute('aria-rowindex', '2');
  });
});
