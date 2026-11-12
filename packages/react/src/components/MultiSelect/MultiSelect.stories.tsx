import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MultiSelect } from './MultiSelect.js';

const meta: Meta = {
  title: 'Components/MultiSelect',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const labels = [
  { value: 'bug', label: 'Bug' },
  { value: 'design', label: 'Design' },
  { value: 'docs', label: 'Docs' },
  { value: 'perf', label: 'Performance' },
  { value: 'a11y', label: 'Accessibility' },
  { value: 'security', label: 'Security' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState(['bug', 'a11y']);
    return (
      <div style={{ width: '320px', maxWidth: '100%' }}>
        <MultiSelect aria-label="Labels" options={labels} value={value} onValueChange={setValue} placeholder="Add labels…" />
      </div>
    );
  },
};

export const MoreChips: Story = {
  render: () => (
    <div style={{ width: '320px', maxWidth: '100%' }}>
      <MultiSelect aria-label="Labels" options={labels} defaultValue={['bug', 'design', 'docs', 'perf', 'a11y']} maxVisibleChips={2} />
    </div>
  ),
};
