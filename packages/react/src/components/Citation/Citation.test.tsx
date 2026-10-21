import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Citation, SourceChip, SourceList, safeUrl } from './Citation.js';

const source = {
  title: 'Attention is all you need',
  url: 'https://www.arxiv.org/abs/1706.03762',
  snippet: 'The dominant sequence transduction models…',
  favicon: 'https://arxiv.org/favicon.ico',
};

describe('safeUrl', () => {
  it('allows http/https only', () => {
    expect(safeUrl('https://a.com/x')).toBe('https://a.com/x');
    expect(safeUrl('http://a.com')).toBe('http://a.com/');
    expect(safeUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeUrl(' JaVaScRiPt:alert(1)')).toBeUndefined();
    expect(safeUrl('data:text/html,<script>')).toBeUndefined();
    expect(safeUrl('/relative')).toBeUndefined();
    expect(safeUrl(undefined)).toBeUndefined();
  });
});

describe('Citation', () => {
  it('is a new-tab link named "Source n: title"', () => {
    render(<p>Text<Citation index={1} source={source} /></p>);
    const link = screen.getByRole('link', { name: 'Source 1: Attention is all you need' });
    expect(link).toHaveAttribute('href', source.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('1');
  });

  it('renders a javascript: URL as text, not a link', () => {
    const { container } = render(<Citation index={2} source={{ title: 'Evil', url: 'javascript:alert(1)' }} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(container.querySelector('[href]')).toBeNull();
    expect(screen.getByText('Source 2: Evil')).toBeInTheDocument();
  });

  it('previews the source on focus', async () => {
    const user = userEvent.setup();
    render(<Citation index={1} source={source} />);
    await user.tab();
    const card = await screen.findByText('The dominant sequence transduction models…');
    const content = card.parentElement!;
    expect(within(content).getByText('Attention is all you need')).toHaveClass('line-clamp-2');
    expect(within(content).getByText('arxiv.org')).toBeInTheDocument();
    const img = content.querySelector('img')!;
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('accepts message overrides', () => {
    render(<Citation index={3} source={source} messages={{ source: (n) => `Quelle ${n}` }} />);
    expect(screen.getByRole('link', { name: 'Quelle 3: Attention is all you need' })).toBeInTheDocument();
  });

  it('renders no style attribute (strict CSP)', () => {
    const html = renderToString(
      <>
        <Citation index={1} source={source} />
        <SourceList sources={[source, { title: 'X', url: 'javascript:void 0' }]} />
      </>,
    );
    expect(html).not.toContain('style="');
  });
});

describe('SourceChip', () => {
  it('links with favicon letter fallback, domain and title', () => {
    render(<SourceChip source={{ title: 'Docs', url: 'https://example.com/a' }} />);
    const link = screen.getByRole('link', { name: /example\.com.*Docs/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveTextContent('E');
  });

  it('ignores non-http favicons', () => {
    const { container } = render(<SourceChip source={{ title: 'D', url: 'https://e.com', favicon: 'javascript:x' }} />);
    expect(container.querySelector('img')).toBeNull();
  });
});

describe('SourceList', () => {
  it('is a region named "Sources" with a list of chips', () => {
    render(<SourceList sources={[source, { title: 'Bad', url: 'javascript:alert(1)' }]} />);
    const region = screen.getByRole('region', { name: 'Sources' });
    const items = within(region).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByRole('link')).toBeInTheDocument();
    expect(within(items[1]!).queryByRole('link')).toBeNull();
    expect(items[1]).toHaveTextContent('Bad');
  });
});
