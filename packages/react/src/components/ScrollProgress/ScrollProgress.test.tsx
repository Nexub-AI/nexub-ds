import * as React from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ScrollProgress } from './ScrollProgress.js';

describe('ScrollProgress', () => {
  it('is decorative: hidden from assistive tech, styled by .nx-scroll-progress', () => {
    const { container } = render(<ScrollProgress className="x" data-testid="p" />);
    const bar = container.firstElementChild!;
    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect(bar).toHaveClass('nx-scroll-progress', 'x');
    expect(bar).toHaveAttribute('data-testid', 'p');
    expect(bar).toBeEmptyDOMElement();
  });

  it('forwards ref and renders on the server without inline style (CSS scroll timeline)', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ScrollProgress ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(renderToString(<ScrollProgress />)).not.toMatch(/style=/);
  });
});
