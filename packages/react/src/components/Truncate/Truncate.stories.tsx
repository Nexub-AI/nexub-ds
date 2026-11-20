import type { Meta, StoryObj } from '@storybook/react';
import { Truncate } from './Truncate.js';

const meta: Meta<typeof Truncate> = { title: 'Components/Truncate', component: Truncate, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Truncate>;

const long = 'Quarterly infrastructure invoice for the Singapore and Frankfurt regions, including support';

/** The first line is clipped (focus or hover it for the full text); the second fits, so it has no tooltip and no tab stop. */
export const Default: Story = {
  render: () => (
    <div className="flex w-56 max-w-full flex-col gap-2 text-body-md text-[var(--color-on-surface)]">
      <Truncate>{long}</Truncate>
      <Truncate>Short text</Truncate>
    </div>
  ),
};

export const MultiLine: Story = {
  render: () => (
    <div className="w-56 max-w-full text-body-md text-[var(--color-on-surface)]">
      <Truncate lines={2} as="p">
        {`${long}. ${long}.`}
      </Truncate>
    </div>
  ),
};
