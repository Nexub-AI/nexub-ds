import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Provider, Tooltip } from './Tooltip.js';

const meta: Meta = {
  title: 'Overlays/Tooltip',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Provider>
      <Tooltip label="Save your changes">
        <button>Save</button>
      </Tooltip>
    </Provider>
  ),
};

export const Rich: Story = {
  render: () => (
    <Tooltip label="Save" description="Writes the draft to your workspace." shortcut="⌘S" arrow>
      <button>Save</button>
    </Tooltip>
  ),
};
