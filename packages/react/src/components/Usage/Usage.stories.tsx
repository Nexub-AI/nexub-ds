import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { UsageBar, UsageTile } from './Usage.js';

const meta: Meta<typeof UsageTile> = {
  title: 'Components/Usage',
  component: UsageTile,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof UsageTile>;

/** Under, near and at the limit, and no limit. The level is said in text as well as colour. */
export const Tiles: Story = {
  render: () => (
    <div className="grid w-full max-w-3xl grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
      <UsageTile label="Seats" used={12} limit={50} note="Billed per seat" />
      <UsageTile label="Storage" used={8.6} limit={10} valueFormat={(n) => `${n} GB`} action={<a href="#upgrade" className="text-label-md text-primary">Upgrade</a>} />
      <UsageTile label="API calls" used={100000} limit={100000} note="Resets on 1 May" />
      <UsageTile label="Projects" used={42} limit={null} />
    </div>
  ),
};

/** 10.5 data states, same as KpiTile. */
export const DataStates: Story = {
  render: () => (
    <div className="grid w-full max-w-3xl grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
      <UsageTile label="Seats" used={12} limit={50} loading />
      <UsageTile label="Seats" used={null} limit={50} />
      <UsageTile label="Seats" used={12} limit={50} errorState={<span className="text-body-sm text-error">Could not load usage</span>} />
    </div>
  ),
};

/** The compact bar for table cells and fact grids. */
export const Bars: Story = {
  render: () => (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <UsageBar aria-label="Seats" used={18} limit={50} />
      <UsageBar aria-label="Seats" used={42} limit={50} />
      <UsageBar aria-label="Seats" used={50} limit={50} />
      <UsageBar aria-label="Storage" used={3.2} limit={5} size="md" valueFormat={(n) => `${n} GB`} />
      <UsageBar aria-label="Projects" used={7} limit={null} />
    </div>
  ),
};
