import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

describe('Sheet scroll lock', () => {
  const styleTags = () => document.querySelectorAll('style').length;

  function Example({ scrollLock }: { scrollLock?: 'style' | 'class' }) {
    const [open, setOpen] = React.useState(false);
    return (
      <Sheet.Root open={open} onOpenChange={setOpen} scrollLock={scrollLock}>
        <Sheet.Trigger>Open</Sheet.Trigger>
        <Sheet.Portal>
          <Sheet.Overlay />
          <Sheet.Content>
            <Sheet.Title>Menu</Sheet.Title>
            <Sheet.Description>Sections</Sheet.Description>
            <Sheet.Close>Close</Sheet.Close>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
    );
  }

  it('by default locks scroll with an injected <style> (Radix)', () => {
    const before = styleTags();
    render(<Example />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(styleTags()).toBeGreaterThan(before);
  });

  it('scrollLock="class" injects no <style> and locks with a class on <html>', async () => {
    const before = styleTags();
    const { unmount } = render(<Example scrollLock="class" />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(styleTags()).toBe(before);
    expect(document.documentElement).toHaveClass('nexub-scroll-lock');
    const overlay = document.querySelector('[data-vaul-overlay]');
    expect(overlay).toHaveAttribute('data-state', 'open');
    fireEvent.click(screen.getByText('Close'));
    // jsdom never fires the exit animation's animationend, so the overlay stays
    // mounted (closed); the lock is released when it unmounts.
    await waitFor(() => expect(overlay).toHaveAttribute('data-state', 'closed'));
    unmount();
    expect(document.documentElement).not.toHaveClass('nexub-scroll-lock');
  });
});
