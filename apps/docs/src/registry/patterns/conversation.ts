import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'conversation',
    title: 'Conversation',
    description: 'Chat layout: a scrolling message list that follows new content, with a sticky composer underneath. DateSeparator labels the days between messages.',
    category: 'AI',
    package: '@nexub/patterns',
    status: 'stable',
    addedIn: '1.8.0',
    related: ['message-bubble', 'prompt-input', 'streaming-text'],
  },
  props: [
    { name: 'children', type: 'ReactNode', required: false, description: 'The messages, usually MessageBubbles.' },
    { name: 'composer', type: 'ReactNode', required: false, description: 'Sticky slot under the list, usually a PromptInput.' },
    { name: 'autoScroll', type: 'boolean', default: 'true', required: false, description: 'Follow new content while the reader is at the bottom. Scrolling up stops following and shows "Jump to latest". 12.2: if messages arrive while scrolled up, it reads "Jump to newest" and "New messages" is announced once.' },
    { name: 'announce', type: 'boolean', default: 'false', required: false, description: 'Make the list a polite `role="log"`. Only for whole-message updates: with token streaming it announces every chunk.' },
    { name: 'maxHeight', type: 'number | string', required: false, description: '11.5: cap the height so it works in normal flow without a fixed-height parent. It grows with its messages up to this, then the list scrolls and follows. Without it, it fills its parent (`h-full`).' },
    { name: 'thinking', type: 'ReactNode', required: false, description: '12.2: slot at the end of the list for a `<ThinkingIndicator />`, in a polite `role="status"` region. It never moves the scroll or counts as a new message. Keep the prop set (`busy ? <ThinkingIndicator /> : null`) so the live region exists before the indicator appears.' },
    { name: 'messages', type: 'Partial<ConversationMessages>', required: false, description: 'Overrides for `jumpToLatest`, `conversation`, and (12.2) `jumpToNewest`, `newMessages`.' },
    { name: 'DateSeparator date', type: 'Date | string | number', required: false, description: '12.2: the day it starts. Shows "Today", "Yesterday" or a medium date in the provider’s locale ("25 Nov 2026" in en-GB). A date-only string ("2026-11-25") is a local day.' },
    { name: 'DateSeparator children', type: 'ReactNode', required: false, description: 'Replaces the computed label.' },
    { name: 'DateSeparator now', type: 'Date | string | number', required: false, description: '"Now" for the Today / Yesterday check; defaults to the current time. Pass one in tests and stories.' },
    { name: 'DateSeparator locale', type: 'string', required: false, description: 'Overrides the NexubProvider locale for the date.' },
    { name: 'DateSeparator messages', type: 'Partial<{ today: string; yesterday: string }>', required: false, description: 'Local overrides; otherwise `today` / `yesterday` from NexubProvider.' },
  ],
  examples: [
    {
      title: 'Mini chat',
      description: 'Send a message: it shows Thinking, then streams a cited reply. Stop or Escape ends the reply early.',
    },
    {
      title: 'In normal flow',
      description: 'No fixed-height parent: `maxHeight="20rem"` lets it grow with its messages, then scroll.',
    },
    {
      title: 'Days and thinking',
      description: '12.2: a `DateSeparator` wherever the day changes, and a `ThinkingIndicator` in the `thinking` slot while a reply is on its way. Send a message to see it.',
    },
  ],
  usage: {
    whenToUse: [
      'A full chat or assistant view: messages above, composer below.',
      'DateSeparator between messages from different days, in any message list.',
    ],
    whenNotToUse: [
      'A single question and answer: a PromptInput and a MessageBubble in normal flow are enough.',
      'Comment threads that don’t follow new content: use ActivityFeed.',
    ],
  },
  a11y: {
    roles: [
      'region (default) or log (with `announce`)',
      'status (polite) around the `thinking` slot',
      'DateSeparator: plain text, not `role="separator"`',
    ],
    keyboard: [
      { key: 'Tab', description: 'The message list is focusable so keyboard users can scroll it.' },
    ],
    focus: [
      'Keep focus in the composer while a reply streams; don’t move it to the new message.',
    ],
    screenReader: [
      'The list is named "Conversation". Leave `announce` off while streaming tokens and announce the finished reply once instead.',
      'With reduced motion, "Jump to latest" scrolls instantly.',
      'Messages arriving while the reader is scrolled up announce "New messages" once per batch (a hidden polite live region); the batch ends when they are back at the bottom. With `announce` the log speaks instead.',
      'The `thinking` slot is a polite status, so a ThinkingIndicator placed in it is read once when it appears.',
      'DateSeparator is read as its text ("Yesterday") in order with the messages. It is not `role="separator"`: a separator’s children are presentational, and screen readers announce a non-focusable one as just "separator" or skip it, which would lose the day. The hairlines are hidden.',
    ],
  },
};

export default entry;
