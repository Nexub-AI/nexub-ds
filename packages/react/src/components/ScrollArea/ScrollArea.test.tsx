import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScrollArea } from './ScrollArea.js';

describe('ScrollArea', () => {
  it('renders children', () => {
    render(
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('forwards className to root', () => {
    render(
      <ScrollArea className="custom-scroll">
        <p>Content</p>
      </ScrollArea>,
    );
    expect(document.querySelector('.custom-scroll')).toBeInTheDocument();
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref}>
        <p>Content</p>
      </ScrollArea>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders with horizontal orientation', () => {
    render(
      <ScrollArea orientation="horizontal">
        <p>Wide content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Wide content')).toBeInTheDocument();
  });

  it('renders with both orientations', () => {
    render(
      <ScrollArea orientation="both">
        <p>Both directions content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Both directions content')).toBeInTheDocument();
  });
});
