import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'conversation',
    title: 'Conversation',
    description: 'Chat layout: a scrolling message list that follows new content, with a sticky composer underneath.',
    category: 'AI',
    package: '@nexub/patterns',
    status: 'beta',
    addedIn: '1.8.0',
    related: ['message-bubble', 'prompt-input', 'streaming-text'],
  },
  props: [
    { name: 'children', type: 'ReactNode', required: false, description: 'The messages, usually MessageBubbles.' },
    { name: 'composer', type: 'ReactNode', required: false, description: 'Sticky slot under the list, usually a PromptInput.' },
    { name: 'autoScroll', type: 'boolean', default: 'true', required: false, description: 'Follow new content while the reader is at the bottom. Scrolling up stops following and shows "Jump to latest".' },
    { name: 'announce', type: 'boolean', default: 'false', required: false, description: 'Make the list a polite `role="log"`. Only for whole-message updates: with token streaming it announces every chunk.' },
    { name: 'messages', type: 'Partial<ConversationMessages>', required: false, description: 'Overrides for `jumpToLatest` and `conversation`.' },
  ],
  examples: [
    {
      title: 'Mini chat',
      description: 'Send a message: it shows Thinking, then streams a cited reply. Stop or Escape ends the reply early.',
    },
  ],
  usage: {
    whenToUse: [
      'A full chat or assistant view: messages above, composer below.',
    ],
    whenNotToUse: [
      'A single question and answer: a PromptInput and a MessageBubble in normal flow are enough.',
      'Comment threads that don’t follow new content: use ActivityFeed.',
    ],
  },
  a11y: {
    roles: ['region (default) or log (with `announce`)'],
    keyboard: [
      { key: 'Tab', description: 'The message list is focusable so keyboard users can scroll it.' },
    ],
    focus: [
      'Keep focus in the composer while a reply streams; don’t move it to the new message.',
    ],
    screenReader: [
      'The list is named "Conversation". Leave `announce` off while streaming tokens and announce the finished reply once instead.',
      'With reduced motion, "Jump to latest" scrolls instantly.',
    ],
  },
};

export default entry;
