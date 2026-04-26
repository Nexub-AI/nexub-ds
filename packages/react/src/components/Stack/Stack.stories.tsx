import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack.js';

const meta: Meta<typeof Stack> = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  args: {
    direction: 'column',
    gap: 4,
    children: (
      <>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </>
    ),
  },
};
