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
