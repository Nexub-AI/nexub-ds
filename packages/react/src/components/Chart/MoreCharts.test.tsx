import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Funnel, Gauge, Heatmap, KpiTile } from './MoreCharts.js';

describe('charts 2.0', () => {
  it('Gauge fills its share of the 270° arc and says the value in text', () => {
    const { container } = render(<Gauge title="Storage used" value={30} max={120} />);
    expect(screen.getByRole('figure', { name: 'Storage used' })).toBeTruthy();
    expect(container.querySelectorAll('circle')[1]!.getAttribute('stroke-dasharray')).toBe('18.75 81.25');
    expect(container.querySelector('figcaption')!.textContent).toBe('Storage used: 30 of 120 (25%)');
  });

  it('Heatmap maps the range onto seven sequential steps and keeps a table', () => {
    const { container } = render(<Heatmap title="Activity" rowLabels={['Mon', 'Tue']} data={[[0, 3, 6], [1, 2, 7]]} />);
    const cls = [...container.querySelectorAll('rect')].map((r) => r.getAttribute('class'));
    expect(cls[0]).toBe('fill-chart-seq-1');
    expect(cls[5]).toBe('fill-chart-seq-7');
    expect(screen.getByRole('table', { name: 'Activity' })).toBeTruthy();
  });

  it('Funnel reports conversion from the first step', () => {
    render(<Funnel title="Signup" data={[{ label: 'Visited', value: 1000 }, { label: 'Signed up', value: 250 }]} />);
    expect(screen.getByRole('cell', { name: '25% of Visited' })).toBeTruthy();
  });

  it('KpiTile colours the change by direction, inverted for costs', () => {
    const { rerender, container } = render(<KpiTile label="Revenue" value="$68k" change={0.114} trend={[1, 2, 3]} />);
    expect(container.textContent).toContain('+11.4%');
    expect(container.innerHTML).toContain('--color-success');
    rerender(<KpiTile label="Churn" value="2.1%" change={0.02} invert />);
    expect(container.innerHTML).toContain('--color-error');
  });

  it('all render on the server without style attributes', () => {
    const html = renderToString(<><Gauge title="g" value={1} /><Heatmap title="h" rowLabels={['a']} data={[[1]]} /><Funnel title="f" data={[{ label: 'a', value: 1 }]} /><KpiTile label="k" value="1" /></>);
    expect(html).not.toContain('style=');
  });
});
