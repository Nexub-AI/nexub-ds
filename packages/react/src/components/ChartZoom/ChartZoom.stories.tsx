import type { Meta, StoryObj } from '@storybook/react';
import { ChartZoom } from './ChartZoom.js';
import { LineChart } from '../Chart/Chart.js';

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
