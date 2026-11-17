import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'status-page',
    title: 'StatusPage',
    description: 'A whole page for one state: not found, server error, maintenance, offline or no access.',
    category: 'Feedback',
    package: '@nexub/patterns',
    status: 'alpha',
    addedIn: '10.5.0',
  },
  props: [
    { name: 'kind', type: "'notFound' | 'serverError' | 'maintenance' | 'offline' | 'noAccess'", required: true, description: 'Which state. Sets the default text and illustration. `serverError` and `offline` are announced as alerts.' },
    { name: 'title', type: 'React.ReactNode', required: false, description: 'Overrides the localised title (the one h1).' },
    { name: 'description', type: 'React.ReactNode', required: false, description: 'Overrides the localised description.' },
    { name: 'code', type: 'string', required: false, description: 'A small line above the title, e.g. "404".' },
    { name: 'actions', type: 'React.ReactNode', required: false, description: 'Buttons under the text. Replaces the default Retry or Back to home.' },
    { name: 'illustration', type: 'React.ReactNode', required: false, description: 'Art above the text. Defaults to the Illustration for the kind; `null` hides it.' },
    { name: 'onRetry', type: '() => void', required: false, description: 'Shows a Retry button for `serverError` and `offline`.' },
    { name: 'homeHref', type: 'string', required: false, description: 'Shows a "Back to home" link for `notFound` and `noAccess`.' },
    { name: 'fullScreen', type: 'boolean', default: 'false', required: false, description: 'At least as tall as the viewport.' },
    { name: 'as', type: "'main' | 'div' | 'section'", default: "'main'", required: false, description: 'Landmark element. Use `div` inside an app shell that already renders `<main>`.' },
  ],
  examples: [{ title: 'Not found' }, { title: 'Server error with Retry' }],
};

export default entry;
