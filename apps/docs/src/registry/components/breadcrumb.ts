import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'breadcrumb',
    title: 'Breadcrumb',
    description: 'Hierarchical navigation trail showing page location.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '5.1.0',
  },
  props: [
    { name: 'Breadcrumb.Root aria-label', type: 'string', default: "'breadcrumb'", required: false, description: 'Accessible label for the nav landmark.' },
    { name: 'Breadcrumb.Link href', type: 'string', required: false, description: 'URL the breadcrumb link navigates to.' },
    { name: 'Breadcrumb.Link asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element, useful for router Link components.' },
    { name: 'Breadcrumb.Trail items', type: '{ label: ReactNode; href?: string }[]', required: true, description: 'The whole trail from data (5.1), root first; the last item is the current page.' },
    { name: 'Breadcrumb.Trail maxItems', type: 'number', default: '4', required: false, description: 'Longer trails keep the first item and the last `maxItems - 1`, and move the rest into a "More" menu.' },
    { name: 'Breadcrumb.Separator children', type: 'React.ReactNode', required: false, description: 'Custom separator element. Defaults to a chevron icon.' },
    { name: 'Breadcrumb.Ellipsis aria-label', type: 'string', default: "'More'", required: false, description: 'Accessible label for the ellipsis element used to collapse long trails.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With ellipsis',
    },
    {
      title: 'Auto-collapse',
      description: 'Breadcrumb.Trail moves the middle of a long path into a menu.',
    },
  ],
};

export default entry;
