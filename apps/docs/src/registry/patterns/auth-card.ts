import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'auth-card',
    title: 'AuthCard',
    description: 'Authentication layout pattern. Wraps sign-in, sign-up, and reset flows in a centered card.',
    category: 'Auth',
    package: '@nexub/patterns',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Card heading (e.g. "Sign in to Nexub").' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Subheading text. 11.5: any content, e.g. the address in bold; was a string.' },
    { name: 'logo', type: 'React.ReactNode', required: false, description: 'Logo or brand mark above the title.' },
    { name: 'footer', type: 'React.ReactNode', required: false, description: 'Footer content (e.g. "Don\'t have an account?").' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Form content.' },
    { name: 'logoAlign', type: "'start' | 'center'", default: "'center'", description: '11.5: where the logo sits.' },
  ],
  examples: [
    {
      title: 'Sign in',
    },
  ],
};

export default entry;
