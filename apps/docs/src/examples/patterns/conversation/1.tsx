'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { PromptInput, MessageBubble } from '@nexub/react';
import { Conversation } from '@nexub/patterns';

type ChatMessage = { id: number; from: 'user' | 'other'; text: string };

export default function Example() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 1, from: 'other', text: 'Morning! Did the invoices go out?' },
  ]);
  return (
    <div className="w-full">
      <Conversation
        maxHeight="20rem"
        composer={
          <PromptInput
            placeholder="Reply to Grace"
            onSubmit={(text) => setMessages((m) => [...m, { id: Date.now(), from: 'user', text }])}
          />
        }
      >
        {messages.map((msg) =>
          msg.from === 'other' ? (
            <MessageBubble key={msg.id} from="other" name="Grace Hopper">
              {msg.text}
            </MessageBubble>
          ) : (
            <MessageBubble key={msg.id} from="user">
              {msg.text}
            </MessageBubble>
          ),
        )}
      </Conversation>
    </div>
  );
}
