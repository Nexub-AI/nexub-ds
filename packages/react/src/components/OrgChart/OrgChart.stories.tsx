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

const names = ['Ada', 'Alan', 'Grace', 'Linus', 'Margaret', 'Katherine', 'Emmy', 'Mary', 'Barbara', 'Dennis', 'Ken', 'Radia', 'Frances', 'Hedy'];
const wideTeam: OrgChartNode[] = [
  {
    id: 'lead',
    label: 'Sophie Wilson',
    description: 'Head of Engineering',
    children: [
      {
        id: 'eng-mgr',
        label: 'Tim Berners-Lee',
        description: 'Engineering manager',
        children: names.map((n, i) => ({ id: `eng-${i}`, label: `${n} ${String.fromCharCode(65 + i)}.`, description: i % 2 ? 'Engineer' : 'Senior engineer' })),
      },
      { id: 'design', label: 'Susan Kare', description: 'Design lead', children: [{ id: 'd1', label: 'Jony Ive', description: 'Designer' }] },
      { id: 'qa', label: 'Edsger Dijkstra', description: 'QA lead' },
    ],
  },
];

/** `stackAbove={4}`: the 14 reports stack in a column instead of one row; the tree and arrow keys stay the same. */
export const WideTeamStacked: Story = {
  render: () => <OrgChart aria-label="Engineering" nodes={wideTeam} defaultExpanded={['lead', 'eng-mgr', 'design']} stackAbove={4} />,
};

/** `zoomable`: zoom out, in and fit; pinch or ctrl/⌘ + wheel; drag to pan; + / - / 0 with a card focused. */
export const Zoom: Story = {
  render: () => (
    <OrgChart
      aria-label="Engineering"
      nodes={wideTeam}
      defaultExpanded={['lead', 'eng-mgr', 'design']}
      zoomable
      defaultZoom={0.4}
      className="h-[32rem] rounded-shape-container border border-[var(--color-outline-variant)] p-2"
    />
  ),
};
