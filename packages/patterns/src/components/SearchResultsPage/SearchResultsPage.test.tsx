import * as React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { XSS_TEXT, XSS_URLS, auditDom } from 'xss-corpus';
import { SearchResultsPage, type SearchResult } from './index.js';

afterEach(cleanup);

const results: SearchResult[] = [
  { id: '1', title: 'Quarterly invoice summary', href: '/docs/1', excerpt: 'Every invoice sent this quarter, by customer.', meta: 'Reports · 3 Nov', kind: 'Report', icon: <svg aria-hidden="true" /> },
  { id: '2', title: 'Invoice template', onSelect: vi.fn(), excerpt: 'The default layout.' },
  { id: '3', title: 'Plain result' },
];
const noop = () => {};

describe('SearchResultsPage', () => {
  it('has an h1, a search landmark, a polite count and one link per result named by its title', async () => {
    const onSelect = vi.fn();
    render(<SearchResultsPage query="invoice" onQueryChange={noop} results={[{ ...results[0]!, onSelect }, results[1]!, results[2]!]} total={24} />);
    expect(screen.getByRole('main', { name: 'Search results' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Search results' })).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('24 results for “invoice”');
    const link = screen.getByRole('link', { name: 'Quarterly invoice summary' });
    expect(link).toHaveAttribute('href', '/docs/1');
    expect(screen.getAllByRole('link')).toHaveLength(1);
    link.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(link);
    expect(onSelect).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Invoice template' }));
    expect(results[1]!.onSelect).toHaveBeenCalled();
    expect(screen.getByText('Report')).toBeInTheDocument();
    expect(screen.getByText('Reports · 3 Nov')).toBeInTheDocument();
  });

  it('highlights the query words with <mark>, safely, and can be turned off', () => {
    const { rerender, container } = render(<SearchResultsPage query="invoice quarter (" onQueryChange={noop} results={results} />);
    const marks = [...container.querySelectorAll('mark')].map((x) => x.textContent);
    expect(marks).toEqual(['Quarter', 'invoice', 'invoice', 'quarter', 'Invoice']);
    expect(screen.getByRole('status')).toHaveTextContent('3 results');
    rerender(<SearchResultsPage query="invoice" onQueryChange={noop} results={results} highlight={false} />);
    expect(container.querySelector('mark')).toBeNull();
    rerender(<SearchResultsPage query="  " onQueryChange={noop} results={results} />);
    expect(container.querySelector('mark')).toBeNull();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    rerender(<SearchResultsPage query="plain" onQueryChange={noop} results={results.slice(2)} />);
    expect(screen.getByRole('status')).toHaveTextContent('1 result for “plain”');
  });

  it('types, clears and submits the query', async () => {
    const onQueryChange = vi.fn();
    const onSubmit = vi.fn();
    render(<SearchResultsPage query="inv" onQueryChange={onQueryChange} onSubmit={onSubmit} results={results} />);
    const box = screen.getByRole('searchbox', { name: 'Search' });
    await userEvent.type(box, 'o{Enter}');
    expect(onQueryChange).toHaveBeenCalledWith('invo');
    expect(onSubmit).toHaveBeenCalledWith('inv');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onQueryChange).toHaveBeenCalledWith('');
  });

  it('kinds as tabs, the filter and sort slots, and paging', async () => {
    const onKindChange = vi.fn();
    const onPageChange = vi.fn();
    render(
      <SearchResultsPage
        query="invoice"
        onQueryChange={noop}
        results={results}
        total={42}
        page={1}
        pageSize={10}
        onPageChange={onPageChange}
        kinds={[
          { id: 'all', label: 'All', count: 42 },
          { id: 'files', label: 'Files' },
        ]}
        onKindChange={onKindChange}
        filters={<button type="button">Date</button>}
        sort={<button type="button">Newest</button>}
      />,
    );
    expect(screen.getByRole('tab', { name: /All/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: 'Files' }));
    expect(onKindChange).toHaveBeenCalledWith('files');
    expect(screen.getByRole('button', { name: 'Date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Newest' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('data states: loading, no results with suggestions, a custom empty state, and error wins', async () => {
    const onQueryChange = vi.fn();
    const onSubmit = vi.fn();
    const { rerender } = render(<SearchResultsPage query="invoice" onQueryChange={noop} results={[]} loading />);
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    rerender(<SearchResultsPage query="invioce" onQueryChange={onQueryChange} onSubmit={onSubmit} results={[]} suggestions={['invoice']} />);
    expect(screen.getByRole('status')).toHaveTextContent('0 results for “invioce”');
    expect(screen.getByText('Try:')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'invoice' }));
    expect(onQueryChange).toHaveBeenCalledWith('invoice');
    expect(onSubmit).toHaveBeenCalledWith('invoice');
    rerender(<SearchResultsPage query="invioce" onQueryChange={onQueryChange} results={[]} suggestions={['invoice']} />);
    await userEvent.click(screen.getByRole('button', { name: 'invoice' }));
    rerender(<SearchResultsPage query="x" onQueryChange={noop} results={[]} />);
    expect(screen.queryByText('Try:')).toBeNull();
    rerender(<SearchResultsPage query="x" onQueryChange={noop} results={[]} emptyState={<p>Nothing matched</p>} />);
    expect(screen.getByText('Nothing matched')).toBeInTheDocument();
    rerender(<SearchResultsPage query="x" onQueryChange={noop} results={results} loading errorState={<p role="alert">Search is down</p>} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });
});

// 9.6 corpus (src/xss.test.tsx style): the props that render a URL or user text.
describe('SearchResultsPage injection', () => {
  it.each(XSS_URLS)('results[].href renders nothing script-capable for %j', (url) => {
    render(<SearchResultsPage query="t" onQueryChange={noop} results={[{ id: '1', title: 't', href: url }]} />);
    expect(auditDom()).toEqual([]);
  });

  it.each(XSS_TEXT)('query, title, excerpt, kind and suggestions render %j as text', (text) => {
    const { rerender } = render(<SearchResultsPage query={text} onQueryChange={noop} results={[{ id: '1', title: text, excerpt: text, kind: text, href: '/ok' }]} />);
    expect(auditDom()).toEqual([]);
    expect(screen.getByRole('link').textContent).toBe(text);
    rerender(<SearchResultsPage query={text} onQueryChange={noop} results={[]} suggestions={[text]} />);
    expect(auditDom()).toEqual([]);
    expect(document.body.textContent).toContain(text);
  });
});
