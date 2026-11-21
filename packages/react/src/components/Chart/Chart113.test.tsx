import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { BarChart, DonutChart, LineChart, groupDonut, niceDomain } from './Chart.js';

const months = [
  { month: 'Jan', usd: 10, eur: 8 },
  { month: 'Feb', usd: null, eur: 9 },
  { month: 'Mar', usd: 14, eur: null },
];

const srCells = (container: HTMLElement) =>
  within(container.querySelector('table.sr-only') as HTMLElement)
    .getAllByRole('cell')
    .map((c) => c.textContent);

describe('charts (11.3)', () => {
  it('draws a missing value as a gap, not 0, and lists it as —', () => {
    const { container } = render(<BarChart title="Sales" data={months} index="month" series={[{ key: 'usd' }, { key: 'eur' }]} />);
    // 6 values, 2 missing: 4 bars.
    expect(container.querySelectorAll('rect.nx-chart-bar')).toHaveLength(4);
    expect(srCells(container)).toEqual(['10', '8', '—', '9', '14', '—']);
  });

  it('breaks a line at a missing value', () => {
    const { container } = render(<LineChart title="Sales" data={months} index="month" series={[{ key: 'usd' }]} />);
    // Jan, gap, Mar: two lone points, no polyline across the gap.
    expect(container.querySelectorAll('polyline')).toHaveLength(0);
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('formats each series with its own formatter (multi-currency)', () => {
    const usd = (v: number) => `USD ${v}`;
    const eur = (v: number) => `EUR ${v}`;
    const { container } = render(
      <BarChart title="Sales" data={months} index="month" series={[{ key: 'usd', valueFormat: usd }, { key: 'eur', valueFormat: eur }]} />,
    );
    expect(srCells(container)).toEqual(['USD 10', 'EUR 8', '—', 'EUR 9', 'USD 14', '—']);
  });

  it('tones and per-bar colours use the semantic classes', () => {
    const data = [{ m: 'Jan', spend: 90 }, { m: 'Feb', spend: 120 }];
    const { container } = render(
      <BarChart title="Spend" data={data} index="m" series={[{ key: 'spend', color: 'good' }]} colorOf={(row) => (row.spend > 100 ? 'danger' : undefined)} />,
    );
    const bars = container.querySelectorAll('rect.nx-chart-bar');
    expect(bars[0]!.getAttribute('class')).toContain('fill-success');
    expect(bars[1]!.getAttribute('class')).toContain('fill-error');
  });

  it('integerTicks keeps the gridlines on whole numbers', () => {
    expect(niceDomain([5], true)).toEqual([0, 8]);
    expect(niceDomain([5])).toEqual([0, 5]);
    expect(niceDomain([2], true)).toEqual([0, 4]);
  });

  it('horizontal bars list the categories down the side', () => {
    render(<BarChart title="Top products" orientation="horizontal" data={[{ p: 'Pro plan', n: 40 }, { p: 'Starter', n: 12 }]} index="p" series={[{ key: 'n' }]} />);
    const fig = screen.getByRole('figure', { name: 'Top products' });
    expect(fig).toHaveAttribute('data-orientation', 'horizontal');
    expect(fig.textContent).toContain('Pro plan');
    expect(screen.getByRole('table', { name: 'Top products' })).toBeInTheDocument();
  });

  it('waterfall steps from a running total; rises good, falls danger, totals from zero', () => {
    const data = [
      { step: 'Opening', v: 100, total: true },
      { step: 'Sales', v: 40, total: false },
      { step: 'Refunds', v: -15, total: false },
      { step: 'Closing', v: 125, total: true },
    ];
    const { container } = render(<BarChart title="Cash" variant="waterfall" totalKey="total" data={data} index="step" series={[{ key: 'v', color: 3 }]} />);
    const bars = [...container.querySelectorAll('rect.nx-chart-bar')];
    expect(bars).toHaveLength(4);
    expect(bars[1]!.getAttribute('class')).toContain('fill-success');
    expect(bars[2]!.getAttribute('class')).toContain('fill-error');
    expect(bars[0]!.getAttribute('class')).toContain('fill-chart-3');
    expect(bars[3]!.hasAttribute('data-total')).toBe(true);
    // The refund bar floats: it starts above the opening bar's top.
    const y = (el: Element) => Number(el.getAttribute('y'));
    expect(Number(bars[2]!.getAttribute('height'))).toBeGreaterThan(0);
    expect(y(bars[2]!)).toBeLessThan(y(bars[0]!));
  });

  it('tableView adds a visible "Show as table" disclosure with the data, also in server HTML', () => {
    render(<BarChart title="Sales" tableView data={months} index="month" series={[{ key: 'usd', label: 'USD' }]} />);
    expect(screen.getByText('Show as table')).toBeInTheDocument();
    const html = renderToString(<LineChart title="Sales" tableView="Data" data={months} index="month" series={[{ key: 'usd' }]} />);
    expect(html).toContain('<details');
    expect(html).toContain('Data');
  });
});

describe('DonutChart (11.3)', () => {
  const data = [
    { label: 'A', value: 50 },
    { label: 'B', value: 30 },
    { label: 'C', value: 10, href: '/c' },
    { label: 'D', value: 6 },
    { label: 'E', value: 4 },
  ];

  it('maxSlices groups the smallest into Other', () => {
    expect(groupDonut(data, 3, 'Other').map((d) => [d.label, d.value])).toEqual([
      ['A', 50],
      ['B', 30],
      ['Other', 20],
    ]);
    render(<DonutChart title="Plans" data={data} maxSlices={3} legendValues />);
    expect(screen.getAllByText('Other').length).toBeGreaterThan(0);
  });

  it('legendValues lists value and share; href makes a row a link', () => {
    render(<DonutChart title="Plans" data={data} legendValues />);
    expect(screen.getByRole('link', { name: /^C\s*10\s*10%$/ })).toHaveAttribute('href', '/c');
  });

  it('size picks the diameter', () => {
    const { container } = render(<DonutChart title="Plans" data={data} size="lg" />);
    expect(container.querySelector('.size-56')).not.toBeNull();
  });
});
