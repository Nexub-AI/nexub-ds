import type { Meta, StoryObj } from '@storybook/react';
import { NotificationCenter } from './NotificationCenter.js';

const meta: Meta = {
  title: 'Patterns/NotificationCenter',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NotificationCenter
      notifications={[
        { id: '1', title: 'Deploy failed on main', timestamp: '2 min ago' },
        { id: '2', title: 'Invoice #1042 paid', timestamp: '1 h ago', read: true },
      ]}
      onOpen={() => {}}
      onMarkAllRead={() => {}}
    />
  ),
};
