import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Folder, Home, Settings } from '@nexub/icons';
import { NavigationRail } from './NavigationRail.js';

const meta: Meta = {
  title: 'Navigation/NavigationRail',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

/** Home is the current page. */
export const Default: Story = {
  render: () => (
    <div style={{ height: 320 }}>
      <NavigationRail.Root aria-label="Workspace">
        <NavigationRail.Item href="#" icon={<Home />} label="Home" active />
        <NavigationRail.Item href="#" icon={<Folder />} label="Files" />
        <NavigationRail.Item href="#" icon={<Settings />} label="Settings" />
      </NavigationRail.Root>
    </div>
  ),
};
