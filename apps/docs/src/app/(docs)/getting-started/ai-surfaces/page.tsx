import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Building AI surfaces' };

// Mirrors the "// AI surfaces" block of defaultMessages in
// packages/react/src/components/NexubProvider/NexubProvider.tsx.
const messageKeys: [key: string, value: string, usedBy: string][] = [
  ['promptLabel', "'Message'", 'PromptInput'],
  ['sendMessage', "'Send message'", 'PromptInput'],
  ['stopGenerating', "'Stop generating'", 'PromptInput'],
  ['promptHint', "'Press Enter to send, Shift+Enter for a new line'", 'PromptInput'],
  ['thinking', "'Thinking'", 'ThinkingIndicator'],
  ['youSaid', "'You said'", 'MessageBubble'],
  ['assistantSaid', "'Assistant said'", 'MessageBubble'],
  ['failedToSend', "'Failed to send'", 'MessageBubble'],
  ['retry', "'Retry'", 'MessageBubble'],
  ['copy', "'Copy'", 'MessageActions'],
  ['copied', "'Copied'", 'MessageActions'],
  ['goodResponse', "'Good response'", 'MessageActions'],
  ['badResponse', "'Bad response'", 'MessageActions'],
  ['regenerate', "'Regenerate'", 'MessageActions'],
  ['sources', "'Sources'", 'SourceList'],
  ['source', '(n) => `Source ${n}`', 'Citation'],
  ['jumpToLatest', "'Jump to latest'", 'Conversation'],
  ['conversation', "'Conversation'", 'Conversation'],
];

const parts: [name: string, href: string, what: string][] = [
  ['Conversation', '/patterns/conversation', 'Scrolling message list with a sticky composer. Follows new content while the reader is at the bottom.'],
  ['PromptInput', '/components/prompt-input', 'The composer. Send turns into Stop while a reply streams.'],
  ['MessageBubble', '/components/message-bubble', 'One message; MessageActions adds copy, feedback and regenerate.'],
  ['ThinkingIndicator', '/components/thinking-indicator', 'Fills the gap between sending and the first token.'],
  ['StreamingText', '/components/streaming-text', 'Renders text as it arrives without reflowing what is already there.'],
  ['Citation, SourceList', '/components/citation', 'Numbered source markers and the source row under a reply.'],
];

export default function AiSurfacesPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Getting Started
      </p>
      <h1>Building AI surfaces</h1>
      <p>
        A small kit for chat and assistant UIs. The components only render state: you own the request, the
        stream and the message list. They work with any model or SDK.
      </p>

      <h2>The kit</h2>
      <table>
        <thead>
          <tr><th>Component</th><th>What it does</th></tr>
        </thead>
        <tbody>
          {parts.map(([name, href, what]) => (
            <tr key={name}>
              <td><Link href={href}><code>{name}</code></Link></td>
              <td>{what}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        A reply moves through three states, and each has one component. Drive them from a single{' '}
        <code>status</code> value and pass it to <code>PromptInput</code> as well:
      </p>
      <CodeBlock code={`<Conversation composer={<PromptInput status={status} onSubmit={send} onStop={stop} />}>
  {messages.map((m) => (
    <MessageBubble key={m.id} from={m.from}>
      {status === 'submitting' && m.id === lastId
        ? <ThinkingIndicator />
        : <StreamingText text={m.text} streaming={status === 'streaming' && m.id === lastId} />}
    </MessageBubble>
  ))}
</Conversation>`} />
      <p>
        The <Link href="/patterns/conversation">Conversation</Link> page has a working version with Stop and a citation.
      </p>

      <h2>Motion</h2>
      <ul>
        <li>
          Motion only shows state. The thinking shape morphs because the assistant is working; new text fades in
          because it just arrived; the caret blinks because more is coming. Nothing moves for decoration.
        </li>
        <li>
          Text already on screen never moves. StreamingText animates only the newest chunks, and Conversation
          follows the bottom only while the reader is there.
        </li>
        <li>
          Reduced motion turns it all off: the thinking shape and shimmer are static, chunks appear without
          fading, the caret stops blinking, and Jump to latest scrolls instantly. The state is still visible.
        </li>
      </ul>

      <h2>Accessibility</h2>
      <ul>
        <li>
          Don’t make streaming text a live region. Screen readers re-read the whole region on every token.
          StreamingText and Conversation both default to off; keep it that way while tokens arrive.
        </li>
        <li>
          Announce completion once. When a reply finishes, put a short message such as “Reply ready” in a polite
          status region, or turn on Conversation’s <code>announce</code> if you add whole messages at once
          instead of streaming.
        </li>
        <li>
          Keep focus in the composer. PromptInput leaves focus in the field after sending; don’t move it to the
          new message. Users read back with their screen reader’s article navigation, since each MessageBubble is
          an <code>article</code>.
        </li>
        <li>
          Stop with Escape. While <code>status=&quot;streaming&quot;</code>, Escape in the field calls{' '}
          <code>onStop</code>, the same as the Stop button.
        </li>
        <li>
          ThinkingIndicator is a polite status: it is announced once when it appears. Remove it when tokens start.
        </li>
      </ul>

      <h2>Security</h2>
      <ul>
        <li>
          Citations only link <code>http:</code> and <code>https:</code> URLs. Anything else, including{' '}
          <code>javascript:</code> and <code>data:</code>, renders as plain text. Use the exported{' '}
          <code>safeUrl()</code> for any other link built from model output.
        </li>
        <li>
          Never render model output as HTML. StreamingText renders text only. If you want Markdown, parse it to
          React elements with raw HTML disabled; don’t pass it to <code>dangerouslySetInnerHTML</code>.
        </li>
        <li>
          Source links open in a new tab with <code>rel=&quot;noopener noreferrer&quot;</code>, and favicons load
          with <code>referrerPolicy=&quot;no-referrer&quot;</code>.
        </li>
      </ul>

      <h2>Message keys</h2>
      <p>
        The AI components read these strings from <Link href="/getting-started/internationalization">NexubProvider</Link>.
        Each component also takes a <code>messages</code> prop for local overrides.
      </p>
      <table>
        <thead>
          <tr><th>Key</th><th>Default</th><th>Used by</th></tr>
        </thead>
        <tbody>
          {messageKeys.map(([key, value, usedBy]) => (
            <tr key={key}>
              <td><code>{key}</code></td>
              <td><code>{value}</code></td>
              <td>{usedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
