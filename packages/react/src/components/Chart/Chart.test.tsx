import { render as renderState, screen as stateScreen } from '@testing-library/react';
import { ErrorState } from '../ErrorState/ErrorState.js';
import { Sparkline as StateSparkline, BarChart as StateBar, DonutChart as StateDonut } from './Chart.js';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BarChart, DonutChart, LineChart, Sparkline, niceDomain, niceMax } from './Chart.js';

const data = [
  { month: 'Jan', a: 10, b: 30 },
  { month: 'Feb', a: 25, b: 5 },
];
const series = [{ key: 'a', label: 'This year' }, { key: 'b', label: 'Last year', color: 4 as const }];

describe('charts', () => {
  it('niceMax rounds up to 1, 2, 2.5 or 5 × 10ⁿ', () => {
    expect([niceMax(0), niceMax(7), niceMax(18), niceMax(23), niceMax(40), niceMax(51)]).toEqual([1, 10, 20, 25, 50, 100]);
  });

  it('BarChart renders a named figure, a data table and one bar per value', () => {
    const { container } = render(<BarChart title="Revenue" data={data} index="month" series={series} />);
    expect(screen.getByRole('figure', { name: 'Revenue' })).toBeTruthy();
    expect(screen.getByRole('table', { name: 'Revenue' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '25' })).toBeTruthy();
    const bars = container.querySelectorAll('rect');
    expect(bars).toHaveLength(4);
    // 10.3: a bar is filled through its series' gradient (.nx-chart-grad-N sets the stop colour).
    const grad = container.querySelector(bars[1]!.getAttribute('fill')!.slice(4, -1).replace(/[^#\w-]/g, '\\$&'))!;
    expect(grad.getAttribute('class')).toBe('nx-chart-grad nx-chart-grad-4');
    expect(grad.children).toHaveLength(2);
    // Tallest value 30 → axis max 50, so 30 fills 60% of the 100-unit plot.
    expect(bars[1]!.getAttribute('height')).toBe('60');
  });

  it('stacked bars sum per category', () => {
    const { container } = render(<BarChart stacked title="R" data={data} index="month" series={series} />);
    const [a, b] = [...container.querySelectorAll('rect')];
    // Jan: 10 + 30 = 40 → max 50. b sits on top of a.
    expect(Number(a!.getAttribute('y'))).toBe(80);
    expect(Number(b!.getAttribute('y'))).toBe(20);
  });

  it('LineChart draws one polyline per series and the legend only for several', () => {
    const { container } = render(<LineChart title="T" data={data} index="month" series={series.slice(0, 1)} />);
    expect(container.querySelectorAll('polyline')).toHaveLength(1);
    expect(container.querySelector('ul')).toBeNull();
  });

  it('DonutChart slices add up to the circle and report percentages', () => {
    render(<DonutChart title="Plans" data={[{ label: 'Pro', value: 3 }, { label: 'Free', value: 1 }]} />);
    expect(screen.getByRole('cell', { name: '75%' })).toBeTruthy();
  });

  it('DonutChart highlights a hovered slice in the hole and links legend rows', () => {
    const { container } = render(<DonutChart title="Plans" center="4" data={[{ label: 'Pro', value: 3, href: '/pro' }, { label: 'Free', value: 1 }]} />);
    fireEvent.mouseEnter(container.querySelector('[data-slice="1"]')!);
    expect(container.textContent).toContain('Free · 25%');
    expect(container.querySelector('[data-slice="0"]')!.getAttribute('class')).toContain('opacity-35');
    expect(screen.getByRole('link', { name: 'Pro: 3 (75%)' }).getAttribute('href')).toBe('/pro');
  });

  it('Sparkline is decorative without a label and an image with one', () => {
    const { container, rerender } = render(<Sparkline values={[1, 3, 2]} />);
    expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
    rerender(<Sparkline values={[1, 3, 2]} label="Up 8%" />);
    expect(screen.getByRole('img', { name: 'Up 8%' })).toBeTruthy();
  });

  it('niceDomain spans zero and rounds both ends', () => {
    expect(niceDomain([3, 18])).toEqual([0, 20]);
    expect(niceDomain([-7, 18])).toEqual([-10, 20]);
    expect(niceDomain([-40, -5])).toEqual([-50, 0]);
  });

  it('negative bars grow down from the zero line and are marked for the draw-in', () => {
    const { container } = render(<BarChart title="P&L" data={[{ m: 'Jan', v: 20 }, { m: 'Feb', v: -10 }]} index="m" series={[{ key: 'v' }]} />);
    const [pos, neg] = [...container.querySelectorAll('rect.nx-chart-bar')];
    // Domain [-10, 20] → zero at y = 100 - (10/30)·100 = 66.67.
    expect(Number(pos!.getAttribute('y')) + Number(pos!.getAttribute('height'))).toBeCloseTo(66.67, 1);
    expect(Number(neg!.getAttribute('y'))).toBeCloseTo(66.67, 1);
    expect(neg!.hasAttribute('data-negative')).toBe(true);
    expect(screen.getByRole('cell', { name: '-10' })).toBeTruthy();
  });

  it('every category gets a hover tooltip with all series values, hidden from assistive tech', () => {
    const { container } = render(<BarChart title="R" data={data} index="month" series={series} />);
    const cols = container.querySelectorAll('.group\\/col');
    expect(cols).toHaveLength(2);
    expect(cols[1]!.textContent).toContain('Feb');
    expect(cols[1]!.textContent).toContain('Last year');
    expect(cols[1]!.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders on the server with no style attributes (strict CSP)', () => {
    const html = renderToString(<><BarChart title="R" data={data} index="month" series={series} /><DonutChart title="D" data={[{ label: 'x', value: 1 }]} /></>);
    expect(html).not.toContain('style=');
  });
});

describe('Charts 10.5: data states', () => {
  const rows = [{ month: 'Jan', a: 1 }];
  const s = [{ key: 'a' }];

  it('loading keeps the named figure, sets aria-busy and hides the data', () => {
    const { container } = renderState(<StateBar title="Revenue" data={rows} index="month" series={s} loading />);
    const figure = stateScreen.getByRole('figure', { name: 'Revenue' });
    expect(figure.getAttribute('aria-busy')).toBe('true');
    expect(container.querySelector('svg, table')).toBeNull();
    expect(container.querySelector('[data-chart-state] [aria-hidden="true"]')).not.toBeNull();
  });

  it('empty data shows the default message, or emptyState', () => {
    const { rerender } = renderState(<StateBar title="Revenue" data={[]} index="month" series={s} />);
    expect(stateScreen.getByText('Nothing here yet')).toBeTruthy();
    expect(stateScreen.getByRole('figure', { name: 'Revenue' }).hasAttribute('aria-busy')).toBe(false);
    rerender(<StateDonut title="Plans" data={[]} emptyState="No plans" />);
    expect(stateScreen.getByText('No plans')).toBeTruthy();
  });

  it('errorState wins over loading and empty', () => {
    renderState(<StateBar title="Revenue" data={[]} index="month" series={s} loading errorState={<ErrorState title="Failed" />} />);
    expect(stateScreen.getByRole('heading', { name: 'Failed' })).toBeTruthy();
    expect(stateScreen.getByRole('figure', { name: 'Revenue' }).hasAttribute('aria-busy')).toBe(false);
    expect(stateScreen.queryByText('Nothing here yet')).toBeNull();
  });

  it('Sparkline: a skeleton while loading; empty stays an empty drawing unless emptyState is given', () => {
    const { container, rerender } = renderState(<StateSparkline values={[1, 2]} loading />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('span[aria-hidden="true"]')).not.toBeNull();
    rerender(<StateSparkline values={[]} />);
    expect(container.querySelector('svg')).not.toBeNull();
    rerender(<StateSparkline values={[]} emptyState="n/a" />);
    expect(stateScreen.getByText('n/a')).toBeTruthy();
  });
});
