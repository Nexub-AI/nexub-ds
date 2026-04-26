import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio.js';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
    children: <div style={{ background: 'var(--color-bg-muted)', width: '100%', height: '100%' }} />,
  },
};
