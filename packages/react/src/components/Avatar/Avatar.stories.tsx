import type { Meta, StoryObj } from '@storybook/react';
import { CreditCard, Terminal } from '@nexub/icons';
import { Avatar } from './Avatar.js';
import { AgentAvatar } from './AgentAvatar.js';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: 'John Doe',
    size: 'md',
  },
};

export const WithStatus: Story = {
  args: { name: 'Ada Lovelace', status: 'away' },
};

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/** 12.2: an agent is an app tile with an AI mark, so it never looks like a colleague. Same sizes as Avatar. */
export const AgentSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {sizes.map((size) => (
          <Avatar key={size} name="Ada Lovelace" size={size} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {sizes.map((size) => (
          <AgentAvatar key={size} name="Payhub agent" icon={<CreditCard />} size={size} />
        ))}
      </div>
    </div>
  ),
};

/** Default bot glyph, an app glyph, category colours, and the mark at the inline end in RTL. */
export const AgentVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <AgentAvatar name="Nexub agent" size="lg" />
        <AgentAvatar name="devX agent" icon={<Terminal />} size="lg" />
        <AgentAvatar name="Payhub agent" icon={<CreditCard />} category="emerald" size="lg" />
        <AgentAvatar name="devX agent" icon={<Terminal />} category="blue" size="lg" />
      </div>
      <div dir="rtl" className="flex items-center gap-4">
        <AgentAvatar name="Payhub agent" icon={<CreditCard />} size="md" />
        <AgentAvatar name="Payhub agent" icon={<CreditCard />} size="xl" />
      </div>
    </div>
  ),
};
