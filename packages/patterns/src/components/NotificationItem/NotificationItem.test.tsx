import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { NotificationItem } from './NotificationItem.js';

describe('NotificationItem', () => {
  it('renders the title', () => {
    render(<NotificationItem title="New message" />);
    expect(screen.getByText('New message')).toBeDefined();
  });

  it('renders description when provided', () => {
    render(<NotificationItem title="Alert" description="You have a new alert" />);
    expect(screen.getByText('You have a new alert')).toBeDefined();
  });

  it('does not render description element when omitted', () => {
    render(<NotificationItem title="No desc" />);
    expect(screen.queryByText('You have a new alert')).toBeNull();
  });

  it('renders timestamp when provided', () => {
    render(<NotificationItem title="Event" timestamp="5 min ago" />);
    expect(screen.getByText('5 min ago')).toBeDefined();
  });

  it('does not render time element when timestamp is omitted', () => {
    const { container } = render(<NotificationItem title="No time" />);
    expect(container.querySelector('time')).toBeNull();
  });

  it('renders unread dot when read=false (default)', () => {
    render(<NotificationItem title="Unread" />);
    expect(screen.getByLabelText('Unread')).toBeDefined();
  });

  it('renders unread dot when read is explicitly false', () => {
    render(<NotificationItem title="Unread explicit" read={false} />);
    expect(screen.getByLabelText('Unread')).toBeDefined();
  });

  it('does not render unread dot when read=true', () => {
    render(<NotificationItem title="Read notification" read={true} />);
    expect(screen.queryByLabelText('Unread')).toBeNull();
  });

  it('renders icon when provided', () => {
    render(
      <NotificationItem
        title="Icon test"
        icon={<span data-testid="notif-icon">icon</span>}
      />,
    );
    expect(screen.getByTestId('notif-icon')).toBeDefined();
  });

  it('does not render icon wrapper when icon is omitted', () => {
    const { container } = render(<NotificationItem title="No icon" />);
    // Without icon, there's no .shrink-0.mt-0.5 div for icon
    // The unread dot also uses shrink-0 but is a span, not div
    const iconDivs = Array.from(container.querySelectorAll('div.shrink-0'));
    expect(iconDivs.length).toBe(0);
  });

  it('renders dismiss button when onDismiss is provided', () => {
    const onDismiss = vi.fn();
    render(<NotificationItem title="Dismiss me" onDismiss={onDismiss} />);
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeDefined();
  });

  it('does not render dismiss button when onDismiss is omitted', () => {
    render(<NotificationItem title="No dismiss" />);
    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).toBeNull();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const onDismiss = vi.fn();
    render(<NotificationItem title="Clickable" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('forwards className to root element', () => {
    const { container } = render(
      <NotificationItem title="Styled" className="custom-notif" />,
    );
    expect(container.firstElementChild?.classList.contains('custom-notif')).toBe(true);
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<NotificationItem title="Ref test" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('renders all parts together', () => {
    render(
      <NotificationItem
        title="Full notification"
        description="With all props"
        timestamp="now"
        read={false}
        icon={<span data-testid="icon">i</span>}
        onDismiss={() => {}}
      />,
    );
    expect(screen.getByText('Full notification')).toBeDefined();
    expect(screen.getByText('With all props')).toBeDefined();
    expect(screen.getByText('now')).toBeDefined();
    expect(screen.getByLabelText('Unread')).toBeDefined();
    expect(screen.getByTestId('icon')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeDefined();
  });
});
