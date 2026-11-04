import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'streaming-text',
    title: 'Streaming Text',
    description: 'Assistant text as it arrives: new chunks fade in, text already shown stays still, and a caret marks the end.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.8.0',
    related: ['message-bubble', 'thinking-indicator', 'conversation'],
  },
  props: [
    { name: 'text', type: 'string', required: true, description: 'The full text received so far. Append to it; anything that is not an append renders statically.' },
    { name: 'streaming', type: 'boolean', default: 'false', required: false, description: 'Shows the caret and sets `aria-busy` while more text is expected.' },
    { name: 'as', type: "'div' | 'p' | 'span'", default: "'div'", required: false, description: 'Element to render.' },
    { name: 'aria-live', type: "'off' | 'polite'", default: "'off'", required: false, description: 'Opt-in live announcements. Leave off: screen readers would re-read the region on every token.' },
  ],
  examples: [
    {
      title: 'Streaming a reply',
      description: 'Words arrive on a timer. Restart streams the paragraph again.',
    },
  ],
  usage: {
    whenToUse: [
      'Any model output rendered token by token.',
    ],
    whenNotToUse: [
      'Finished text loaded from history: render it as plain text, or with `streaming={false}`.',
      'Model output as HTML or Markdown HTML: StreamingText renders text only. Parse Markdown to React elements yourself; never inject model HTML.',
    ],
  },
  a11y: {
    screenReader: [
      'Not a live region by default. Announce the finished message once instead, e.g. through a polite status or Conversation’s `announce` for whole messages.',
      '`aria-busy` is true while streaming, so assistive tech can wait for the final text.',
    ],
    notes: [
      'The caret is decorative (`aria-hidden`). With reduced motion, chunks appear without fading and the caret does not blink.',
      'Only the last three chunks keep their own span, so the DOM stays flat however long the reply gets.',
    ],
  },
};

export default entry;
