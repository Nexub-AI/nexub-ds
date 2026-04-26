import * as React from 'react';
import type { Meta } from '@storybook/react';
import { RadioGroup } from './RadioGroup.js';

const meta: Meta = {
  title: 'Components/RadioGroup',
};

export default meta;

export const Default = () => (
  <RadioGroup.Root aria-label="Options">
    <RadioGroup.Item value="a" aria-label="Option A" />
    <RadioGroup.Item value="b" aria-label="Option B" />
    <RadioGroup.Item value="c" aria-label="Option C" />
  </RadioGroup.Root>
);
