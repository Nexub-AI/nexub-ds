import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToggleGroup } from './ToggleGroup.js';

describe('ToggleGroup', () => {
  it('renders', () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Text alignment">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('forwards className on Root', () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Alignment" className="custom-root">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getByRole('group')).toHaveClass('custom-root');
  });

  it('forwards className on Item', () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Alignment">
        <ToggleGroup.Item value="left" className="custom-item">Left</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getByRole('radio', { name: /left/i })).toHaveClass('custom-item');
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ToggleGroup.Root ref={ref} type="single" aria-label="Alignment">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('selecting an item changes its state to on', () => {
    render(
      <ToggleGroup.Root type="single" aria-label="Text alignment">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const leftBtn = screen.getByRole('radio', { name: /left/i });
    expect(leftBtn).toHaveAttribute('data-state', 'off');
    fireEvent.click(leftBtn);
    expect(leftBtn).toHaveAttribute('data-state', 'on');
  });
});
