import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Collapsible } from './Collapsible.js';

function TestCollapsible({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen}>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>
        <p>Hidden content</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

describe('Collapsible', () => {
  it('renders the trigger', () => {
    render(<TestCollapsible />);
    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
  });

  it('content is hidden by default', () => {
    render(<TestCollapsible />);
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('clicking trigger shows content', async () => {
    const user = userEvent.setup();
    render(<TestCollapsible />);

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Hidden content')).toBeVisible();
  });

  it('clicking trigger again hides content', async () => {
    const user = userEvent.setup();
    render(<TestCollapsible defaultOpen />);

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('forwards className on Root', () => {
    render(
      <Collapsible.Root className="custom-collapsible">
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    expect(document.querySelector('.custom-collapsible')).toBeInTheDocument();
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Collapsible.Root ref={ref}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
