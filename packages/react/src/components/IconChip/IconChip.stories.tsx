import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CreditCard } from '@nexub/icons';
import { CATEGORY_COLORS } from '@nexub/core';
import { IconChip } from './IconChip.js';
import { Badge } from '../Badge/Badge.js';
import { Avatar } from '../Avatar/Avatar.js';

const meta: Meta<typeof IconChip> = { title: 'Components/IconChip', component: IconChip, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof IconChip>;

export const Default: Story = { args: { category: 'violet', children: <CreditCard /> } };

/** The nine category colours on IconChip, Badge and Avatar. */
export const Categories: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-[auto_auto_auto_auto] items-center gap-x-6 gap-y-3">
      {CATEGORY_COLORS.map((c) => (
        <React.Fragment key={c}>
          <IconChip category={c}><CreditCard /></IconChip>
          <Badge category={c} variant="soft">{c}</Badge>
          <Badge category={c} variant="outline">{c}</Badge>
          <Avatar category={c} name="Ada Lovelace" />
        </React.Fragment>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconChip size="sm" category="blue"><CreditCard /></IconChip>
      <IconChip size="md" category="blue"><CreditCard /></IconChip>
      <IconChip size="lg" category="blue"><CreditCard /></IconChip>
      <IconChip size="lg" category="blue" shape="circle"><CreditCard /></IconChip>
      <IconChip><CreditCard /></IconChip>
    </div>
  ),
};
