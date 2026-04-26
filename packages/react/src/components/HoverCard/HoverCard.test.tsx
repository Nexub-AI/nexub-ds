import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { HoverCard } from './HoverCard.js';

function TestHoverCard() {
  return (
    <HoverCard.Root openDelay={0} closeDelay={0}>
      <HoverCard.Trigger asChild>
        <a href="#">Hover target</a>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <p>Hover card content</p>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

describe('HoverCard', () => {
  it('renders trigger element', () => {
    render(<TestHoverCard />);
    expect(screen.getByText('Hover target')).toBeInTheDocument();
  });

  it('shows content on hover', async () => {
    const user = userEvent.setup();
    render(<TestHoverCard />);

    expect(screen.queryByText('Hover card content')).not.toBeInTheDocument();
    await user.hover(screen.getByText('Hover target'));

    await waitFor(() => {
      expect(screen.getByText('Hover card content')).toBeInTheDocument();
    });
  });

  it('hides content after pointer leaves', async () => {
    const user = userEvent.setup();
    render(<TestHoverCard />);

    await user.hover(screen.getByText('Hover target'));
    await waitFor(() => {
      expect(screen.getByText('Hover card content')).toBeInTheDocument();
    });

    await user.unhover(screen.getByText('Hover target'));
    await waitFor(() => {
      expect(screen.queryByText('Hover card content')).not.toBeInTheDocument();
    });
  });

  it('forwards ref on Content', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLDivElement>();

    render(
      <HoverCard.Root openDelay={0}>
        <HoverCard.Trigger asChild>
          <a href="#">Hover</a>
        </HoverCard.Trigger>
        <HoverCard.Content ref={ref}>
          <p>Content</p>
        </HoverCard.Content>
      </HoverCard.Root>,
    );

    await user.hover(screen.getByText('Hover'));
    await waitFor(() => {
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
