import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { ActivityFeed } from './ActivityFeed.js';

describe('ActivityFeed', () => {
  it('renders with role="feed"', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Something happened" />
      </ActivityFeed.Root>,
    );
    expect(screen.getByRole('feed')).toBeDefined();
  });

  it('renders with aria-label "Activity feed"', () => {
    render(<ActivityFeed.Root />);
    expect(screen.getByRole('feed').getAttribute('aria-label')).toBe('Activity feed');
  });

  it('renders item title', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="User signed in" />
      </ActivityFeed.Root>,
    );
    expect(screen.getByText('User signed in')).toBeDefined();
  });

  it('renders item description when provided', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Deployment" description="Deployed to production" />
      </ActivityFeed.Root>,
    );
    expect(screen.getByText('Deployed to production')).toBeDefined();
  });

  it('does not render description element when omitted', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="No description" />
      </ActivityFeed.Root>,
    );
    expect(screen.queryByText('Deployed to production')).toBeNull();
  });

  it('renders timestamp when provided', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Event" timestamp="2h ago" />
      </ActivityFeed.Root>,
    );
    expect(screen.getByText('2h ago')).toBeDefined();
  });

  it('does not render time element when timestamp is omitted', () => {
    const { container } = render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="No time" />
      </ActivityFeed.Root>,
    );
    expect(container.querySelector('time')).toBeNull();
  });

  it('renders avatar slot when provided', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item
          title="Avatar test"
          avatar={<span data-testid="feed-avatar">AV</span>}
        />
      </ActivityFeed.Root>,
    );
    expect(screen.getByTestId('feed-avatar')).toBeDefined();
  });

  it('does not render avatar wrapper when avatar is omitted', () => {
    const { container } = render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="No avatar" />
      </ActivityFeed.Root>,
    );
    // Only the content div should be a direct flex child of the li
    const li = container.querySelector('li')!;
    expect(li.querySelectorAll('.shrink-0').length).toBe(0);
  });

  it('forwards className to Root', () => {
    const { container } = render(
      <ActivityFeed.Root className="custom-feed" />,
    );
    expect(container.firstElementChild?.classList.contains('custom-feed')).toBe(true);
  });

  it('forwards ref to Root ul element', () => {
    const ref = React.createRef<HTMLUListElement>();
    render(<ActivityFeed.Root ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('UL');
  });

  it('renders multiple items', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="First" />
        <ActivityFeed.Item title="Second" />
        <ActivityFeed.Item title="Third" />
      </ActivityFeed.Root>,
    );
    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Second')).toBeDefined();
    expect(screen.getByText('Third')).toBeDefined();
  });
});
