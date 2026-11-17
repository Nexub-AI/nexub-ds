import type { Meta, StoryObj } from '@storybook/react';
import { ChartZoom } from './ChartZoom.js';
import { LineChart } from '../Chart/Chart.js';
import { ErrorState } from '../ErrorState/ErrorState.js';

const meta: Meta = {
  title: 'Components/ChartZoom',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => ({ month, revenue: 100 + i * 12 }));

export const Default: Story = {
  render: () => (
    <ChartZoom data={data} index="month" defaultRange={[2, 6]} className="max-w-xl">
      {(slice) => <LineChart title="Revenue" data={slice} index="month" series={[{ key: 'revenue', label: 'Revenue' }]} />}
    </ChartZoom>
  ),
};

const chart = (title: string) => (slice: typeof data, state: object) => (
  <LineChart title={title} data={slice} index="month" series={[{ key: 'revenue', label: 'Revenue' }]} {...state} />
);

/** The states pass through to the chart; the zoom controls are disabled while loading or failed. */
export const DataStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <ChartZoom data={data} index="month" loading>
        {chart('Revenue, loading')}
      </ChartZoom>
      <ChartZoom data={[]} index="month">
        {chart('Revenue, empty')}
      </ChartZoom>
      <ChartZoom data={data} index="month" errorState={<ErrorState className="py-4" title="Could not load revenue" onRetry={() => {}} />}>
        {chart('Revenue, failed')}
      </ChartZoom>
    </div>
  ),
};
