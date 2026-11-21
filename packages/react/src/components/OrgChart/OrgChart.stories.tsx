import type { Meta, StoryObj } from '@storybook/react';
import { OrgChart, type OrgChartNode } from './OrgChart.js';

const meta: Meta = {
  title: 'Components/OrgChart',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const people: OrgChartNode[] = [
  {
    id: 'ada',
    label: 'Ada Lovelace',
    description: 'Chief Executive',
    children: [
      {
        id: 'alan',
        label: 'Alan Turing',
        description: 'Engineering',
        children: [
          { id: 'grace', label: 'Grace Hopper', description: 'Platform lead' },
          { id: 'linus', label: 'Linus Torvalds', description: 'Kernel' },
          { id: 'margaret', label: 'Margaret Hamilton', description: 'Flight software' },
        ],
      },
      { id: 'mary', label: 'Mary Somerville', description: 'Finance', children: [{ id: 'emmy', label: 'Emmy Noether', description: 'Analyst' }] },
      { id: 'katherine', label: 'Katherine Johnson', description: 'Research' },
    ],
  },
];

export const Default: Story = {
  render: () => <OrgChart aria-label="Company" nodes={people} defaultExpanded={['ada', 'alan', 'mary']} />,
};

export const CustomCard: Story = {
  render: () => (
    <OrgChart
      aria-label="Company"
      nodes={people}
      defaultExpanded={['ada']}
      renderCard={(n) => (
        <span className="flex flex-col">
          <span className="text-label-lg">{n.label}</span>
          <span className="text-body-sm text-on-surface-variant">{n.description}</span>
        </span>
      )}
    />
  ),
};
