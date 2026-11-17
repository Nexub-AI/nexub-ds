import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'illustration',
    title: 'Illustration',
    description: 'A spot illustration for an empty, error or full-page state, drawn in code so it follows the theme, dark mode and the product accent.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.5.0',
    related: ['empty-state', 'error-state'],
  },
  props: [
    { name: 'kind', type: "'noData' | 'noResults' | 'noAccess' | 'serverError' | 'offline' | 'notFound' | 'maintenance'", required: true, description: 'Which drawing to show.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '80, 120 or 160 CSS px wide.' },
    { name: 'title', type: 'string', description: 'Names the drawing for assistive technology. Without it the drawing is decorative.' },
  ],
  examples: [{ title: 'Default' }, { title: 'Kinds' }],
};

export default entry;
