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
