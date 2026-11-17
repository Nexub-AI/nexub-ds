import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    expect(screen.getByRole('radiogroup')).toHaveClass('custom-root');
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

describe('ToggleGroup sliding indicator (10.5)', () => {
  it('single: one indicator, measured from the on item; the item keeps its own fill as the fallback', () => {
    const { container } = render(
      <ToggleGroup.Root type="single" defaultValue="left" aria-label="Alignment">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const root = screen.getByRole('radiogroup');
    expect(container.querySelectorAll('[data-nx="toggle-indicator"]')).toHaveLength(1);
    expect(root.style.getPropertyValue('--nx-ind-o')).toBe('1');
    const left = screen.getByRole('radio', { name: 'Left' });
    expect(left).toHaveClass('data-[state=on]:bg-[var(--color-secondary-container)]', 'group-data-[nx-indicator=ready]/tg:data-[state=on]:bg-transparent');
    fireEvent.click(left);
    // Nothing selected: the indicator hides.
    return waitFor(() => expect(root.style.getPropertyValue('--nx-ind-o')).toBe('0'));
  });

  it('multiple: no indicator, items paint their own fill', () => {
    const { container } = render(
      <ToggleGroup.Root type="multiple" defaultValue={['left']} aria-label="Marks">
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(container.querySelector('[data-nx="toggle-indicator"]')).toBeNull();
    expect(screen.getByRole('toolbar').style.getPropertyValue('--nx-ind-o')).toBe('');
  });
});
