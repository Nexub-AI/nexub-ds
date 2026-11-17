import type { Meta, StoryObj } from '@storybook/react';
import { BarChart, DonutChart, Funnel, Gauge, Heatmap, KpiTile, Sparkline } from './index.js';
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
