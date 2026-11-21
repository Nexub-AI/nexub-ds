import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'navigation-rail',
    title: 'Navigation Rail',
    description: 'Navigation for medium-width windows: icons over labels, with an active pill behind the icon.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.5.0',
    related: ['sidebar', 'top-nav'],
  },
  props: [
    { name: 'Root header', type: 'ReactNode', required: false, description: 'Slot above the items, e.g. a primary action. Not shown in the bottom bar.' },
    { name: 'Root orientation', type: "'vertical' | 'bottom'", default: "'vertical'", required: false, description: '11.5. `bottom` is a phone tab bar: a row that sticks to the bottom of the scroll area, with safe-area padding and 48px targets. Put it after the page content.' },
    { name: 'Root aria-label', type: 'string', default: "'Main'", required: false, description: 'Name of the nav landmark.' },
    { name: 'Item icon / label', type: 'ReactNode', required: true, description: 'Icon in the indicator pill; label below.' },
    { name: 'Item active', type: 'boolean', required: false, description: 'Marks the current page (aria-current="page").' },
    { name: 'Item badge', type: 'number | boolean', required: false, description: '11.5. A count on the icon (99+ above 99, nothing at 0), or `true` for a dot. Screen readers hear it after the label: "Inbox, 3 unread" or "Feed, New".' },
    { name: 'Item badgeLabel', type: 'string', required: false, description: '11.5. Other wording for the badge, e.g. "2 failed builds".' },
    { name: 'Item asChild', type: 'boolean', required: false, description: 'Use your router link as the item; pass it as the only child.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Bottom tab bar with badges',
      description: 'For phones: `orientation="bottom"`, with a count and a dot badge.',
    },
  ],
};

export default entry;
