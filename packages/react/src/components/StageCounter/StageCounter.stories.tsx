import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StageCounter } from './StageCounter.js';

const meta: Meta<typeof StageCounter> = {
  title: 'Components/StageCounter',
  component: StageCounter,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StageCounter>;

const stages = [
  { value: 'queued', label: 'Queued', count: 24 },
  { value: 'processing', label: 'Processing', count: 6, tone: 'info' as const },
  { value: 'review', label: 'In review', count: 3, tone: 'warning' as const },
  { value: 'done', label: 'Done', count: 1284, failed: 7 },
];

const jobs = ['queued', 'processing', 'review', 'done', 'done', 'queued'].map((stage, i) => ({ id: i + 1, stage }));

/** Pressing a stage filters the list; pressing it again shows all. */
export const FiltersAList: Story = {
  render: function Render() {
    const [stage, setStage] = React.useState<string | null>(null);
    const shown = stage ? jobs.filter((j) => j.stage === stage) : jobs;
    return (
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <StageCounter aria-label="Filter jobs by stage" stages={stages} value={stage} onValueChange={setStage} />
        <ul className="m-0 flex flex-col gap-1 ps-4 text-body-md text-on-surface">
          {shown.map((j) => (
            <li key={j.id}>Job {j.id} · {j.stage}</li>
          ))}
        </ul>
      </div>
    );
  },
};

/** `multiple`: several stages at once; an empty array means all. */
export const Multiple: Story = {
  render: () => <StageCounter aria-label="Filter jobs by stage" stages={stages} multiple defaultValue={['queued', 'review']} />,
};
