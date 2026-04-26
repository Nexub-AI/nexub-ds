import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { UserCard } from './UserCard.js';

describe('UserCard', () => {
  it('renders the name', () => {
    render(<UserCard name="Alice Smith" />);
    expect(screen.getByText('Alice Smith')).toBeDefined();
  });

  it('renders role when provided', () => {
    render(<UserCard name="Bob" role="Engineer" />);
    expect(screen.getByText('Engineer')).toBeDefined();
  });

  it('does not render role element when omitted', () => {
    render(<UserCard name="Carol" />);
    expect(screen.queryByText('Engineer')).toBeNull();
  });

  it('renders email when provided', () => {
    render(<UserCard name="Dave" email="dave@example.com" />);
    expect(screen.getByText('dave@example.com')).toBeDefined();
  });

  it('does not render email element when omitted', () => {
    render(<UserCard name="Eve" />);
    expect(screen.queryByText('dave@example.com')).toBeNull();
  });

  it('renders actions when provided', () => {
    render(
      <UserCard
        name="Frank"
        actions={<button data-testid="action-btn">Edit</button>}
      />,
    );
    expect(screen.getByTestId('action-btn')).toBeDefined();
  });

  it('does not render actions container when omitted', () => {
    const { container } = render(<UserCard name="Grace" />);
    // No actions wrapper rendered — the outer flex div should have 2 children max (avatar + text)
    const root = container.firstElementChild;
    expect(root).not.toBeNull();
    // actions div should not exist
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });

  it('forwards className to root element', () => {
    const { container } = render(<UserCard name="Heidi" className="custom-user-card" />);
    expect(container.firstElementChild?.classList.contains('custom-user-card')).toBe(true);
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<UserCard name="Ivan" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('renders all sizes without error', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<UserCard name="Judy" size={size} />);
      expect(screen.getByText('Judy')).toBeDefined();
      unmount();
    }
  });
});
