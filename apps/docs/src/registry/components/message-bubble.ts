import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'message-bubble',
    title: 'Message Bubble',
    description: 'One message in a conversation. User messages sit in a bubble at the end; assistant replies run full width. MessageActions adds copy, feedback and regenerate.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.8.0',
    related: ['streaming-text', 'conversation', 'citation'],
  },
  props: [
    { name: 'from', type: "'user' | 'assistant' | 'system'", required: true, description: 'Who sent it. Sets layout and the default accessible name.' },
    { name: 'avatar', type: 'ReactNode', required: false, description: 'Assistant only: shown at the inline start.' },
    { name: 'name', type: 'string', required: false, description: 'Accessible name of the message. Defaults to "You said" or "Assistant said".' },
    { name: 'status', type: "'sending' | 'error'", required: false, description: '`sending` sets `aria-busy`; `error` shows "Failed to send".' },
    { name: 'onRetry', type: '() => void', required: false, description: 'With `status="error"`, adds a Retry button.' },
    { name: 'messages', type: 'Partial<MessageStrings>', required: false, description: 'Local string overrides.' },
    { name: 'MessageActions text', type: 'string', required: false, description: 'Text Copy puts on the clipboard.' },
    { name: 'MessageActions copy', type: 'boolean', default: 'true', required: false, description: 'Set false to hide Copy.' },
    { name: 'MessageActions feedback / defaultFeedback / onFeedback', type: "'up' | 'down' | null", required: false, description: 'Thumbs up/down appear when `onFeedback` is set. Pressing the active one clears it.' },
    { name: 'MessageActions onRegenerate', type: '() => void', required: false, description: 'Shows Regenerate when set.' },
  ],
  examples: [
    {
      title: 'Conversation',
      description: 'Hover or focus the assistant reply to show its actions.',
      code: `<MessageBubble from="user">How do I cancel my subscription?</MessageBubble>
<MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
  <p>Open Settings, then Billing, and choose Cancel plan. You keep access until the end of the billing period.</p>
  <MessageActions
    text="Open Settings, then Billing, and choose Cancel plan."
    onFeedback={(value) => logFeedback(value)}
    onRegenerate={() => regenerate()}
  />
</MessageBubble>
<MessageBubble from="system">Conversation moved to Billing support</MessageBubble>`,
    },
    {
      title: 'Failed to send',
      code: `<MessageBubble from="user" status="error" onRetry={() => resend()}>
  Can I get a refund for last month?
</MessageBubble>`,
    },
  ],
  usage: {
    whenToUse: [
      'Each turn in a chat or assistant thread, inside Conversation.',
      'MessageActions under assistant replies the user may want to copy, rate or retry.',
    ],
    whenNotToUse: [
      'Comment threads and activity logs: use ActivityFeed or NotificationItem.',
      'Model output as HTML: render text or React elements as children, never `dangerouslySetInnerHTML`.',
    ],
  },
  a11y: {
    roles: ['article (each message)', 'alert (send error)', 'button (actions)'],
    keyboard: [
      { key: 'Tab', description: 'Moves through the action buttons; focusing one reveals the row.' },
      { key: 'Space / Enter', description: 'Activates an action. Feedback buttons toggle.' },
    ],
    screenReader: [
      'Each message is an `article` named "You said" or "Assistant said", so users can jump between messages.',
      'Feedback buttons expose `aria-pressed`. Copy announces "Copied" through a status region.',
      'The action row is only visually hidden until hover; it stays in the tab order and accessibility tree.',
    ],
  },
};

export default entry;
