import type { Meta, StoryObj } from '@storybook/react';
import { SavedViews } from './SavedViews.js';

const meta: Meta = {
  title: 'Components/SavedViews',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SavedViews
      views={[
        { id: 'mine', name: 'My open deals' },
        { id: 'big', name: 'Over $10k' },
      ]}
      activeId="mine"
      onSelect={() => {}}
      onSave={() => {}}
    />
  ),
};
