import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tool-call',
    title: 'Tool Call',
    description: 'One tool call: its name and status, expandable to input and output.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.8.0',
    updatedIn: '12.4.0',
    related: ['message-bubble', 'thinking-indicator'],
  },
  props: [
    { name: 'name', type: 'string', required: true, description: 'Tool name.' },
    { name: 'status', type: "'running' | 'done' | 'failed'", required: true, description: 'Shown as a badge.' },
    { name: 'input', type: 'unknown', required: false, description: 'Arguments, shown as JSON.' },
    { name: 'output', type: 'unknown', required: false, description: 'Result, as text or JSON.' },
    { name: 'duration', type: 'number', required: false, description: 'Run time in milliseconds, shown formatted ("1.2 s") (12.4).' },
    { name: 'error', type: 'ReactNode', required: false, description: 'Why it failed, shown as text in the failed state; a failed call with an error starts open (12.4).' },
    { name: 'onRetry', type: '() => void', required: false, description: 'A Retry button in the failed state. Without it ToolCall stays a server component (12.4).' },
    { name: 'defaultOpen', type: 'boolean', required: false, description: 'Open on first render; `open` still wins (12.4).' },
    { name: 'messages', type: 'Partial<NexubMessages>', required: false, description: 'Status words and headings. ToolCall renders on the server, so translate here (12.4).' },
  ],
  examples: [{ title: 'Tool call' }, { title: 'Run time, error and Retry', description: 'A finished call shows how long it took; a failed one opens on its error and offers Retry.' }],
  a11y: {
    screenReader: [
      'A native `<details>` disclosure: opens with Enter or Space.',
      'The status badge is a polite live region, so Running → Done is announced without moving focus. The error is plain text, not an alert.',
    ],
  },
};

export default entry;
