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
      <Button variant="secondary">One</Button>
      <Button variant="secondary">Two</Button>
      <Button variant="secondary">Three</Button>
    </ButtonGroup>
  ),
  args: {
    orientation: 'horizontal',
    attached: false,
  },
};
