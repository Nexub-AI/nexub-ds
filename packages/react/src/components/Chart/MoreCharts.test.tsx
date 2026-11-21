import { render as renderState, screen as stateScreen } from '@testing-library/react';
import { ErrorState } from '../ErrorState/ErrorState.js';
import { Gauge as StateGauge, Funnel as StateFunnel, Heatmap as StateHeatmap, KpiTile as StateKpi } from './MoreCharts.js';
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

describe('Charts 2.0, 10.5: data states', () => {
  it('Gauge, Funnel and Heatmap: loading sets aria-busy on the figure and hides the data', () => {
    const { container } = renderState(
      <>
        <StateGauge title="Storage" value={40} loading />
        <StateFunnel title="Signup" data={[{ label: 'Visit', value: 10 }]} loading />
        <StateHeatmap title="Activity" data={[[1]]} rowLabels={['Mon']} loading />
      </>,
    );
    for (const name of ['Storage', 'Signup', 'Activity']) {
      expect(stateScreen.getByRole('figure', { name }).getAttribute('aria-busy')).toBe('true');
    }
    expect(container.querySelector('svg, table, figcaption')).toBeNull();
  });

  it('empty shows the default or emptyState; errorState wins', () => {
    renderState(
      <>
        <StateFunnel title="Signup" data={[]} />
        <StateHeatmap title="Activity" data={[]} rowLabels={[]} emptyState="No activity" />
        <StateGauge title="Storage" value={Number.NaN} loading errorState={<ErrorState title="Failed" />} />
      </>,
    );
    expect(stateScreen.getByText('Nothing here yet')).toBeTruthy();
    expect(stateScreen.getByText('No activity')).toBeTruthy();
    expect(stateScreen.getByRole('heading', { name: 'Failed' })).toBeTruthy();
    expect(stateScreen.getByRole('figure', { name: 'Storage' }).hasAttribute('aria-busy')).toBe(false);
  });

  it('KpiTile: loading keeps the label and hides the value; emptyState is opt-in; errorState wins', () => {
    const { container, rerender } = renderState(<StateKpi label="Revenue" value="$10" change={0.1} trend={[1, 2]} loading />);
    expect(stateScreen.getByText('Revenue')).toBeTruthy();
    expect(stateScreen.queryByText('$10')).toBeNull();
    expect(container.firstElementChild!.getAttribute('aria-busy')).toBe('true');
    expect(container.querySelector('svg')).toBeNull();
    rerender(<StateKpi label="Revenue" value={null} emptyState="No sales" />);
    expect(stateScreen.getByText('No sales')).toBeTruthy();
    rerender(<StateKpi label="Revenue" value="$10" loading errorState="Failed" />);
    expect(stateScreen.getByText('Failed')).toBeTruthy();
    expect(container.firstElementChild!.hasAttribute('aria-busy')).toBe(false);
  });
});

describe('11.3: small chart options', () => {
  it('Gauge: tone colours the arc, caption sits under the value and is read with it', () => {
    const { container } = render(<Gauge title="Budget" value={90} tone="danger" caption="Over budget" color={3} />);
    expect(container.querySelectorAll('circle')[1]!.getAttribute('class')).toBe('stroke-error');
    expect(container.querySelector('[data-gauge-caption]')!.textContent).toBe('Over budget');
    expect(container.querySelector('figcaption')!.textContent).toBe('Budget: 90 of 100 (90%), Over budget');
  });

  it('Heatmap: missing cells are hatched, listed as "—", and left out of the range; legend shows min and max', () => {
    // eslint-disable-next-line no-sparse-arrays
    const { container } = render(<Heatmap title="Load" rowLabels={['Mon', 'Tue']} data={[[0, null, 6], [1, , 7]]} legend />);
    expect(container.querySelectorAll('[data-missing]')).toHaveLength(2);
    expect(screen.getAllByRole('cell', { name: '—' })).toHaveLength(2);
    const legend = container.querySelector('[data-chart-legend]')!;
    expect(legend.textContent).toBe('07No data');
    expect(container.querySelector('svg rect')!.getAttribute('class')).toBe('fill-chart-seq-1');
  });

  it('Heatmap: an all-missing grid is empty; tableView lists the grid', () => {
    render(<Heatmap title="None" rowLabels={['Mon']} data={[[null]]} emptyState="No load" />);
    expect(screen.getByText('No load')).toBeTruthy();
    const { container } = render(<Heatmap title="Load" rowLabels={['Mon']} columnLabels={['W1', 'W2']} data={[[3, null]]} tableView />);
    const details = container.querySelector('[data-chart-table]')!;
    expect([...details.querySelectorAll('th')].map((t) => t.textContent)).toEqual(['Label', 'W1', 'W2', 'Mon']);
    expect([...details.querySelectorAll('td')].map((t) => t.textContent)).toEqual(['3', '—']);
  });

  const steps = [
    { label: 'Visited', value: 1000, values: { app: 400 } },
    { label: 'Signed up', value: 500, values: { app: 300 } },
    { label: 'Paid', value: 100, values: { app: 60 } },
  ];

  it('Funnel: show="both" prints conversion from the first and previous step, and the drop-off', () => {
    const { container } = render(<Funnel title="Signup" data={steps} show="both" />);
    const meta = [...container.querySelectorAll('[data-funnel-meta]')].map((m) => m.textContent);
    expect(meta[0]).toBe('100% of Visited');
    expect(meta[2]).toBe('10% of Visited · 20% of previous step · 400 dropped off');
    render(<Funnel title="Lost" data={steps} show="drop-off" />);
    expect(screen.getByRole('cell', { name: '500, 500 dropped off' })).toBeTruthy();
  });

  it('Funnel: several series draw one bar each with a legend and a column each in the table', () => {
    const { container } = render(
      <Funnel title="By channel" data={steps} series={[{ key: 'value', label: 'Web' }, { key: 'app', label: 'App', color: 4 }]} tableView />,
    );
    expect(container.querySelectorAll('[aria-hidden] rect.fill-chart-4')).toHaveLength(4); // 3 bars + legend swatch
    expect(container.querySelector('[data-chart-legend]')!.textContent).toBe('WebApp');
    expect(screen.getAllByRole('columnheader', { name: 'App' })).toHaveLength(2);
    expect(screen.getByRole('cell', { name: '60, 15% of Visited' })).toBeTruthy();
    expect(container.querySelector('[data-chart-table]')).toBeTruthy();
  });

  it('Funnel and Heatmap: the new props pass through the interactive layer', () => {
    const { container } = render(
      <>
        <Funnel title="f" data={steps} show="conversion" tableView interactive />
        <Heatmap title="h" rowLabels={['a']} data={[[1, null]]} legend tableView interactive />
      </>,
    );
    expect(container.querySelectorAll('[data-chart-table]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-funnel-meta]')).toHaveLength(3);
    expect(container.querySelector('[data-missing]')).toBeTruthy();
  });

  it('defaults render exactly as before (no legend, table view or meta)', () => {
    const html = renderToString(<><Gauge title="g" value={1} /><Heatmap title="h" rowLabels={['a']} data={[[1]]} /><Funnel title="f" data={[{ label: 'a', value: 1 }]} /></>);
    expect(html).not.toMatch(/data-chart-legend|data-chart-table|data-funnel-meta|data-missing|data-gauge-caption/);
  });
});
