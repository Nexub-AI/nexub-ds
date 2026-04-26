import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from './Select.js';

describe('Select', () => {
  it('renders without crashing', () => {
    render(
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Option A</Select.Item>
          <Select.Item value="b">Option B</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards className on Trigger', () => {
    render(
      <Select.Root>
        <Select.Trigger className="custom-trigger">
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
      </Select.Root>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
  });
});
