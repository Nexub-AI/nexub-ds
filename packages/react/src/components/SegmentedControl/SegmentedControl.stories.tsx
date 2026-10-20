import * as React from 'react';
import type { Meta } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl.js';

const meta: Meta = {
  title: 'Components/SegmentedControl',
};

export default meta;

export const Default = () => (
  <SegmentedControl.Root aria-label="View mode">
    <SegmentedControl.Item value="list">List</SegmentedControl.Item>
    <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
    <SegmentedControl.Item value="table">Table</SegmentedControl.Item>
  </SegmentedControl.Root>
);

/** A selection, in every size: the thumb sits under the selected item. */
export const Selected = () => (
  <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <SegmentedControl.Root key={size} size={size} defaultValue="grid" aria-label={`View mode (${size})`}>
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
        <SegmentedControl.Item value="table">Table</SegmentedControl.Item>
      </SegmentedControl.Root>
    ))}
  </div>
);
