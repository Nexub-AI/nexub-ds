import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'welcome-banner',
    title: 'WelcomeBanner',
    description: 'A greeting at the top of a home or dashboard page: what is new, or the next step for a new account.',
    category: 'Data',
    package: '@nexub/patterns',
    status: 'alpha',
    addedIn: '10.3.0',
  },
  props: [
    { name: 'title', type: 'React.ReactNode', required: true, description: 'The greeting, e.g. "Welcome back, Mei".' },
    { name: 'description', type: 'React.ReactNode', required: false, description: 'One or two lines under the title.' },
    { name: 'actions', type: 'React.ReactNode', required: false, description: 'One or two buttons.' },
    { name: 'media', type: 'React.ReactNode', required: false, description: 'Decorative art on the trailing side. Hidden on phones.' },
    { name: 'onDismiss', type: '() => void', required: false, description: 'Shows a close button. Keep the dismissed state in your app.' },
    { name: 'level', type: '2 | 3', default: '2', required: false, description: 'Heading level of the title.' },
  ],
  examples: [{ title: 'Default' }, { title: 'With art and dismiss' }],
};

export default entry;
