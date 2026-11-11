import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from './ButtonGroup.js';
import { Button } from '../Button/index.js';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="tonal">One</Button>
      <Button variant="tonal">Two</Button>
      <Button variant="tonal">Three</Button>
    </ButtonGroup>
  ),
  args: {
    orientation: 'horizontal',
    attached: false,
  },
};
