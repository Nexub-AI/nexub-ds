import type { Meta, StoryObj } from '@storybook/react';
import { TreeView, type TreeNode } from './TreeView.js';

const meta: Meta = {
  title: 'Components/TreeView',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const nodes: TreeNode[] = [
  {
    id: 'eng',
    label: 'Engineering',
    children: [
      { id: 'web', label: 'Web', children: [{ id: 'ada', label: 'Ada Lovelace' }, { id: 'alan', label: 'Alan Turing' }] },
      { id: 'mobile', label: 'Mobile' },
    ],
  },
  { id: 'design', label: 'Design', children: [{ id: 'grace', label: 'Grace Hopper' }] },
  { id: 'ops', label: 'Operations', disabled: true },
];

export const Default: Story = {
  render: () => <TreeView aria-label="Teams" nodes={nodes} defaultExpanded={['eng', 'web']} defaultSelected="ada" className="max-w-xs" />,
};
export const Checkable: Story = {
  render: () => (
    <TreeView aria-label="Teams" nodes={nodes} checkable defaultExpanded={['eng', 'web']} defaultChecked={['ada']} className="max-w-xs" />
  ),
};
