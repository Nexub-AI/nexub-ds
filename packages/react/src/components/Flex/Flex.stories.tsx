import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './Flex.js';

const meta: Meta<typeof Flex> = {
  title: 'Components/Flex',
  component: Flex,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Flex>;

export const Default: Story = {
  args: {
    direction: 'row',
    gap: 4,
    align: 'center',
    children: (
      <>
        <div>Item A</div>
        <div>Item B</div>
      </>
    ),
  },
};
