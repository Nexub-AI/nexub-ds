import type { Meta, StoryObj } from '@storybook/react';
import { CheckList } from './CheckList.js';

const meta: Meta<typeof CheckList> = {
  title: 'Components/CheckList',
  component: CheckList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CheckList>;

export const Default: Story = {
  args: {
    items: [
      'TypeScript strict mode',
      'Accessible by default',
      'Dark mode ready',
      'Composable via asChild',
    ],
  },
};
