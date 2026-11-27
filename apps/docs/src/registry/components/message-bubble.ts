import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'message-bubble',
    title: 'Message Bubble',
    description: 'One message in a conversation. User messages sit in a bubble at the end; assistant replies run full width. MessageActions adds copy, feedback and regenerate; MessageCard and Highlight structure what a message says.',
    category: 'AI',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '1.8.0',
    related: ['streaming-text', 'conversation', 'citation'],
  },
  props: [
    { name: 'from', type: "'user' | 'assistant' | 'system' | 'other'", required: true, description: 'Who sent it. Sets layout and the default accessible name. `other` (11.5) is a third party in a group conversation.' },
    { name: 'avatar', type: 'ReactNode', required: false, description: 'Assistant and other: shown at the inline start. User (12.2): at the inline end, with the same size and spacing.' },
    { name: 'name', type: 'string', required: false, description: 'Accessible name of the message. Defaults to "You said" or "Assistant said". With `from="other"` it is also shown as the header.' },
    { name: 'meta', type: 'ReactNode', required: false, description: '11.5: header text beside the name, e.g. the time.' },
    { name: 'status', type: "'sending' | 'error'", required: false, description: '`sending` sets `aria-busy`; `error` shows "Failed to send".' },
    { name: 'onRetry', type: '() => void', required: false, description: 'With `status="error"`, adds a Retry button.' },
    { name: 'collapse', type: 'number | false', default: 'false', required: false, description: '12.2: clamp the content to this many lines. Only when it is taller does a "Read more" / "Show less" toggle appear, with a fade at the clamped edge. Keep MessageActions outside a collapsed bubble, or the clamp hides it.' },
    { name: 'messages', type: 'Partial<MessageStrings>', required: false, description: 'Local string overrides, including `readMore`, `showLess`, `showAll` and `moreActions` (12.2).' },
    { name: 'MessageActions text', type: 'string', required: false, description: 'Text Copy puts on the clipboard.' },
    { name: 'MessageActions copy', type: 'boolean', default: 'true', required: false, description: 'Set false to hide Copy.' },
    { name: 'MessageActions feedback / defaultFeedback / onFeedback', type: "'up' | 'down' | null", required: false, description: 'Thumbs up/down appear when `onFeedback` is set. Pressing the active one clears it.' },
    { name: 'MessageActions onRegenerate', type: '() => void', required: false, description: 'Shows Regenerate when set.' },
    { name: 'MessageActions actions', type: '{ label: string; icon: ReactNode; onSelect: () => void; disabled?: boolean }[]', required: false, description: '11.5: your own icon buttons after the built-in ones. `children` render after these.' },
    { name: 'MessageCard title / status', type: 'ReactNode', required: false, description: '12.2 (beta): a bordered block inside a bubble. The title, and a status beside it (usually a `Badge`).' },
    { name: 'MessageCard fields', type: '{ label: ReactNode; value: ReactNode }[]', required: false, description: 'Label and value pairs as a `dl`: two columns, one when the card is narrow (container query).' },
    { name: 'MessageCard body', type: 'ReactNode', required: false, description: 'Free content under the fields.' },
    { name: 'MessageCard actions', type: '{ label: string; onSelect: () => void; variant?: \'filled\' | \'tonal\' | \'text\'; icon?: ReactNode; disabled?: boolean }[] | ReactNode', required: false, description: 'At most one `filled` button (the first asked for, or else the first without a variant); the rest are `tonal` or `text`. Past two, the extras go into a "More actions" menu. Any other node renders as given. Warns in development for more than one `filled`.' },
    { name: 'MessageCard maxHeight', type: 'number | string', required: false, description: 'Clip the fields and body to this height (a number is px), with a "Show all" toggle when they are taller.' },
    { name: 'MessageCard done', type: 'ReactNode', required: false, description: 'Replaces the actions with one line and a `SuccessCheck`, e.g. "Approved by you · 2:14 pm". Announced politely.' },
    { name: 'Highlight tone', type: "'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'", default: "'neutral'", required: false, description: '12.2 (beta): an amount, date or status picked out in running text, on its tone\'s container colours (AA in both themes).' },
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
    {
      title: 'Your avatar and long messages',
      description: '12.2: `avatar` on your own messages sits at the inline end. `collapse={3}` clamps a long message with a Read more toggle; a short one gets none.',
    },
    {
      title: 'MessageCard',
      description: '12.2 (beta): a request inside a reply, with a status, fields and actions. Approve to see the done line; the third action goes into the More actions menu.',
    },
    {
      title: 'Highlight',
      description: '12.2 (beta): amounts, dates and statuses in running text. A plain span, not `<mark>`, so screen readers do not announce a search highlight.',
    },
  ],
  usage: {
    whenToUse: [
      'Each turn in a chat or assistant thread, inside Conversation.',
      'MessageActions under assistant replies the user may want to copy, rate or retry.',
      'MessageCard for something the user can act on inside a reply: an approval, a record, a booking.',
      'Highlight for the few values a reader scans for (an amount, a date, a status), not for whole sentences.',
    ],
    whenNotToUse: [
      'Comment threads and activity logs: use ActivityFeed or NotificationItem.',
      'Model output as HTML: render text or React elements as children, never `dangerouslySetInnerHTML`.',
    ],
  },
  a11y: {
    roles: ['article (each message)', 'alert (send error)', 'button (actions, Read more, Show all)', 'menu (MessageCard extra actions)', 'status (MessageCard done line)'],
    keyboard: [
      { key: 'Tab', description: 'Moves through the action buttons; focusing one reveals the row.' },
      { key: 'Space / Enter', description: 'Activates an action. Feedback buttons toggle.' },
      { key: 'Arrow keys / Escape', description: 'In the MessageCard "More actions" menu: move between items; Escape closes it and returns focus.' },
    ],
    screenReader: [
      'Each message is an `article` named "You said" or "Assistant said", so users can jump between messages.',
      'Feedback buttons expose `aria-pressed`. Copy announces "Copied" through a status region.',
      'The action row is only visually hidden until hover; it stays in the tab order and accessibility tree.',
      'Your own message keeps the name "You said" with an avatar; the avatar adds nothing to it.',
      'The collapse toggle is a button with `aria-expanded` and `aria-controls` pointing at the content. The clamped text stays in the accessibility tree.',
      'MessageCard fields are a description list, read as term and value pairs. The overflow button is named "More actions" and opens a menu.',
      'Highlight is a plain span: its text is read as part of the sentence. Say any meaning the colour adds in words.',
    ],
  },
};

export default entry;
