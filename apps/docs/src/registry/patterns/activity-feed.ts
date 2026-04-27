import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'activity-feed',
    title: 'ActivityFeed',
    description: 'Chronological list of activity events with avatar, description, and timestamp.',
    category: 'Data',
    package: '@nexub/patterns',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'title', type: 'React.ReactNode', required: true, description: 'Activity event title.' },
    { name: 'description', type: 'React.ReactNode', required: false, description: 'Supporting description.' },
    { name: 'timestamp', type: 'string', required: false, description: 'Time string (e.g. "2 hours ago").' },
    { name: 'avatar', type: 'React.ReactNode', required: false, description: 'Avatar element for the actor.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<ActivityFeed.Root>
  <ActivityFeed.Item
    title="Alex created a new project"
    description="Project 'Nexub DS v2' was created"
    timestamp="2 hours ago"
  />
  <ActivityFeed.Item
    title="Sam invited 3 members"
    description="Jordan, Riley, and Taylor joined"
    timestamp="Yesterday"
  />
</ActivityFeed.Root>`,
    },
  ],
};

export default entry;
