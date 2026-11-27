import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'prompt-input',
    title: 'Prompt Input',
    description: 'The composer for a chat: an auto-growing text field with Send, which turns into Stop while a reply streams.',
    category: 'AI',
    package: '@nexub/react',
    status: 'stable',
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
    { name: 'messages', type: 'Partial<PromptInputMessages>', required: false, description: 'Local overrides for `promptLabel`, `sendMessage`, `stopGenerating`, `promptHint`, `promptHintModEnter`, `promptSuggestions` and `promptCommands`.' },
    { name: 'sendLabel', type: 'ReactNode', required: false, description: '11.5: a visible text label on Send, beside the arrow. Without it, Send is an icon button.' },
    { name: 'submitOn', type: "'enter' | 'mod-enter'", default: "'enter'", required: false, description: '11.5: `mod-enter` sends on Cmd/Ctrl+Enter, makes Enter add a line and shows that hint under the field.' },
    { name: 'hint', type: 'ReactNode', required: false, description: '11.5: helper text under the field, linked with `aria-describedby`.' },
    { name: 'error', type: 'ReactNode', required: false, description: '11.5: an error under the field. Marks the field invalid (`aria-invalid`) and links it.' },
    { name: 'commands', type: 'CommandListItem[]', required: false, description: '12.2: slash commands. Typing `/` opens them in a list above the field, filtered by what follows the slash (as CommandList: value, label, description and keywords). `shortcut` keys show at the end of a row. The list part loads on the first `/`.' },
    { name: 'onCommand', type: '(value: string, args: string) => void', required: false, description: '12.2: called when a command is picked (Enter, Tab or click) with its `value` and the text after the command id: `/remind tomorrow 9am` → `("remind", "tomorrow 9am")`. Uncontrolled input then clears, as after a submit; controlled input leaves that to you. Enter on `/text` that matches no command submits as usual.' },
    { name: 'chips', type: 'ReactNode', required: false, description: '12.2: quick replies above the field, e.g. `Button size="sm" variant="tonal"` or Chips. One row that scrolls sideways with snap and edge fades when narrow, and wraps from 480px wide. Named by `messages.promptSuggestions` ("Suggestions").' },
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
    {
      title: 'Label, hint and error',
      description: 'Cmd/Ctrl+Enter sends and Enter adds a line. Type more than 280 characters to see the error.',
    },
    {
      title: 'Slash commands',
      description: 'Type `/` to open the commands above the field. ↑/↓ move, Enter or Tab picks, Esc closes and keeps the text. Type `/remind tomorrow 9am` and press Enter to pass the arguments. The field clears after a pick.',
    },
    {
      title: 'Quick replies',
      description: 'The `chips` row above the field. On a phone it scrolls sideways instead of wrapping.',
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
    roles: ['textbox (multiline)', 'button (Send / Stop)', 'combobox + listbox (slash commands, while open)', 'group (quick replies)'],
    keyboard: [
      { key: 'Enter', description: 'Sends. Ignored while an IME composition is open.' },
      { key: 'Shift + Enter', description: 'New line.' },
      { key: 'Cmd/Ctrl + Enter', description: 'Sends with `submitOn="mod-enter"`, where Enter adds a line.' },
      { key: 'Escape', description: 'Stops the reply while streaming. With the command list open, closes the list first and keeps the text.' },
      { key: '/', description: 'At the start of the text, opens the command list (with `commands`).' },
      { key: '↑ / ↓', description: 'Moves the active command, wrapping at the ends and skipping disabled ones.' },
      { key: 'Enter / Tab', description: 'Picks the active command while the list is open (Shift+Tab still moves focus back).' },
    ],
    focus: [
      'Focus stays in the field after sending, so the user can type the next message straight away.',
      'An empty field keeps Send focusable with `aria-disabled`, rather than removing it from the tab order.',
    ],
    screenReader: [
      'The field is named by `label` (default "Message") and described by the Enter/Shift+Enter hint.',
      'Send and Stop are icon buttons with their own names; the swap does not move focus.',
      'While the command list is open the field is a combobox (`aria-expanded`, `aria-controls`, `aria-autocomplete="list"`) and the active option is announced through `aria-activedescendant`; focus never leaves the field. Options are named "/id label" and described by their description. Closed, the field is the plain textbox again.',
      'The quick replies are a group named "Suggestions"; each reply is a button in the tab order before the field.',
    ],
  },
};

export default entry;
