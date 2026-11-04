import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'prompt-input',
    title: 'Prompt Input',
    description: 'The composer for a chat: an auto-growing text field with Send, which turns into Stop while a reply streams.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.8.0',
    related: ['message-bubble', 'conversation', 'textarea'],
  },
  props: [
    { name: 'value / defaultValue / onValueChange', type: 'string', required: false, description: 'Controlled or uncontrolled text. Uncontrolled input clears itself after a submit.' },
    { name: 'onSubmit', type: '(value: string) => void', required: false, description: 'Called with the text on Enter or Send. Not called while empty, disabled or not `idle`.' },
    { name: 'onStop', type: '() => void', required: false, description: 'Called by Stop, or Escape in the field, while `status="streaming"`.' },
    { name: 'status', type: "'idle' | 'submitting' | 'streaming'", default: "'idle'", required: false, description: '`streaming` swaps Send for Stop; `submitting` holds Send until the request is accepted.' },
    { name: 'maxRows', type: 'number', default: '8', required: false, description: 'Rows the field grows to before it scrolls.' },
    { name: 'attachments', type: 'ReactNode', required: false, description: 'Rendered above the text, e.g. removable Chips.' },
    { name: 'actions', type: 'ReactNode', required: false, description: 'Rendered bottom-start, e.g. an attach IconButton or a model picker.' },
    { name: 'surface', type: "'solid' | 'glass'", default: "'solid'", required: false, description: 'Glass material for composers floating over content.' },
    { name: 'label', type: 'string', default: "messages.promptLabel ('Message')", required: false, description: 'Accessible name of the text field.' },
    { name: 'messages', type: 'Partial<PromptInputMessages>', required: false, description: 'Local overrides for `promptLabel`, `sendMessage`, `stopGenerating`, `promptHint`.' },
    { name: 'textareaClassName', type: 'string', required: false, description: 'Class for the textarea; `className` goes to the outer container.' },
  ],
  examples: [
    {
      title: 'Default',
      description: 'Enter sends, Shift+Enter adds a line. Send stays inert until there is text.',
    },
    {
      title: 'Attachments and actions',
    },
    {
      title: 'Streaming',
      description: 'Send a message: the button turns into Stop for three seconds. Stop or Escape ends it early.',
    },
  ],
  usage: {
    whenToUse: [
      'The message box of a chat or assistant.',
      'Any free-text prompt that starts a long-running, stoppable generation.',
    ],
    whenNotToUse: [
      'Ordinary forms: use Textarea, where Enter adds a line.',
      'Search: use SearchInput.',
    ],
  },
  a11y: {
    roles: ['textbox (multiline)', 'button (Send / Stop)'],
    keyboard: [
      { key: 'Enter', description: 'Sends. Ignored while an IME composition is open.' },
      { key: 'Shift + Enter', description: 'New line.' },
      { key: 'Escape', description: 'Stops the reply while streaming.' },
    ],
    focus: [
      'Focus stays in the field after sending, so the user can type the next message straight away.',
      'An empty field keeps Send focusable with `aria-disabled`, rather than removing it from the tab order.',
    ],
    screenReader: [
      'The field is named by `label` (default "Message") and described by the Enter/Shift+Enter hint.',
      'Send and Stop are icon buttons with their own names; the swap does not move focus.',
    ],
  },
};

export default entry;
