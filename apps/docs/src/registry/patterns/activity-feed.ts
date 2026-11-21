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
    { name: 'ActivityFeedItem title', type: 'React.ReactNode', required: true, description: 'Activity event title. Block content is fine (a `div` since 11.5).' },
    { name: 'ActivityFeedItem description', type: 'React.ReactNode', required: false, description: 'Supporting description. Block content is fine (a `div` since 11.5).' },
    { name: 'ActivityFeedItem timestamp', type: 'ReactNode | Date', required: false, description: 'Text as given (e.g. "2 hours ago"), or (11.5) a `Date`: shown in `<time dateTime>` as relative text, a short date after a week, with the full date in a tooltip on hover or focus.' },
    { name: 'ActivityFeedItem actions', type: 'React.ReactNode', required: false, description: '11.5. Trailing controls, e.g. an IconButton or a menu trigger.' },
    { name: 'ActivityFeedItem tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: '11.5. A coloured dot in place of the avatar, or a badge on it. Decorative: say what happened in the title.' },
    { name: 'ActivityFeedGroup label', type: 'React.ReactNode', required: true, description: '11.5. `ActivityFeed.Group` header, e.g. "Today"; it names the group’s list.' },
    { name: 'ActivityFeedGroup headingLevel', type: '2 | 3 | 4 | 5 | 6', required: false, description: '11.5. Renders the header as a heading for heading navigation. Default: a plain `div`.' },
    { name: 'ActivityFeedItem avatar', type: 'React.ReactNode', required: false, description: 'Avatar element for the actor.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Groups, tones and actions',
      description: '`ActivityFeed.Group` headers, `Date` timestamps (focus one for the full date), `tone` dots and a menu per item.',
    },
  ],
};

export default entry;
