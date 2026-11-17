import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Popover } from './Popover.js';

function TestPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <p>Popover content</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

describe('Popover', () => {
  it('renders trigger', () => {
    render(<TestPopover />);
    expect(screen.getByText('Open Popover')).toBeInTheDocument();
  });

  it('opens popover content on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    await user.click(screen.getByText('Open Popover'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('closes popover on trigger click when open', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByText('Open Popover'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await user.click(screen.getByText('Open Popover'));
    await waitFor(() => {
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });
  });

  it('closes popover on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestPopover />);

    await user.click(screen.getByText('Open Popover'));
    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });
  });

  it('forwards ref on Content', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content ref={ref}>
            <p>Content</p>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>,
    );

    await user.click(screen.getByText('Open'));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Popover sheet (10.6)', () => {
  const sheetAttr = () => document.querySelector('[data-nx-sheet]')?.getAttribute('data-nx-sheet') ?? null;
  const Menu = ({ sheet }: { sheet?: boolean | 'auto' }) => (
    <Popover.Root>
      <Popover.Trigger>Sheet trigger</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sheet={sheet} aria-label="Sheet">
          <p>Sheet item</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );

  it('sheet={false} keeps the popover (11.0)', async () => {
    render(<Menu sheet={false} />);
    await userEvent.setup().click(screen.getByText('Sheet trigger'));
    expect(await screen.findByText('Sheet item')).toBeInTheDocument();
    expect(sheetAttr()).toBeNull();
  });

  it('marks the content with data-nx-sheet="auto" by default (11.0), and still opens and closes', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Menu />);
    await user.click(screen.getByText('Sheet trigger'));
    expect(await screen.findByText('Sheet item')).toBeInTheDocument();
    expect(sheetAttr()).toBe('auto');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Sheet item')).not.toBeInTheDocument());
    unmount();

    render(<Menu sheet="auto" />);
    await user.click(screen.getByText('Sheet trigger'));
    expect((await screen.findByText('Sheet item')).closest('[data-nx-sheet]')).toHaveAttribute('data-nx-sheet', 'auto');
  });
});
