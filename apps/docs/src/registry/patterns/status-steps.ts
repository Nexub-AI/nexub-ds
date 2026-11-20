import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'status-steps',
    title: 'StatusSteps',
    description: 'A read-only list of steps showing where something stands: done, current, upcoming or a problem.',
    category: 'Data',
    package: '@nexub/patterns',
    status: 'alpha',
    addedIn: '10.7.0',
    related: ['stepper', 'progress', 'activity-feed'],
  },
  props: [
    { name: 'steps', type: "{ id?: string; title: ReactNode; description?: ReactNode; status: 'done' | 'current' | 'upcoming' | 'error'; timestamp?: ReactNode; action?: ReactNode }[]", required: true, description: 'The steps, first to last.' },
    { name: 'aria-label', type: 'string', required: true, description: 'Names the list. `aria-labelledby` works too.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", required: false, description: 'Marker, type and spacing.' },
  ],
  examples: [{ title: 'Application review' }, { title: 'With a problem' }],
};

export default entry;
