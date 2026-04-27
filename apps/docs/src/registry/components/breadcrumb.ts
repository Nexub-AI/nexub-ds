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
  },
  props: [
    { name: 'Breadcrumb.Root aria-label', type: 'string', default: "'breadcrumb'", required: false, description: 'Accessible label for the nav landmark.' },
    { name: 'Breadcrumb.Link href', type: 'string', required: false, description: 'URL the breadcrumb link navigates to.' },
    { name: 'Breadcrumb.Link asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element, useful for router Link components.' },
    { name: 'Breadcrumb.Separator children', type: 'React.ReactNode', required: false, description: 'Custom separator element. Defaults to a chevron icon.' },
    { name: 'Breadcrumb.Ellipsis aria-label', type: 'string', default: "'More'", required: false, description: 'Accessible label for the ellipsis element used to collapse long trails.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Button</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>`,
    },
    {
      title: 'With ellipsis',
      code: `<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Ellipsis />
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/components/navigation">Navigation</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>`,
    },
  ],
};

export default entry;
