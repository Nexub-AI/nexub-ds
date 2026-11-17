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

/** The Signature controls (the only style since 9.0): every state side by side. */
export const Signature = () => (
  <div className="flex gap-8">
    {(['signature'] as const).map((style) => (
      <div key={style} data-style={style} className="flex flex-col gap-2">
        <span className="text-label-md">{style}</span>
        <RadioGroup.Root aria-label={`${style} options`} defaultValue="a">
          <RadioGroup.Item value="a" aria-label="Option A" />
          <RadioGroup.Item value="b" aria-label="Option B" />
          <RadioGroup.Item value="c" aria-label="Option C" disabled />
        </RadioGroup.Root>
      </div>
    ))}
  </div>
);

/** 10.4: sizes, invalid and read-only side by side. */
export const ConsistentControls = () => (
  <div className="flex flex-wrap items-start gap-6">
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <RadioGroup.Root key={size} size={size} aria-label={`${size} options`} defaultValue="a">
        <RadioGroup.Item value="a" aria-label="Option A" />
        <RadioGroup.Item value="b" aria-label="Option B" />
      </RadioGroup.Root>
    ))}
    <RadioGroup.Root invalid aria-label="invalid options">
      <RadioGroup.Item value="a" aria-label="Option A" />
      <RadioGroup.Item value="b" aria-label="Option B" />
    </RadioGroup.Root>
    <RadioGroup.Root readOnly aria-label="read-only options" defaultValue="a">
      <RadioGroup.Item value="a" aria-label="Option A" />
      <RadioGroup.Item value="b" aria-label="Option B" />
    </RadioGroup.Root>
  </div>
);
