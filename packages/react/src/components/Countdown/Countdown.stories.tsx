import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Countdown } from './Countdown.js';

// A frozen clock: the stories never change between screenshots.
const BASE = Date.UTC(2026, 0, 15, 9, 0, 0);
const now = () => BASE;

const meta: Meta<typeof Countdown> = { title: 'Components/Countdown', component: Countdown, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Countdown>;

export const Default: Story = { args: { to: BASE + 299_000, now } };

/** `tone="auto"`: neutral, warning under a minute, danger under ten seconds. */
export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Countdown to={BASE + 754_000} now={now} />
      <Countdown to={BASE + 42_000} now={now} />
      <Countdown to={BASE + 7_000} now={now} />
      <Countdown to={BASE + 4_325_000} now={now} size="lg" />
      <Countdown to={BASE + 42_000} now={now} size="sm" tone="neutral" />
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <p className="text-body-md text-[var(--color-on-surface)]">
      Your seat is held for <Countdown variant="inline" to={BASE + 299_000} now={now} />.
    </p>
  ),
};
