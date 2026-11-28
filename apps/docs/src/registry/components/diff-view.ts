import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'diff-view',
    title: 'Diff View',
    description: 'A unified diff with added and removed lines, for agent changes.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.8.0',
    updatedIn: '12.4.0',
    related: ['message-bubble', 'thinking-indicator', 'approval-card', 'tool-call'],
  },
  props: [
    { name: 'diff', type: 'string', required: true, description: 'Unified diff text.' },
    { name: 'file', type: 'string', required: false, description: 'File name above the diff.' },
    { name: 'lineNumbers', type: 'boolean', required: false, description: 'Old and new line numbers, counted from each `@@ -a,b +c,d @@` header (12.4).' },
    { name: 'messages', type: "Partial<{ diffAdded, diffRemoved }>", required: false, description: 'Screen-reader prefixes. DiffView renders on the server, so translate here (12.4).' },
    { name: 'DiffReview files', type: '{ file: string; diff: string }[]', required: true, description: 'DiffReview (beta, 12.4): the files to review, each a collapsible DiffView.' },
    { name: 'DiffReview decisions / defaultDecisions', type: "Record<string, 'accepted' | 'rejected'>", required: false, description: 'Per-file decisions keyed by path, controlled or starting values. A file with no entry is still to review.' },
    { name: 'DiffReview onAccept / onReject', type: '(file) => void', required: false, description: 'Called with the file when its Accept or Reject is pressed.' },
    { name: 'DiffReview onDecisionsChange', type: '(decisions) => void', required: false, description: 'The whole record after each decision.' },
    { name: 'DiffReview lineNumbers / defaultOpen', type: 'boolean', default: 'true', required: false, description: 'Line numbers in each diff; files start expanded.' },
  ],
  examples: [
    { title: 'Proposed change' },
    {
      title: 'DiffReview: review file by file',
      description:
        'DiffReview (beta, 12.4) lists an agent’s changed files. Each file collapses, shows its added and removed line counts, and has its own Accept and Reject; the summary counts what is accepted, rejected and still to review.',
    },
  ],
  a11y: {
    keyboard: [{ key: 'Enter / Space', description: 'DiffReview: expands or collapses a file, or presses Accept / Reject.' }],
    screenReader: [
      'Added and removed lines are spelled out for screen readers; colour is not the only cue. Line numbers are hidden from screen readers.',
      'DiffReview: each file toggle reports aria-expanded and its line counts; Accept and Reject are toggle buttons named with the file ("Accept src/billing.ts") with aria-pressed; the summary is a polite status.',
    ],
  },
};

export default entry;
