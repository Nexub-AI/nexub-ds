import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FileText, Receipt, User } from '@nexub/icons';
import { SearchResultsPage, type SearchResult } from './SearchResultsPage.js';

const meta: Meta<typeof SearchResultsPage> = {
  title: 'Patterns/Pages/SearchResultsPage',
  component: SearchResultsPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof SearchResultsPage>;

const all: SearchResult[] = [
  { id: '1', title: 'Invoice INV-2041', href: '#inv-2041', excerpt: 'Northwind Traders, design sprint and user interviews. Due 17 Nov.', meta: 'Billing · 3 Nov 2026', kind: 'Invoice', icon: <Receipt size={18} aria-hidden="true" /> },
  { id: '2', title: 'How invoice reminders work', href: '#reminders', excerpt: 'A reminder goes out three days before an invoice is due, and again on the day.', meta: 'Help · Updated in October', kind: 'Article', icon: <FileText size={18} aria-hidden="true" /> },
  { id: '3', title: 'Idris Cole', href: '#idris', excerpt: 'Editor. Owns the invoice templates for Harbour Studio.', meta: 'Team', kind: 'Person', icon: <User size={18} aria-hidden="true" /> },
];

function Demo({ initial }: { initial: string }) {
  const [query, setQuery] = React.useState(initial);
  const [kind, setKind] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const results = query.toLowerCase().includes('invoice') ? all.filter((r) => kind === 'all' || r.kind?.toLowerCase() === kind) : [];
  return (
    <SearchResultsPage
      as="div"
      query={query}
      onQueryChange={setQuery}
      results={results}
      total={results.length ? 24 : 0}
      page={page}
      pageSize={10}
      onPageChange={setPage}
      kinds={[
        { id: 'all', label: 'All', count: 24 },
        { id: 'invoice', label: 'Invoices', count: 14 },
        { id: 'article', label: 'Articles', count: 7 },
        { id: 'person', label: 'People', count: 3 },
      ]}
      kind={kind}
      onKindChange={setKind}
      suggestions={['invoice', 'invoice template']}
    />
  );
}

/** The query's words are marked in titles and excerpts; the count is announced. */
export const Default: Story = { render: () => <Demo initial="invoice" /> };

/** Nothing matched: suggestions to try. */
export const NoResults: Story = { render: () => <Demo initial="invioce" /> };
