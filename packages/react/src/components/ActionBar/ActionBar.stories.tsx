import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ActionBar } from './ActionBar.js';
import { Button } from '../Button/Button.js';

const meta: Meta<typeof ActionBar> = {
  title: 'Components/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ActionBar>;

/** Pinned to the bottom of a fixed-height scrolling form. */
export const Default: Story = {
  render: () => (
    <div style={{ height: 240, maxWidth: 560, overflow: 'auto', padding: 16 }}>
      <p className="text-body-md">Profile settings form content.</p>
      <div style={{ height: 160 }} />
      <ActionBar message="Unsaved changes">
        <Button variant="text">Discard</Button>
        <Button>Save</Button>
      </ActionBar>
    </div>
  ),
};
