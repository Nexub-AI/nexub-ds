import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import axe from 'axe-core';
import { describe, it, expect } from 'vitest';
import { BarChart, LineChart } from './Chart.js';
import { computeChange } from './ChartStory.js';

const months = [
  { month: 'Jan', revenue: 9000, cost: 5000 },
  { month: 'Feb', revenue: 9500, cost: 5200 },
  { month: 'Mar', revenue: 10000, cost: 5100 },
  { month: 'Apr', revenue: 10600, cost: 4800 },
  { month: 'May', revenue: 11200, cost: 4600 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
const series = [{ key: 'revenue', label: 'Revenue' }, { key: 'cost', label: 'Cost' }];

describe('chart story (12.3)', () => {
  it('changes nothing without the new props', () => {
    const plain = renderToString(<LineChart title="Revenue" data={months} index="month" series={series} />);
    expect(plain).not.toContain('data-chart-story');
    expect(plain).not.toContain('aria-describedby');
  });

  it('computes and formats the change, in the success colour for a rise', () => {
    render(<LineChart title="Revenue" data={months} index="month" series={series} valueFormat={usd} change={{ from: 'Mar', locale: 'en-US' }} />);
    const callout = screen.getByText('Up 12% (+$1,200) since Mar');
    expect(callout).toHaveAttribute('data-change', 'up');
    expect(callout.className).toContain('--color-success');
    // The figure is described by the callout, so it is reachable as text.
    expect(screen.getByRole('figure', { name: 'Revenue' })).toHaveAccessibleDescription('Up 12% (+$1,200) since Mar');
  });

  it('uses the series formatter, `invert` for falls that are good, and a custom label', () => {
    const eur = (v: number) => `€${v}`;
    render(
      <BarChart title="Cost" data={months} index="month" series={[series[0]!, { key: 'cost', label: 'Cost', valueFormat: eur }]}
        change={{ from: 'Jan', to: 'May', series: 'cost', invert: true, label: 'January', locale: 'en-US' }} />,
    );
    const callout = screen.getByText('Down 8% (−€400) since January');
    expect(callout.className).toContain('--color-success');
  });

  it('a rise on an inverted metric is in the error colour; flat is neutral', () => {
    const { rerender } = render(<LineChart title="Cost" data={months} index="month" series={series} change={{ from: 'Jan', to: 'Feb', series: 'cost', invert: true }} />);
    expect(document.querySelector('p[data-change="up"]')!.className).toContain('--color-error');
    rerender(<LineChart title="Cost" data={[{ m: 'a', v: 3 }, { m: 'b', v: 3 }]} index="m" series={[{ key: 'v' }]} change={{ from: 'a' }} />);
    expect(screen.getByText('No change since a').className).toContain('--color-on-surface-variant');
  });

  it('leaves the percentage out from zero, and skips a missing point', () => {
    const data = [{ m: 'a', v: 0 }, { m: 'b', v: 5 }, { m: 'c', v: null }];
    expect(computeChange({ from: 'a', to: 'b' }, { data, index: 'm', series: [{ key: 'v' }], valueFormat: String })!.text).toBe('Up +5 since a');
    expect(computeChange({ from: 'a' }, { data, index: 'm', series: [{ key: 'v' }], valueFormat: String })).toBeNull();
    expect(computeChange({ from: 'zz' }, { data, index: 'm', series: [{ key: 'v' }], valueFormat: String })).toBeNull();
  });

  it('draws annotations and reference lines, and lists them as text', () => {
    const { container } = render(
      <LineChart title="Revenue" data={months} index="month" series={series} valueFormat={usd}
        annotations={[{ at: 'Feb', label: 'Launch', series: 'revenue' }, { at: 'Apr', to: 'May', label: 'Promo' }]}
        referenceLines={[{ value: 10000, label: 'Target', tone: 'good' }, { value: 'Mar', axis: 'category', label: 'Price change' }]} />,
    );
    expect(container.querySelector('[data-annotation="point"]')).not.toBeNull();
    expect(container.querySelector('[data-annotation="range"]')).not.toBeNull();
    expect(container.querySelector('[data-reference="value"]')!.getAttribute('class')).toContain('--color-success');
    expect(container.querySelector('[data-reference="category"]')).not.toBeNull();
    const list = screen.getByRole('list', { name: 'Chart notes' });
    expect([...list.querySelectorAll('li')].map((li) => li.textContent)).toEqual([
      'Launch: Feb',
      'Promo: Apr–May',
      'Target: $10,000',
      'Price change: Mar',
    ]);
    expect(screen.getByRole('figure', { name: 'Revenue' })).toHaveAccessibleDescription('Launch: Feb Promo: Apr–May Target: $10,000 Price change: Mar');
  });

  it('widens the axis to keep a reference line in view', () => {
    render(<BarChart title="Revenue" data={months} index="month" series={series} referenceLines={[{ value: 20000, label: 'Goal' }]} />);
    // The top gridline label rises from 12,000 to 20,000.
    expect(screen.getAllByText('20,000').length).toBeGreaterThan(0);
  });

  it('ignores notes on categories that are not in the data (e.g. zoomed out of view)', () => {
    const { container } = render(<LineChart title="Revenue" data={months} index="month" series={series} annotations={[{ at: 'Dec', label: 'Gone' }]} />);
    expect(container.querySelector('[data-annotation]')).toBeNull();
    expect(screen.queryByRole('list', { name: 'Chart notes' })).toBeNull();
  });

  it('keeps the story props off the DOM for horizontal bars', () => {
    const { container } = render(
      <BarChart orientation="horizontal" title="Revenue" data={months} index="month" series={series} change={{ from: 'Jan' }} annotations={[{ at: 'Jan', label: 'x' }]} />,
    );
    expect(container.querySelector('figure')!.getAttribute('change')).toBeNull();
    expect(container.querySelector('figure')!.getAttribute('annotations')).toBeNull();
  });

  it('works with the interactive layer and server rendering', () => {
    render(<LineChart interactive title="Revenue" data={months} index="month" series={series} change={{ from: 'Mar' }} />);
    expect(screen.getByText(/^Up 12%/)).toBeInTheDocument();
    const html = renderToString(<BarChart title="Revenue" data={months} index="month" series={series} annotations={[{ at: 'Feb', label: 'Launch' }]} />);
    expect(html).toContain('Launch');
    expect(html).not.toContain('style=');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <LineChart title="Revenue" data={months} index="month" series={series} change={{ from: 'Mar' }}
        annotations={[{ at: 'Feb', label: 'Launch' }]} referenceLines={[{ value: 10000, label: 'Target' }]} />,
    );
    const { violations } = await axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
    expect(violations.map((v) => v.id)).toEqual([]);
  });
});
