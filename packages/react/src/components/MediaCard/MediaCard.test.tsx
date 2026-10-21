import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MediaCard } from './MediaCard.js';

describe('MediaCard', () => {
  it('renders a lazy image in the ratio box with the caption', () => {
    render(<MediaCard src="/a.jpg" alt="Harbour at dusk" ratio="4/3" eyebrow="Travel" title="Lisbon" description="Three days" />);
    const img = screen.getByRole('img', { name: 'Harbour at dusk' });
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img.parentElement).toHaveClass('aspect-[4/3]');
    expect(screen.getByRole('heading', { name: 'Lisbon' })).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Three days')).toBeInTheDocument();
  });

  it('treats alt="" as decorative', () => {
    const { container } = render(<MediaCard src="/a.jpg" alt="" />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('has no link, lift or glass caption without href/caption', () => {
    const { container } = render(<MediaCard src="/a.jpg" alt="x" />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(container.firstChild).not.toHaveClass('hover:shadow-elevation-2');
    expect(container.querySelector('[data-material="glass"]')).toBeNull();
  });

  it('with href, the title is one stretched link and actions stay above it', () => {
    const { container } = render(
      <MediaCard src="/a.jpg" alt="" title="Lisbon" href="/trips/lisbon">
        <button type="button">Save</button>
      </MediaCard>,
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('Lisbon');
    expect(links[0]).toHaveAttribute('href', '/trips/lisbon');
    expect(links[0]).toHaveClass('after:absolute', 'after:inset-0');
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('relative', 'has-[a:focus-visible]:outline', 'motion-safe:hover:-translate-y-0.5');
    expect(screen.getByRole('button', { name: 'Save' }).parentElement).toHaveClass('relative', 'z-[1]');
    expect(container.querySelector('[data-material="glass"]')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<MediaCard ref={ref} src="/a.jpg" alt="" className="w-64" />);
    expect(ref.current).toHaveClass('w-64');
  });

  it('renders no style attribute (strict CSP)', () => {
    const html = renderToString(
      <MediaCard src="/a.jpg" alt="" title="T" description="D" eyebrow="E" href="/x">
        <button type="button">A</button>
      </MediaCard>,
    );
    expect(html).not.toContain('style="');
  });
});
