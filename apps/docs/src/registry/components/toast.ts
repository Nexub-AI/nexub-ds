import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'toast',
    title: 'Toast',
    description: 'Imperative toast notifications using the toast object. Render <Toaster /> once in your layout.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '1.7.0',
  },
  props: [
    { name: 'Toaster expand', type: 'boolean', default: 'false', required: false, description: 'Always show toasts as a list. By default they collapse into a stack that fans out on hover or focus, which also pauses their timers.' },
    { name: 'Toaster visibleToasts', type: 'number', default: '3', required: false, description: 'How many toasts show at once. Older ones are hidden visually but stay in the live region.' },
    { name: 'toast.success(title, opts?)', type: 'string', required: true, description: 'Show a success toast with an optional options object.' },
    { name: 'toast.error(title, opts?)', type: 'string', required: true, description: 'Show an error toast.' },
    { name: 'toast.warning(title, opts?)', type: 'string', required: true, description: 'Show a warning toast.' },
    { name: 'toast.info(title, opts?)', type: 'string', required: true, description: 'Show an info toast.' },
    { name: 'toast.custom(title, opts?)', type: 'string', required: true, description: 'Show a default/custom toast.' },
    { name: 'toast.undoable(title, opts)', type: 'UndoableToastOptions', required: true, description: 'A toast with an Undo action (beta, 1.7.0). Undo calls `opts.onUndo`; any other close (timer, swipe, close button, `toast.dismiss`) calls `opts.onCommit`, exactly once. Returns the toast id.' },
    { name: 'undoable opts', type: '{ onUndo; onCommit?; undoLabel?; description?; duration? }', required: false, description: '`undoLabel` defaults to the `undo` message ("Undo"). Commit the change in `onCommit`, not before showing the toast.' },
    { name: 'opts.description', type: 'string', required: false, description: 'Secondary supporting text below the title.' },
    { name: 'opts.duration', type: 'number', default: '5000', required: false, description: 'Time in ms before auto-dismiss. Use Infinity to persist.' },
    { name: 'opts.action', type: '{ label: string; onClick: () => void }', required: false, description: 'Renders an action button inside the toast.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Variants',
    },
    {
      title: 'With action',
    },
    {
      title: 'Undoable delete',
      description: 'Hide the item right away; delete it for real only when the toast closes without Undo.',
    },
  ],
  usage: {
    whenToUse: [
    "Confirming a non-blocking action (file saved, message sent)",
    "Reporting a background event the user should know about",
    "Providing brief feedback that disappears automatically",
    "Offering an undo action immediately after a destructive operation",
    ],
    whenNotToUse: [
    "Critical errors that block the user — use Alert or AlertDialog",
    "Information the user must read and acknowledge — use Dialog",
    "Persistent status that should remain visible — use Banner or Alert",
    "Long messages with multiple lines of text",
    ],
  },
};

export default entry;
