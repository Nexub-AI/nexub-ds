import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Drawer, Sheet } from './Drawer.js';

describe('Drawer', () => {
  it('renders trigger without crashing', () => {
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open Drawer</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Drawer Title</Drawer.Title>
              <Drawer.Description>Drawer description.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer>
              <Drawer.Close>Close</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>,
    );
    expect(screen.getByText('Open Drawer')).toBeInTheDocument();
  });

  it('Drawer and Sheet are the same component', () => {
    expect(Sheet).toBe(Drawer);
  });
});

describe('Sheet', () => {
  it('is the same as Drawer', () => {
    expect(Sheet).toBe(Drawer);
  });
});

describe('Sheet side panels', () => {
  it.each(['left', 'right'] as const)('clip horizontal overflow (%s)', (side) => {
    render(
      <Sheet.Root defaultOpen direction={side}>
        <Sheet.Portal>
          <Sheet.Content side={side}>
            <Sheet.Title>Menu</Sheet.Title>
            <Sheet.Description>Sections</Sheet.Description>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('overflow-x-hidden');
  });
});
