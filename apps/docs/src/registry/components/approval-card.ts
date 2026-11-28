import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'approval-card',
    title: 'Approval Card',
    description: 'The agent asks before it acts: what will happen, then Approve or Deny.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.8.0',
    updatedIn: '12.4.0',
    related: ['message-bubble', 'thinking-indicator', 'diff-view'],
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'What the agent wants to do.' },
    { name: 'onApprove / onDeny', type: '() => void | Promise', required: false, description: 'Called once with the choice. Return a promise to show the pending state until it settles (12.4).' },
    { name: 'args', type: 'unknown', required: false, description: 'The action’s arguments, shown as JSON (12.4).' },
    { name: 'onEdit', type: '(args: string) => void | Promise', required: false, description: 'Adds Edit: the user edits `args`, then approves with changes; called with the edited text (12.4).' },
    { name: 'outcome', type: "'approved' | 'edited' | 'denied' | null", required: false, description: 'Controlled outcome; `null` keeps the choice open (12.4).' },
    { name: 'pending', type: 'boolean', required: false, description: 'The action is running: buttons disabled, "Working…" announced (12.4).' },
  ],
  examples: [
    { title: 'Before sending' },
    { title: 'Edit before approving', description: 'With `args` and `onEdit` the user can approve, edit the arguments then approve, or deny. A promise from the callback shows the pending state.' },
  ],
  a11y: {
    focus: ['Edit moves focus to the arguments field; Cancel returns it to Edit. Once the choice resolves, focus moves to the card, so it is never lost with the buttons.'],
    screenReader: ['The outcome ("Approved", "Approved with changes", "Denied") and "Working…" are announced in a polite live region; the card is a group named by its title.'],
  },
};

export default entry;
