'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { PromptInput, MessageBubble, ThinkingIndicator } from '@nexub/react';
import { Conversation, DateSeparator } from '@nexub/patterns';

type ChatMessage = { id: number; from: 'user' | 'assistant'; text: string; at: Date };

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export default function Example() {
  const [busy, setBusy] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 1, from: 'user', text: 'Can you total last week’s invoices?', at: daysAgo(3) },
    { id: 2, from: 'assistant', text: 'Twelve invoices, £8,420 in all.', at: daysAgo(3) },
    { id: 3, from: 'user', text: 'Which ones are still unpaid?', at: daysAgo(1) },
    { id: 4, from: 'assistant', text: 'Three: Acme, Globex and Initech.', at: daysAgo(1) },
  ]);
  const send = (text: string) => {
    setMessages((m) => [...m, { id: Date.now(), from: 'user', text, at: new Date() }]);
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now(), from: 'assistant', text: 'On it: reminders drafted.', at: new Date() }]);
      setBusy(false);
    }, 1500);
  };
  return (
    <div className="w-full">
      <Conversation
        maxHeight="24rem"
        thinking={busy ? <ThinkingIndicator /> : null}
        composer={<PromptInput placeholder="Ask about your invoices" onSubmit={send} />}
      >
        {messages.map((msg, i) => (
          <React.Fragment key={msg.id}>
            {(i === 0 || !sameDay(messages[i - 1]!.at, msg.at)) && <DateSeparator date={msg.at} />}
            <MessageBubble from={msg.from}>{msg.text}</MessageBubble>
          </React.Fragment>
        ))}
      </Conversation>
    </div>
  );
}
