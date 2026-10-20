/// <reference types="node" />
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from './Logo.js';

describe('Logo', () => {
  it('renders in full variant by default', () => {
    render(<Logo />);
    expect(screen.getByText('nexub')).toBeInTheDocument();
  });

  it('does not render wordmark in icon variant (and its old name, mark)', () => {
    const { rerender } = render(<Logo variant="icon" />);
    expect(screen.queryByText('nexub')).not.toBeInTheDocument();
    rerender(<Logo variant="mark" />);
    expect(screen.queryByText('nexub')).not.toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Logo className="custom" />);
    expect(screen.getByLabelText('Nexub')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Logo ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('is an image named Nexub', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'Nexub' })).toBeInTheDocument();
  });

  it('renders the colour mark from brand tokens by default', () => {
    const { container } = render(<Logo />);
    const stops = container.querySelectorAll('stop');
    expect(stops.length).toBeGreaterThan(0);
    stops.forEach((s) => expect(s.getAttribute('class')).toMatch(/^nxm-s-\d+/));
  });

  it('renders a single currentColor path when mark="mono"', () => {
    const { container } = render(<Logo mark="mono" />);
    expect(container.querySelectorAll('stop')).toHaveLength(0);
    expect(container.querySelectorAll('path')).toHaveLength(1);
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'currentColor');
  });

  it('gives each instance its own gradient ids', () => {
    const { container } = render(<><Logo /><Logo /></>);
    const ids = [...container.querySelectorAll('linearGradient')].map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('shows the product name after the wordmark and names the image with it', () => {
    render(<Logo product="Command Hub" />);
    expect(screen.getByText('Command Hub')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Nexub Command Hub' })).toBeInTheDocument();
  });

  it('hides the product name in the icon variant', () => {
    render(<Logo variant="icon" product="Account" />);
    expect(screen.queryByText('Account')).not.toBeInTheDocument();
  });

  it('renders the colour mark with no style attributes, so a strict CSP keeps its colours', () => {
    const html = renderToString(<Logo mark="color" />);
    expect(html).toContain('<stop');
    expect(html).not.toMatch(/\sstyle=/);
    // Every stop class has its rule in @nexub/themes base.css.
    const css = readFileSync(createRequire(import.meta.url).resolve('@nexub/themes/base'), 'utf8');
    const classes = new Set([...html.matchAll(/class="(nxm-[^"]+)"/g)].flatMap((m) => (m[1] ?? '').split(' ')));
    expect(classes.size).toBeGreaterThan(0);
    for (const c of classes) expect(css).toContain(`.${c}{`);
  });
});
