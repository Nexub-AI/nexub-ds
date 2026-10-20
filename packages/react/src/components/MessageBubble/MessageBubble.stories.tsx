import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MessageActions, MessageBubble } from './MessageBubble.js';
import { Avatar } from '../Avatar/Avatar.js';

const meta: Meta<typeof MessageBubble> = {
  title: 'AI/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof MessageBubble>;

const REPLY = 'Sure. The quarterly report is due Friday; I drafted an outline with the revenue summary first and the hiring plan last.';

export const Conversation: Story = {
  render: () => (
    <ol className="flex max-w-2xl list-none flex-col gap-6 p-0">
      <li>
        <MessageBubble from="system">Today</MessageBubble>
      </li>
      <li>
        <MessageBubble from="user">Can you outline the quarterly report for me?</MessageBubble>
      </li>
      <li>
        <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback="N" />}>
          <p>{REPLY}</p>
          <MessageActions text={REPLY} onFeedback={() => {}} onRegenerate={() => {}} />
        </MessageBubble>
      </li>
      <li>
        <MessageBubble from="user" status="error" onRetry={() => {}}>
          Add a section on churn too.
        </MessageBubble>
      </li>
    </ol>
  ),
};
