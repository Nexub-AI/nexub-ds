import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from './AvatarGroup.js';
import { Avatar } from '../Avatar/Avatar.js';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar name="Alice Smith" />
      <Avatar name="Bob Jones" />
      <Avatar name="Carol White" />
      <Avatar name="Dave Brown" />
      <Avatar name="Eve Davis" />
    </AvatarGroup>
  ),
  args: {
    max: 3,
    size: 'md',
    spacing: 'md',
  },
};
