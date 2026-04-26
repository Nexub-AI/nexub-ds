import * as React from 'react';
import type { Meta } from '@storybook/react';
import { ToggleGroup } from './ToggleGroup.js';

const meta: Meta = {
  title: 'Components/ToggleGroup',
};

export default meta;

export const Default = () => (
  <ToggleGroup.Root type="single" aria-label="Text alignment">
    <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
    <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
    <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
  </ToggleGroup.Root>
);
