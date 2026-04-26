import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid.js';

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  args: {
    cols: 3,
    gap: 4,
    children: (
      <>
        <div>Cell 1</div>
        <div>Cell 2</div>
        <div>Cell 3</div>
      </>
    ),
  },
};
