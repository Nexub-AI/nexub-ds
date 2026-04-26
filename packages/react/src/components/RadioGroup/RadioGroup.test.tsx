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
});
