import * as React from 'react';
import { MessageBubble, PromptInput, ThinkingIndicator, cn } from '@nexub/react';
import { Conversation } from '../Conversation/index.js';
import { usePageMessages, type ChatMessage, type PageTemplateMessages } from '../PageFrame/PageFrame.js';

export interface ChatPageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  /** Stop a streaming reply. Shows the stop button while the last message streams. */
  onStop?: () => void;
  /** Assistant is thinking (before the first token). */
  thinking?: boolean;
  placeholder?: string;
  /** Shown while there are no messages. */
  empty?: React.ReactNode;
  /** Assistant avatar beside its messages. */
  assistantAvatar?: React.ReactNode;
  /** Visible page title. Hidden headings still name the page for screen readers. @default messages.chat */
  title?: string;
  /** Show `title` visually. @default false */
  showTitle?: boolean;
  /** Landmark element. @default 'main' */
  as?: 'main' | 'div';
  /** Copy overrides (`messages` is the conversation). */
  strings?: Partial<PageTemplateMessages>;
}

/**
 * Full-height conversation: message list that follows new content, a
 * thinking indicator and a composer. Web twin of the native `ChatScreen`.
 * The parent sets the height (e.g. `h-dvh` or the app shell's content area).
 */
export const ChatPage = React.forwardRef<HTMLElement, ChatPageProps>(function ChatPage(
  {
    messages: list,
    onSend,
    onStop,
    thinking,
    placeholder,
    empty,
    assistantAvatar,
    title,
    showTitle = false,
    as: Tag = 'main',
    strings,
    className,
    ...props
  },
  ref,
) {
  const m = usePageMessages(strings);
  const [draft, setDraft] = React.useState('');
  const streaming = list.at(-1)?.streaming ?? false;
  const headingId = React.useId();
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      aria-labelledby={headingId}
      className={cn('flex h-full min-h-0 w-full flex-col', className)}
      {...props}
    >
      <h1 id={headingId} className={showTitle ? 'px-4 pt-4 text-title-lg text-[var(--color-on-surface)]' : 'sr-only'}>
        {title ?? m.chat}
      </h1>
      <Conversation
        className="min-h-0 flex-1"
        composer={
          <PromptInput
            value={draft}
            onValueChange={setDraft}
            placeholder={placeholder}
            status={streaming ? 'streaming' : thinking ? 'submitting' : 'idle'}
            onStop={onStop}
            onSubmit={(text) => {
              const t = text.trim();
              if (!t) return;
              onSend(t);
              setDraft('');
            }}
          />
        }
      >
        {list.length === 0 && !thinking ? (
          <div className="flex flex-1 items-center justify-center py-16 text-center text-body-md text-[var(--color-on-surface-muted)]">
            {empty ?? m.chatEmpty}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {list.map((msg) => (
              <MessageBubble
                key={msg.id}
                from={msg.role}
                avatar={msg.role === 'assistant' ? assistantAvatar : undefined}
                aria-busy={msg.streaming || undefined}
              >
                {msg.text}
              </MessageBubble>
            ))}
            {thinking && <ThinkingIndicator />}
          </div>
        )}
      </Conversation>
    </Tag>
  );
});
