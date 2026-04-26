import type { Meta, StoryObj } from '@storybook/react';
import { Code } from './Code.js';

const meta: Meta<typeof Code> = {
  title: 'Components/Code',
  component: Code,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Code>;

export const Default: Story = {
  args: {
    children: 'const x = 42;',
    inline: true,
  },
};

export const Block: Story = {
  args: {
    inline: false,
    language: 'tsx',
    children: 'function hello() {\n  return "world";\n}',
  },
};
