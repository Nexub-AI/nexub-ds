import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach } from 'vitest';
import { Truncate } from './Truncate.js';

// jsdom has no layout: fake the box sizes the component measures.
const sizes = { scrollWidth: 0, clientWidth: 0, scrollHeight: 0, clientHeight: 0 };
for (const key of Object.keys(sizes) as (keyof typeof sizes)[]) {
  Object.defineProperty(HTMLElement.prototype, key, { configurable: true, get: () => sizes[key] });
}
afterEach(() => Object.assign(sizes, { scrollWidth: 0, clientWidth: 0, scrollHeight: 0, clientHeight: 0 }));

const long = 'A very long invoice description that does not fit';

describe('Truncate', () => {
  it('text that fits: clipped by CSS only, no tab stop and no tooltip', async () => {
    Object.assign(sizes, { scrollWidth: 100, clientWidth: 100 });
    render(<Truncate>{long}</Truncate>);
    const el = screen.getByText(long);
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('truncate');
    expect(el).not.toHaveAttribute('tabindex');
    await userEvent.tab();
    expect(el).not.toHaveFocus();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('clipped text is a tab stop whose tooltip holds the full text', async () => {
    Object.assign(sizes, { scrollWidth: 300, clientWidth: 100 });
    render(<Truncate>{long}</Truncate>);
    // The tab stop arrives once the lazy tooltip has loaded.
    await waitFor(() => expect(screen.getByText(long)).toHaveAttribute('tabindex', '0'));
    await userEvent.tab();
    expect(document.activeElement).toHaveClass('truncate');
    expect(await screen.findByRole('tooltip')).toHaveTextContent(long);
  });

  it('lines > 1 uses line-clamp and measures the height; `as` picks the element', async () => {
    Object.assign(sizes, { scrollWidth: 300, clientWidth: 100, scrollHeight: 40, clientHeight: 40 });
    const { rerender } = render(<Truncate lines={2} as="p">{long}</Truncate>);
    const el = () => screen.getByText(long);
    expect(el().tagName).toBe('P');
    expect(el()).toHaveClass('line-clamp-2');
    expect(el()).not.toHaveAttribute('tabindex');
    // Re-measured when the children change.
    sizes.scrollHeight = 80;
    rerender(<Truncate lines={2} as="p">{`${long}, twice`}</Truncate>);
    await waitFor(() => expect(screen.getByText(`${long}, twice`)).toHaveAttribute('tabindex', '0'));
  });

  it('tooltip={false} and non-string children clip without a tab stop', () => {
    Object.assign(sizes, { scrollWidth: 300, clientWidth: 100 });
    render(
      <>
        <Truncate tooltip={false}>{long}</Truncate>
        <Truncate data-testid="rich">
          <b>Bold</b> text
        </Truncate>
      </>,
    );
    expect(screen.getByText(long)).not.toHaveAttribute('tabindex');
    expect(screen.getByTestId('rich')).not.toHaveAttribute('tabindex');
  });

  it('forwards the ref and extra props', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Truncate ref={ref} className="w-40" title="x">{long}</Truncate>);
    expect(ref.current).toBe(screen.getByText(long));
    expect(ref.current).toHaveClass('w-40');
  });
});
