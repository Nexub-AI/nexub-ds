import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'list-detail',
    title: 'List Detail',
    description: 'The list-detail layout: side by side at 720px+ of its own width (a container query), one pane at a time below.',
    category: 'Layout',
    package: '@nexub/patterns',
    status: 'beta',
    addedIn: '1.5.0',
  },
  props: [
    { name: 'list / detail', type: 'ReactNode', required: true, description: 'The two panes.' },
    { name: 'showDetail', type: 'boolean', default: 'false', required: false, description: 'When narrow, show the detail instead of the list (set it on selection).' },
    { name: 'onBack', type: '() => void', required: false, description: 'Back button, shown only when narrow.' },
    { name: 'listWidth', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Fixed list width when both panes show (288 / 320 / 400px).' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<ListDetail
  showDetail={selected !== null}
  onBack={() => setSelected(null)}
  list={<MessageList onSelect={setSelected} />}
  detail={<Message id={selected} />}
/>`,
    },
  ],
};

export default entry;
