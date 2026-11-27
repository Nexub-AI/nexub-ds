import type { Meta, StoryObj } from '@storybook/react';
import { Zap } from '@nexub/icons';
import { Badge } from './Badge.js';
import { AgentBadge } from './AgentBadge.js';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
    tone: 'neutral',
    variant: 'solid',
    size: 'md',
  },
};

export const Dot: Story = {
  args: { dot: true, tone: 'success', 'aria-label': 'Online' },
};

export const Count: Story = {
  args: { count: 120, max: 99, tone: 'danger' },
};

/** 12.2: AgentBadge, for an agent's chat header. A soft Badge with a leading sparkle. */
export const Agent: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <AgentBadge>AI on your own key</AgentBadge>
      <AgentBadge tone="info">Buttons only</AgentBadge>
      <AgentBadge tone="success" icon={<Zap size={14} />}>
        Fast mode
      </AgentBadge>
      <AgentBadge size="sm">AI</AgentBadge>
      <AgentBadge size="lg" category="violet">
        Payhub agent
      </AgentBadge>
    </div>
  ),
};
