import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ResizablePanels } from './ResizablePanels.js';

const meta: Meta<typeof ResizablePanels> = {
  title: 'Layout/ResizablePanels',
  component: ResizablePanels,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ResizablePanels>;

const panel: React.CSSProperties = { padding: 16, height: '100%' };

export const Default: Story = {
  render: () => (
    <ResizablePanels
      defaultSizes={[30, 70]}
      style={{ height: 240, maxWidth: 640, border: '1px solid var(--color-outline-variant)', borderRadius: 12 }}
    >
      <div style={panel} className="text-body-md">Files</div>
      <div style={panel} className="text-body-md">Editor</div>
    </ResizablePanels>
  ),
};
