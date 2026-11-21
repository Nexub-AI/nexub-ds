import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ColorPicker } from './ColorPicker.js';

const meta: Meta<typeof ColorPicker> = {
  title: 'Forms/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('#2563eb');
    return (
      <div style={{ maxWidth: 240 }}>
        <ColorPicker aria-label="Brand colour" value={value} onValueChange={setValue} />
      </div>
    );
  },
};

/** `contrastAgainst` shows the WCAG ratio against a background and the AA text hint (4.5:1). */
export const ContrastHint: Story = {
  render: () => {
    const [value, setValue] = React.useState('#777777');
    return (
      <div style={{ maxWidth: 240 }}>
        <ColorPicker aria-label="Text colour" value={value} onValueChange={setValue} contrastAgainst="#ffffff" />
      </div>
    );
  },
};

export const NamedSwatches: Story = {
  args: {
    'aria-label': 'Label colour',
    defaultValue: '#16a34a',
    swatches: [
      { value: '#dc2626', label: 'Red' },
      { value: '#ca8a04', label: 'Amber' },
      { value: '#16a34a', label: 'Green' },
      { value: '#2563eb', label: 'Blue' },
    ],
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 240 }}>
      <ColorPicker aria-label="Invalid" invalid />
      <ColorPicker aria-label="Read-only" readOnly defaultValue="#7c3aed" />
      <ColorPicker aria-label="Disabled" disabled defaultValue="#db2777" />
      <ColorPicker aria-label="Small" size="sm" />
    </div>
  ),
};
