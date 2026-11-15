'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { type PromptInputStatus, PromptInput, MessageBubble, ThinkingIndicator, StreamingText, Citation, type CitationSource } from '@nexub/react';
import { Conversation } from '@nexub/patterns';

const CITATION_SOURCES: CitationSource[] = [
  { title: 'Choosing a heat pump', url: 'https://example.com/guides/heat-pumps', snippet: 'Air-source pumps suit most homes with a garden or outside wall.' },
  { title: 'Grants for home heating', url: 'https://example.org/grants', domain: 'example.org' },
  { title: 'Running costs compared', url: 'https://example.net/costs' },
];

type ChatMessage = { id: number; from: 'user' | 'assistant'; text: string };

const CHAT_REPLY = 'Air-source heat pumps work in most homes and run at roughly the cost of gas.';

const CHAT_SOURCE = CITATION_SOURCES[0]!;

export default function Example() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [status, setStatus] = React.useState<PromptInputStatus>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  function send(text: string) {
    const id = Date.now();
    setMessages((m) => [...m, { id, from: 'user', text }, { id: id + 1, from: 'assistant', text: '' }]);
    setStatus('submitting');
    timer.current = setTimeout(() => {
      setStatus('streaming');
      stream(id + 1, 0);
    }, 800);
  }

  function stream(id: number, length: number) {
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: CHAT_REPLY.slice(0, length) } : msg)));
    if (length >= CHAT_REPLY.length) return setStatus('idle');
    timer.current = setTimeout(() => stream(id, length + 4), 50);
  }

  function stop() {
    clearTimeout(timer.current);
    setStatus('idle');
  }

  const last = messages[messages.length - 1];

  return (
    <Conversation
      className="h-[420px] w-full"
      composer={<PromptInput placeholder="Ask about heat pumps" status={status} onSubmit={send} onStop={stop} />}
    >
      {messages.map((msg) =>
        msg.from === 'user' ? (
          <MessageBubble key={msg.id} from="user">{msg.text}</MessageBubble>
        ) : (
          <MessageBubble key={msg.id} from="assistant">
            {status === 'submitting' && msg === last ? (
              <ThinkingIndicator />
            ) : (
              <>
                <StreamingText as="span" text={msg.text} streaming={status === 'streaming' && msg === last} />
                {msg.text === CHAT_REPLY && <Citation index={1} source={CHAT_SOURCE} />}
              </>
            )}
          </MessageBubble>
        ),
      )}
    </Conversation>
  );
}
