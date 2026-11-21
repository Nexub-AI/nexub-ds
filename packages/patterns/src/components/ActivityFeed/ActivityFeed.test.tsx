import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { ActivityFeed } from './ActivityFeed.js';

describe('ActivityFeed', () => {
  it('renders as a list', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Something happened" />
      </ActivityFeed.Root>,
    );
    expect(screen.getByRole('list')).toBeDefined();
  });

  it('renders with aria-label "Activity feed"', () => {
    render(<ActivityFeed.Root />);
    expect(screen.getByRole('list').getAttribute('aria-label')).toBe('Activity feed');
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

describe('ActivityFeed 11.5', () => {
  afterEach(() => vi.useRealTimers());

  it('a Date timestamp renders <time dateTime> with relative text and a full-date tooltip', async () => {
    vi.useFakeTimers({ now: new Date('2026-11-21T12:00:00Z'), toFake: ['Date'] });
    const when = new Date('2026-11-21T11:55:00Z');
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Edited" timestamp={when} />
        <ActivityFeed.Item title="Created" timestamp={new Date('2026-11-01T09:00:00Z')} />
      </ActivityFeed.Root>,
    );
    const time = screen.getByText('5 minutes ago');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', when.toISOString());
    expect(screen.getByText('Nov 1')).toBeInTheDocument();
    vi.useRealTimers();
    time.focus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(/Saturday, November 21, 2026/);
  });

  it('title and description render block content (no <p>)', () => {
    const { container } = render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title={<div>Block title</div>} description={<ul><li>one</li></ul>} />
      </ActivityFeed.Root>,
    );
    expect(container.querySelector('p')).toBeNull();
    expect(screen.getByText('Block title')).toBeInTheDocument();
  });

  it('actions slot and tone marker', () => {
    const { container } = render(
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Failed" tone="danger" actions={<button type="button">Retry</button>} />
      </ActivityFeed.Root>,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(container.querySelector('li')).toHaveAttribute('data-tone', 'danger');
    expect(container.querySelector('.bg-\\[var\\(--color-error\\)\\]')).not.toBeNull();
  });

  it('Group names a nested list with its header', () => {
    render(
      <ActivityFeed.Root>
        <ActivityFeed.Group label="Today" headingLevel={3}>
          <ActivityFeed.Item title="A" />
        </ActivityFeed.Group>
        <ActivityFeed.Group label="Yesterday">
          <ActivityFeed.Item title="B" />
        </ActivityFeed.Group>
      </ActivityFeed.Root>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Today' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Today' })).toContainElement(screen.getByText('A'));
    expect(screen.getByRole('list', { name: 'Yesterday' })).toContainElement(screen.getByText('B'));
  });
});
