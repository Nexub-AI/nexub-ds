import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link.js';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'Visit page',
    variant: 'default',
  },
};

export const External: Story = {
  args: {
    href: 'https://nexub.io',
    children: 'Nexub website',
    external: true,
  },
};
