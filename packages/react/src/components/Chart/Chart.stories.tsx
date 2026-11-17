import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { BarChart, DonutChart, Funnel, Gauge, Heatmap, KpiTile, LineChart, Sparkline } from './index.js';
import { ErrorState } from '../ErrorState/ErrorState.js';

const meta: Meta = {
  title: 'Components/Chart',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const series = [{ key: 'revenue', label: 'Revenue' }];
const error = <ErrorState className="py-4" title="Could not load revenue" onRetry={() => {}} />;

/** Loading, empty and error keep the figure, its name and the plot's height. */
export const DataStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-6">
        <BarChart className="min-w-0 flex-1 basis-60" title="Revenue, loading" data={[]} index="month" series={series} loading />
        <BarChart className="min-w-0 flex-1 basis-60" title="Revenue, empty" data={[]} index="month" series={series} />
        <BarChart className="min-w-0 flex-1 basis-60" title="Revenue, failed" data={[]} index="month" series={series} errorState={error} />
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <DonutChart title="Plans, loading" data={[]} loading />
        <Gauge title="Storage, loading" value={0} loading />
        <Sparkline values={[]} loading />
        <KpiTile className="min-w-0 flex-1 basis-60" label="Revenue" value={null} loading />
      </div>
      <div className="flex flex-wrap gap-6">
        <Funnel className="min-w-0 flex-1 basis-60" title="Signup funnel, loading" data={[]} loading />
        <Funnel className="min-w-0 flex-1 basis-60" title="Signup funnel, empty" data={[]} emptyState="No signups this week." />
        <Heatmap className="min-w-0 flex-1 basis-60" title="Activity, empty" data={[]} rowLabels={[]} />
      </div>
    </div>
  ),
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({ month, web: 120 + i * 14, app: 80 + ((i * 37) % 50) }));
const platforms = [{ key: 'web', label: 'Web' }, { key: 'app', label: 'App' }];

function InteractiveDemo() {
  const [picked, setPicked] = React.useState('Nothing picked yet.');
  const pick = (p: { datum: { month: string }; series?: { label?: string }; value?: number }) =>
    setPicked(`Picked ${p.datum.month}${p.series ? `, ${p.series.label}: ${p.value}` : ''}.`);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6">
        <BarChart className="min-w-0 flex-1 basis-60" title="Signups by platform" data={months} index="month" series={platforms} interactive legend="toggle" onPointClick={pick} />
        <LineChart className="min-w-0 flex-1 basis-60" title="Signups trend" data={months} index="month" series={platforms} area interactive legend="toggle" onPointClick={pick} />
      </div>
      <p className="m-0 text-body-sm text-[var(--color-on-surface-variant)]">{picked}</p>
    </div>
  );
}

/**
 * 10.7: `interactive` adds a crosshair and tooltip that follow the pointer, and makes the plot one tab stop
 * (Left/Right between points, Up/Down between series, Home/End, Escape). `legend="toggle"` hides and shows
 * a series; `onPointClick` gets the point on click, tap, Enter or Space.
 */
export const Interactive: Story = { render: () => <InteractiveDemo /> };

/** Segments highlight under the pointer and with Left/Right; the tooltip adds the share. */
export const InteractiveDonut: Story = {
  render: () => (
    <DonutChart
      title="Plans"
      interactive
      center="320"
      data={[{ label: 'Free', value: 180 }, { label: 'Pro', value: 100 }, { label: 'Team', value: 40 }]}
    />
  ),
};

/** Arrow keys move across the grid; each cell has a tooltip. */
export const InteractiveHeatmap: Story = {
  render: () => (
    <Heatmap
      className="max-w-md"
      title="Activity by day and week"
      interactive
      rowLabels={['Mon', 'Wed', 'Fri']}
      columnLabels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6']}
      data={[[2, 5, 8, 3, 9, 4], [6, 1, 7, 10, 2, 5], [3, 8, 4, 6, 1, 9]]}
    />
  ),
};
