import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Combobox } from './Combobox.js';

describe('Combobox', () => {
  it('renders without crashing', () => {
    render(
      <Combobox.Root>
        <Combobox.Input placeholder="Search…" />
        <Combobox.List>
          <Combobox.Empty>No results.</Combobox.Empty>
          <Combobox.Item value="apple">Apple</Combobox.Item>
          <Combobox.Item value="banana">Banana</Combobox.Item>
        </Combobox.List>
      </Combobox.Root>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards className on Root', () => {
    render(
      <Combobox.Root className="custom-root">
        <Combobox.Input placeholder="Search…" />
        <Combobox.List>
          <Combobox.Empty>No results.</Combobox.Empty>
        </Combobox.List>
      </Combobox.Root>,
    );
    expect(document.querySelector('.custom-root')).toBeInTheDocument();
  });

  it('typing filters items', async () => {
    const user = userEvent.setup();
    render(
      <Combobox.Root>
        <Combobox.Input placeholder="Search…" />
        <Combobox.List>
          <Combobox.Empty>No results.</Combobox.Empty>
          <Combobox.Item value="apple">Apple</Combobox.Item>
          <Combobox.Item value="banana">Banana</Combobox.Item>
        </Combobox.List>
      </Combobox.Root>,
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'ban');
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });
});
