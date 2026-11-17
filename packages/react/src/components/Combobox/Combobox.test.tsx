import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Combobox } from './Combobox.js';

describe('Combobox', () => {
  it('never scrolls the page to the highlighted item on mount', () => {
    const native = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
    const itemRef = React.createRef<HTMLDivElement>();
    render(
      <Combobox.Root>
        <Combobox.Input placeholder="Search…" />
        <Combobox.List>
          <Combobox.Group heading="Fruit">
            <Combobox.Item ref={itemRef} value="apple">Apple</Combobox.Item>
            <Combobox.Item value="banana">Banana</Combobox.Item>
          </Combobox.Group>
        </Combobox.List>
      </Combobox.Root>,
    );
    expect(itemRef.current).toHaveAttribute('aria-selected', 'true');
    expect(native).not.toHaveBeenCalled();
    native.mockRestore();
  });

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

  it('loading shows a loading row, sets aria-busy and hides Empty', () => {
    render(
      <Combobox.Root>
        <Combobox.Input />
        <Combobox.List loading>
          <Combobox.Empty>No results.</Combobox.Empty>
        </Combobox.List>
      </Combobox.Root>,
    );
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('listbox')).toHaveTextContent('Loading…');
    // Only options/groups may sit in a listbox: no progressbar row.
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.getByText('No results.').closest('[cmdk-list]')).toHaveClass('[&_[cmdk-empty]]:hidden');
  });
});

describe('Combobox 10.4', () => {
  it('Input size: md by default, sm on request; readOnly passes through', () => {
    render(
      <Combobox.Root label="Fruit">
        <Combobox.Input placeholder="md" />
        <Combobox.Input placeholder="sm" size="sm" readOnly />
      </Combobox.Root>,
    );
    expect(screen.getByPlaceholderText('md')).toHaveClass('h-control-md', 'text-body-md');
    expect(screen.getByPlaceholderText('sm')).toHaveClass('h-control-sm', 'text-body-sm');
    expect(screen.getByPlaceholderText('sm')).toHaveAttribute('readonly');
  });
});

describe('Combobox server HTML (10.5)', () => {
  it('Empty is hidden by CSS while the list has options (cmdk counts them only after mount)', () => {
    render(
      <Combobox.Root label="Fruit">
        <Combobox.List>
          <Combobox.Empty>None</Combobox.Empty>
          <Combobox.Item value="a">Apple</Combobox.Item>
        </Combobox.List>
      </Combobox.Root>,
    );
    expect(screen.getByRole('listbox')).toHaveClass('[&:has([cmdk-item])_[cmdk-empty]]:hidden');
  });
});
