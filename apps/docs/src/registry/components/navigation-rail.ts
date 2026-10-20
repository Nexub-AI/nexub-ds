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
    { name: 'Root header', type: 'ReactNode', required: false, description: 'Slot above the items, e.g. a primary action.' },
    { name: 'Root aria-label', type: 'string', default: "'Main'", required: false, description: 'Name of the nav landmark.' },
    { name: 'Item icon / label', type: 'ReactNode', required: true, description: 'Icon in the indicator pill; label below.' },
    { name: 'Item active', type: 'boolean', required: false, description: 'Marks the current page (aria-current="page").' },
    { name: 'Item asChild', type: 'boolean', required: false, description: 'Use your router link as the item; pass it as the only child.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<NavigationRail.Root aria-label="Workspace">
  <NavigationRail.Item href="/" icon={<Home />} label="Home" active />
  <NavigationRail.Item href="/files" icon={<Folder />} label="Files" />
  <NavigationRail.Item href="/settings" icon={<Settings />} label="Settings" />
</NavigationRail.Root>`,
    },
  ],
};

export default entry;
