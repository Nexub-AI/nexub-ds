import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'empty-state',
    title: 'Empty State',
    description: 'Placeholder UI shown when a list or page has no content.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'EmptyState.Root layout', type: "'centered' | 'inline'", default: "'centered'", required: false, description: '"centered" stacks content vertically in the middle of its container; "inline" aligns content to the start.' },
    { name: 'EmptyState.Illustration children', type: 'React.ReactNode', required: false, description: 'Icon or SVG illustration to render above the title.' },
    { name: 'EmptyState.Title children', type: 'React.ReactNode', required: true, description: 'Primary heading text for the empty state.' },
    { name: 'EmptyState.Description children', type: 'React.ReactNode', required: false, description: 'Supporting text providing more context or guidance.' },
    { name: 'EmptyState.Actions children', type: 'React.ReactNode', required: false, description: 'One or more action buttons rendered below the description.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<EmptyState.Root>
  <EmptyState.Illustration>
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-text-disabled)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  </EmptyState.Illustration>
  <EmptyState.Title>No results found</EmptyState.Title>
  <EmptyState.Description>
    Try adjusting your search or filters to find what you're looking for.
  </EmptyState.Description>
  <EmptyState.Actions>
    <Button variant="primary">Clear filters</Button>
    <Button variant="outline">Browse all</Button>
  </EmptyState.Actions>
</EmptyState.Root>`,
    },
    {
      title: 'Custom illustration',
      code: `<EmptyState.Root>
  <EmptyState.Illustration>
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="80" height="80" rx="40" fill="var(--color-bg-subtle)" />
      <rect x="24" y="28" width="32" height="24" rx="4" stroke="var(--color-border-strong)" strokeWidth="2" />
      <path d="M24 36h32" stroke="var(--color-border-strong)" strokeWidth="2" />
      <circle cx="40" cy="48" r="4" fill="var(--color-text-disabled)" />
    </svg>
  </EmptyState.Illustration>
  <EmptyState.Title>No documents yet</EmptyState.Title>
  <EmptyState.Description>
    Upload your first document to get started.
  </EmptyState.Description>
  <EmptyState.Actions>
    <Button variant="primary">Upload document</Button>
  </EmptyState.Actions>
</EmptyState.Root>`,
    },
  ],
};

export default entry;
