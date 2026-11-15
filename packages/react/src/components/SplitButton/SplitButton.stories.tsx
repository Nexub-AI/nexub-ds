import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SplitButton } from './SplitButton.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';

const meta: Meta<typeof SplitButton> = {
  title: 'Components/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SplitButton>;

const menu = (
  <>
    <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
    <DropdownMenu.Item>Save a copy</DropdownMenu.Item>
  </>
);

/** Filled, tonal and outlined. The a11y suite opens the menu and scans it. */
export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <SplitButton menuLabel="More save options" menu={menu}>Save</SplitButton>
      <SplitButton variant="tonal" menuLabel="More save options" menu={menu}>Save</SplitButton>
      <SplitButton variant="outlined" menuLabel="More export options" menu={<DropdownMenu.Item>CSV</DropdownMenu.Item>}>
        Export
      </SplitButton>
    </div>
  ),
};
