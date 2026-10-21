import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'thinking-indicator',
    title: 'Thinking Indicator',
    description: 'Shows the assistant is working before the first token arrives: a morphing shape and a shimmering label.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.8.0',
    related: ['streaming-text', 'spinner', 'conversation'],
  },
  props: [
    { name: 'label', type: 'ReactNode | null', default: "messages.thinking ('Thinking')", required: false, description: 'Visible text. `null` hides it; "Thinking" is still announced.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", required: false, description: 'Shape and text size.' },
    { name: 'messages', type: 'Partial<{ thinking: string }>', required: false, description: 'Local override for the default text.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<ThinkingIndicator />`,
    },
    {
      title: 'Custom label and sizes',
      description: 'Name the step when you know it. `label={null}` keeps only the shape.',
      code: `<ThinkingIndicator label="Searching 4 sources" />
<ThinkingIndicator size="sm" />
<ThinkingIndicator size="sm" label={null} />`,
    },
  ],
  usage: {
    whenToUse: [
      'The gap between sending a prompt and the first token of the reply.',
      'Tool calls or retrieval steps inside a reply, with a label naming the step.',
    ],
    whenNotToUse: [
      'Once text is streaming: StreamingText’s caret already shows progress. Replace the indicator, don’t stack them.',
      'General loading outside AI surfaces: use Spinner or Skeleton.',
    ],
  },
  a11y: {
    roles: ['status'],
    screenReader: [
      'A polite live region: the label is announced once when it mounts. Changing the label announces the new step.',
      'Render it only while waiting and remove it when tokens start, so it is not announced again.',
    ],
    notes: [
      'With reduced motion the shape and shimmer are static.',
    ],
  },
};

export default entry;
