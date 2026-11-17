import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RadioGroup } from './RadioGroup.js';

describe('RadioGroup', () => {
  it('renders', () => {
    render(
      <RadioGroup.Root aria-label="Options">
        <RadioGroup.Item value="a" aria-label="Option A" />
        <RadioGroup.Item value="b" aria-label="Option B" />
      </RadioGroup.Root>,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('forwards className on Root', () => {
    render(
      <RadioGroup.Root aria-label="Options" className="custom-root">
        <RadioGroup.Item value="a" aria-label="Option A" />
      </RadioGroup.Root>,
    );
    expect(screen.getByRole('radiogroup')).toHaveClass('custom-root');
  });

  it('forwards className on Item', () => {
    render(
      <RadioGroup.Root aria-label="Options">
        <RadioGroup.Item value="a" aria-label="Option A" className="custom-item" />
      </RadioGroup.Root>,
    );
    expect(screen.getByRole('radio', { name: 'Option A' })).toHaveClass('custom-item');
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RadioGroup.Root ref={ref} aria-label="Options">
        <RadioGroup.Item value="a" aria-label="Option A" />
      </RadioGroup.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('selecting an item fires onValueChange', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root aria-label="Options" onValueChange={onValueChange}>
        <RadioGroup.Item value="a" aria-label="Option A" />
        <RadioGroup.Item value="b" aria-label="Option B" />
      </RadioGroup.Root>,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Option A' }));
    expect(onValueChange).toHaveBeenCalledWith('a');
  });

  it('the selected dot carries the spring scale-in hook', () => {
    render(
      <RadioGroup.Root aria-label="Options" defaultValue="a">
        <RadioGroup.Item value="a" aria-label="Option A" />
      </RadioGroup.Root>,
    );
    expect(screen.getByRole('radio').querySelector('.nx-dot-in')).not.toBeNull();
  });
});

describe('RadioGroup 10.4 consistent controls', () => {
  it('size on the group reaches the items; md stays 18px (in rem)', () => {
    const { rerender } = render(
      <RadioGroup.Root aria-label="Options" defaultValue="a">
        <RadioGroup.Item value="a" aria-label="Option A" />
      </RadioGroup.Root>,
    );
    expect(screen.getByRole('radio')).toHaveClass('h-[1.125rem]', 'w-[1.125rem]');
    rerender(
      <RadioGroup.Root aria-label="Options" defaultValue="a" size="lg">
        <RadioGroup.Item value="a" aria-label="Option A" />
      </RadioGroup.Root>,
    );
    expect(screen.getByRole('radio')).toHaveClass('h-5', 'w-5');
    expect(screen.getByRole('radio').querySelector('.nx-dot-in')).toHaveClass('h-2.5');
  });

  it('invalid marks the group and its items', () => {
    render(
      <RadioGroup.Root aria-label="Options" invalid>
        <RadioGroup.Item value="a" aria-label="Option A" />
      </RadioGroup.Root>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('invalid');
    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('readOnly: aria-readonly on the group, items focusable, selection cannot change', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root aria-label="Options" defaultValue="a" readOnly onValueChange={onValueChange}>
        <RadioGroup.Item value="a" aria-label="Option A" />
        <RadioGroup.Item value="b" aria-label="Option B" />
      </RadioGroup.Root>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
    const b = screen.getByRole('radio', { name: 'Option B' });
    expect(b).not.toBeDisabled();
    fireEvent.click(b);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(b).toHaveAttribute('data-state', 'unchecked');
  });
});
