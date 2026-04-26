import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl.js';

describe('SegmentedControl', () => {
  it('renders items', () => {
    render(
      <SegmentedControl.Root aria-label="View mode">
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radio', { name: /list/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /grid/i })).toBeInTheDocument();
  });

  it('forwards className on Root', () => {
    render(
      <SegmentedControl.Root aria-label="View mode" className="custom-root">
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('group')).toHaveClass('custom-root');
  });

  it('forwards className on Item', () => {
    render(
      <SegmentedControl.Root aria-label="View mode">
        <SegmentedControl.Item value="list" className="custom-item">List</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole('radio', { name: /list/i })).toHaveClass('custom-item');
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <SegmentedControl.Root ref={ref} aria-label="View mode">
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('clicking item changes value', () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl.Root aria-label="View mode" onValueChange={onValueChange}>
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    fireEvent.click(screen.getByRole('radio', { name: /grid/i }));
    expect(onValueChange).toHaveBeenCalledWith('grid');
  });
});
