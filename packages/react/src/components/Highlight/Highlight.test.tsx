import * as React from 'react';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import axe from 'axe-core';
import { contrastRatio } from '@nexub/tokens/seed';
import { Highlight, type HighlightTone } from './Highlight.js';

const TONES: HighlightTone[] = ['neutral', 'primary', 'success', 'warning', 'error', 'info'];

describe('Highlight', () => {
  it('is a span (not <mark>) with the tone container pair', () => {
    render(
      <p>
        Total <Highlight tone="success">€1,240.00</Highlight> due <Highlight>25 Nov</Highlight>
      </p>,
    );
    const amount = screen.getByText('€1,240.00');
    expect(amount.tagName).toBe('SPAN');
    expect(amount).toHaveAttribute('data-tone', 'success');
    expect(amount).toHaveClass('bg-[var(--color-success-container)]', 'text-[var(--color-on-success-container)]');
    expect(screen.getByText('25 Nov')).toHaveAttribute('data-tone', 'neutral');
    expect(document.querySelector('mark')).toBeNull();
  });

  it('forwards the ref and extra props', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Highlight ref={ref} className="x" title="t">a</Highlight>);
    expect(ref.current).toHaveClass('x');
    expect(ref.current).toHaveAttribute('title', 't');
  });

  it('is axe-clean in every tone', async () => {
    const { container } = render(
      <p>
        {TONES.map((t) => (
          <Highlight key={t} tone={t}>
            {t}
          </Highlight>
        ))}
      </p>,
    );
    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });

  // The default theme's tokens, resolved from the built CSS: every tone's text on its own
  // container meets AA (4.5:1) in light and dark at the standard contrast level.
  it('meets AA contrast in light and dark', () => {
    const req = createRequire(import.meta.url);
    const vars = readFileSync(req.resolve('@nexub/tokens/css'), 'utf8');
    const roles = readFileSync(req.resolve('@nexub/tokens/css/roles'), 'utf8');
    const palette = (name: string) => vars.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
    const role = (name: string): [string, string] => {
      const m = roles.match(new RegExp(`--color-${name}:\\s*light-dark\\(var\\(--([\\w-]+)\\),\\s*var\\(--([\\w-]+)\\)\\)`));
      if (!m) throw new Error(`no role ${name}`);
      return [palette(m[1]!)!, palette(m[2]!)!];
    };
    const pairs: Record<HighlightTone, [string, string]> = {
      neutral: ['on-surface', 'surface-container-highest'],
      primary: ['on-primary-container', 'primary-container'],
      success: ['on-success-container', 'success-container'],
      warning: ['on-warning-container', 'warning-container'],
      error: ['on-error-container', 'error-container'],
      info: ['on-info-container', 'info-container'],
    };
    for (const tone of TONES) {
      const [fg, bg] = pairs[tone];
      const [fgLight, fgDark] = role(fg);
      const [bgLight, bgDark] = role(bg);
      expect(contrastRatio(fgLight, bgLight), `${tone} light`).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(fgDark, bgDark), `${tone} dark`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
