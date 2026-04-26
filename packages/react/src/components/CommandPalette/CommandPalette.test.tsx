import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CommandPalette } from './CommandPalette.js';

describe('CommandPalette', () => {
  it('renders without crashing when closed', () => {
    // CommandPalette.Root wraps RadixDialog which renders nothing in the DOM
    // when open=false (the default). This smoke test verifies the component
    // tree can be constructed without throwing.
    expect(() =>
      render(
        <CommandPalette.Root open={false}>
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Empty>No results.</CommandPalette.Empty>
            <CommandPalette.Group heading="Suggestions">
              <CommandPalette.Item>Item one</CommandPalette.Item>
            </CommandPalette.Group>
          </CommandPalette.List>
        </CommandPalette.Root>,
      ),
    ).not.toThrow();
  });

  it('renders content when open', () => {
    const { getByPlaceholderText } = render(
      <CommandPalette.Root open>
        <CommandPalette.Input placeholder="Type a command..." />
        <CommandPalette.List>
          <CommandPalette.Empty>No results found.</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>,
    );
    expect(getByPlaceholderText('Type a command...')).toBeInTheDocument();
  });

  it('renders items when open', () => {
    const { getByText } = render(
      <CommandPalette.Root open>
        <CommandPalette.List>
          <CommandPalette.Group heading="Actions">
            <CommandPalette.Item>Create project</CommandPalette.Item>
            <CommandPalette.Item>Open settings</CommandPalette.Item>
          </CommandPalette.Group>
        </CommandPalette.List>
      </CommandPalette.Root>,
    );
    expect(getByText('Create project')).toBeInTheDocument();
    expect(getByText('Open settings')).toBeInTheDocument();
  });
});
