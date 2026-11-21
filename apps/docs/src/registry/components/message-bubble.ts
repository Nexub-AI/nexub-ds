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
    { name: 'from', type: "'user' | 'assistant' | 'system' | 'other'", required: true, description: 'Who sent it. Sets layout and the default accessible name. `other` (11.5) is a third party in a group conversation.' },
    { name: 'avatar', type: 'ReactNode', required: false, description: 'Assistant and other: shown at the inline start.' },
    { name: 'name', type: 'string', required: false, description: 'Accessible name of the message. Defaults to "You said" or "Assistant said". With `from="other"` it is also shown as the header.' },
    { name: 'meta', type: 'ReactNode', required: false, description: '11.5: header text beside the name, e.g. the time.' },
    { name: 'status', type: "'sending' | 'error'", required: false, description: '`sending` sets `aria-busy`; `error` shows "Failed to send".' },
    { name: 'onRetry', type: '() => void', required: false, description: 'With `status="error"`, adds a Retry button.' },
    { name: 'messages', type: 'Partial<MessageStrings>', required: false, description: 'Local string overrides.' },
    { name: 'MessageActions text', type: 'string', required: false, description: 'Text Copy puts on the clipboard.' },
    { name: 'MessageActions copy', type: 'boolean', default: 'true', required: false, description: 'Set false to hide Copy.' },
    { name: 'MessageActions feedback / defaultFeedback / onFeedback', type: "'up' | 'down' | null", required: false, description: 'Thumbs up/down appear when `onFeedback` is set. Pressing the active one clears it.' },
    { name: 'MessageActions onRegenerate', type: '() => void', required: false, description: 'Shows Regenerate when set.' },
    { name: 'MessageActions actions', type: '{ label: string; icon: ReactNode; onSelect: () => void; disabled?: boolean }[]', required: false, description: '11.5: your own icon buttons after the built-in ones. `children` render after these.' },
  ],
  examples: [
    {
      title: 'Conversation',
      description: 'Hover or focus the assistant reply to show its actions.',
    },
    {
      title: 'Failed to send',
    },
    {
      title: 'Group thread',
      description: 'A third party with a name and time header, and a custom Pin action.',
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
