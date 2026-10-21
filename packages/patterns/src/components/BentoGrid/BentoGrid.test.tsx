import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BentoGrid, BentoTile } from './BentoGrid.js';

// jsdom has no container queries; these check the literal classes.
describe('BentoGrid', () => {
  it('is a container wrapping a dense responsive grid', () => {
    const { container } = render(
      <BentoGrid className="x">
        <BentoTile>A</BentoTile>
      </BentoGrid>,
    );
    const outer = container.firstChild as HTMLElement;
    expect(outer).toHaveClass('[container-type:inline-size]', 'x');
    expect(outer.firstChild).toHaveClass(
      'grid',
      'grid-flow-row-dense',
      'gap-4',
      'auto-rows-[minmax(10rem,auto)]',
      'grid-cols-1',
      '[@container(min-width:480px)]:grid-cols-2',
      '[@container(min-width:768px)]:grid-cols-4',
    );
  });

  it.each([
    ['1x1', [], ['row-span-2', '[@container(min-width:480px)]:col-span-2']],
    ['2x1', ['[@container(min-width:480px)]:col-span-2'], ['row-span-2']],
    ['1x2', ['row-span-2'], ['[@container(min-width:480px)]:col-span-2']],
    ['2x2', ['[@container(min-width:480px)]:col-span-2', 'row-span-2'], []],
  ] as const)('tile %s spans', (size, has, hasNot) => {
    render(<BentoTile size={size}>T</BentoTile>);
    const tile = screen.getByText('T');
    expect(tile).toHaveClass('rounded-shape-container', ...has);
    hasNot.forEach((c) => expect(tile).not.toHaveClass(c));
    expect(tile).not.toHaveClass('col-span-2');
  });

  it('supports asChild', () => {
    render(
      <BentoTile asChild size="2x1">
        <section>S</section>
      </BentoTile>,
    );
    const el = screen.getByText('S');
    expect(el.tagName).toBe('SECTION');
    expect(el).toHaveClass('[@container(min-width:480px)]:col-span-2');
  });

  it('renders no style attribute (strict CSP)', () => {
    const html = renderToString(
      <BentoGrid>
        <BentoTile size="2x2">A</BentoTile>
        <BentoTile>B</BentoTile>
      </BentoGrid>,
    );
    expect(html).not.toContain('style="');
  });
});
