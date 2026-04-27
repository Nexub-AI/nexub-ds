import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'code-inline',
    title: 'Code',
    description: 'Inline code span for technical terms and short code snippets.',
    category: 'Inline Primitives',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: '...props', type: 'React.HTMLAttributes<HTMLElement>', required: false, description: 'All standard span/code HTML attributes are forwarded.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Code>npm install @nexub/react</Code>`,
    },
    {
      title: 'In prose',
      code: `<Text>Use the <Code>useTheme()</Code> hook to access the current theme.</Text>`,
    },
  ],
};

export default entry;
