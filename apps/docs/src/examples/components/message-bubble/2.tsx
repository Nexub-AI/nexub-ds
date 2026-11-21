'use client'; // docs preview: server pages import every example

import { MessageBubble, Avatar, MessageActions, toast } from '@nexub/react';
import { Pin, Sparkles } from '@nexub/icons';

const REPLY = 'I moved the review to Thursday at 10:00 and told the team.';

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch w-full max-w-140">
      <MessageBubble from="other" name="Ada Lovelace" meta="09:40" avatar={<Avatar size="sm" fallback="AL" />}>
        Can we move the review to Thursday?
      </MessageBubble>
      <MessageBubble from="user" meta="09:41">
        Thursday works for me.
      </MessageBubble>
      <MessageBubble from="assistant" meta="09:41" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
        <p>{REPLY}</p>
        <MessageActions
          text={REPLY}
          actions={[{ label: 'Pin to thread', icon: <Pin size="sm" aria-hidden="true" />, onSelect: () => toast.info('Pinned') }]}
        />
      </MessageBubble>
    </div>
  );
}
