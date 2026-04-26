import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Toolbar } from './Toolbar.js';

const meta: Meta = {
  title: 'Navigation/Toolbar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toolbar.Root aria-label="Text formatting">
      <Toolbar.ToggleGroup type="multiple" aria-label="Text style">
        <Toolbar.ToggleItem value="bold" aria-label="Bold">
          <strong style={{ fontSize: '13px' }}>B</strong>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="italic" aria-label="Italic">
          <em style={{ fontSize: '13px' }}>I</em>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="underline" aria-label="Underline">
          <span style={{ fontSize: '13px', textDecoration: 'underline' }}>U</span>
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator />
      <Toolbar.ToggleGroup type="single" aria-label="Text alignment">
        <Toolbar.ToggleItem value="left" aria-label="Align left">
          &#8676;
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="center" aria-label="Align center">
          &#8677;
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="right" aria-label="Align right">
          &#8680;
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator />
      <Toolbar.Button>Clear</Toolbar.Button>
    </Toolbar.Root>
  ),
};
