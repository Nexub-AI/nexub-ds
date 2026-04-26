import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'table',
    title: 'Table',
    description: 'Semantic HTML table with styled variants.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'Table.Root striped', type: 'boolean', default: 'false', required: false, description: 'Applies alternating row background colours.' },
    { name: 'Table.Root bordered', type: 'boolean', default: 'false', required: false, description: 'Adds borders between rows and columns.' },
    { name: 'Table.Root hoverable', type: 'boolean', default: 'false', required: false, description: 'Highlights rows on mouse hover.' },
    { name: 'Table.Root stickyHeader', type: 'boolean', default: 'false', required: false, description: 'Fixes the table header to the top when scrolling inside a scrollable container.' },
    { name: 'Table.Head align', type: "'start' | 'center' | 'end'", default: "'start'", required: false, description: 'Text alignment within the header cell.' },
    { name: 'Table.Cell align', type: "'start' | 'center' | 'end'", default: "'start'", required: false, description: 'Text alignment within the data cell.' },
    { name: 'Table.Caption side', type: "'top' | 'bottom'", default: "'bottom'", required: false, description: 'Whether the caption appears above or below the table.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Date</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Alice Johnson</Table.Cell>
      <Table.Cell><StatusPill tone="success" label="Active" /></Table.Cell>
      <Table.Cell>12 Jan 2026</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Bob Martinez</Table.Cell>
      <Table.Cell><StatusPill tone="warning" label="Pending" /></Table.Cell>
      <Table.Cell>18 Feb 2026</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Carol Smith</Table.Cell>
      <Table.Cell><StatusPill tone="neutral" label="Inactive" /></Table.Cell>
      <Table.Cell>03 Mar 2026</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>`,
    },
    {
      title: 'With caption',
      code: `<Table.Root>
  <Table.Caption>Recent user activity — last 30 days</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Date</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Alice Johnson</Table.Cell>
      <Table.Cell><StatusPill tone="success" label="Active" /></Table.Cell>
      <Table.Cell>12 Jan 2026</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Bob Martinez</Table.Cell>
      <Table.Cell><StatusPill tone="warning" label="Pending" /></Table.Cell>
      <Table.Cell>18 Feb 2026</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Carol Smith</Table.Cell>
      <Table.Cell><StatusPill tone="neutral" label="Inactive" /></Table.Cell>
      <Table.Cell>03 Mar 2026</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colSpan={3} style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
        Showing 3 of 3 users
      </Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>`,
    },
  ],
};

export default entry;
