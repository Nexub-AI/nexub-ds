import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AspectRatio } from './AspectRatio.js';

describe('AspectRatio', () => {
  it('renders children', () => {
    const { getByText } = render(<AspectRatio><div>content</div></AspectRatio>);
    expect(getByText('content')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<AspectRatio className="custom">x</AspectRatio>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AspectRatio ref={ref}>x</AspectRatio>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('sets default 16/9 aspect ratio via inline style', () => {
    const { container } = render(<AspectRatio>x</AspectRatio>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.aspectRatio).toBe(String(16 / 9));
  });

  it('accepts a custom ratio', () => {
    const { container } = render(<AspectRatio ratio={4 / 3}>x</AspectRatio>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.aspectRatio).toBe(String(4 / 3));
  });
});
