import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Dialog } from './Dialog.js';

function TestDialog({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog.Root onOpenChange={onOpenChange}>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Description>Dialog description text.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('renders trigger button', () => {
    render(<TestDialog />);
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens dialog on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  it('closes dialog when Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes dialog on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('calls onOpenChange when dialog opens and closes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestDialog onOpenChange={onOpenChange} />);

    await user.click(screen.getByText('Open Dialog'));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('renders title text', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  it('forwards ref on Content', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content ref={ref}>
            <Dialog.Title>Test</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    await user.click(screen.getByText('Open'));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('activates the glass material on Content with surface="glass"', async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content surface="glass">
            <Dialog.Title>Test</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    await user.click(screen.getByText('Open'));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-material', 'glass');
    expect(dialog).toHaveClass('bg-[var(--glass-bg)]');
  });
});

describe('Dialog scrollLock', () => {
  function Locked({ scrollLock }: { scrollLock?: 'style' | 'class' }) {
    return (
      <Dialog.Root defaultOpen scrollLock={scrollLock}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content aria-describedby={undefined}>
            <Dialog.Title>Locked</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  it('"class" (default since 8.0) locks with a class on <html> and injects no <style>', () => {
    const { unmount } = render(<Locked />);
    expect(document.documentElement).toHaveClass('nexub-scroll-lock');
    expect(document.head.querySelectorAll('style')).toHaveLength(0);
    unmount();
    expect(document.documentElement).not.toHaveClass('nexub-scroll-lock');
  });

  it('"style" keeps Radix\'s scroll lock', () => {
    render(<Locked scrollLock="style" />);
    expect(document.documentElement).not.toHaveClass('nexub-scroll-lock');
  });
});

describe('Dialog 7.6 surfaces', () => {
  it('showClose adds a labelled close button that closes the dialog', async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Content showClose aria-describedby={undefined}>
            <Dialog.Title>T</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('has no close button by default; closeLabel overrides the label', () => {
    const { rerender } = render(
      <Dialog.Root open>
        <Dialog.Content aria-describedby={undefined}><Dialog.Title>T</Dialog.Title></Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(
      <Dialog.Root open>
        <Dialog.Content showClose closeLabel="Dismiss" aria-describedby={undefined}><Dialog.Title>T</Dialog.Title></Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('sheet renders bottom-anchored; Body renders between Header and Footer', () => {
    render(
      <Dialog.Root open>
        <Dialog.Content sheet aria-describedby={undefined}>
          <Dialog.Header><Dialog.Title>T</Dialog.Title></Dialog.Header>
          <Dialog.Body>Body text</Dialog.Body>
          <Dialog.Footer>F</Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-sheet');
    expect(dialog.className).toContain('bottom-0');
    expect(screen.getByText('Body text')).toHaveClass('nx-dialog-body');
  });

  it('sheet="auto" stays centred on wide screens', () => {
    render(
      <Dialog.Root open>
        <Dialog.Content sheet="auto" aria-describedby={undefined}><Dialog.Title>T</Dialog.Title></Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('data-sheet');
  });

  it('marks the parent data-nested while a child dialog is open', async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root open>
        <Dialog.Content aria-describedby={undefined} data-testid="parent">
          <Dialog.Title>Parent</Dialog.Title>
          <Dialog.Root>
            <Dialog.Trigger>Open child</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content aria-describedby={undefined} data-testid="child">
                <Dialog.Title>Child</Dialog.Title>
                <Dialog.Close>Done</Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByTestId('parent')).not.toHaveAttribute('data-nested');
    await user.click(screen.getByText('Open child'));
    expect(screen.getByTestId('parent')).toHaveAttribute('data-nested');
    expect(screen.getByTestId('child')).not.toHaveAttribute('data-nested');
    await user.click(screen.getByText('Done'));
    await waitFor(() => expect(screen.getByTestId('parent')).not.toHaveAttribute('data-nested'));
  });
});
