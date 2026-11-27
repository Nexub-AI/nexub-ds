import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NexubProvider } from '@nexub/react';
import { DateSeparator } from './DateSeparator.js';

const now = new Date(2026, 10, 27, 15, 30);

describe('DateSeparator', () => {
  it('says Today and Yesterday', () => {
    const { rerender } = render(<DateSeparator date={new Date(2026, 10, 27, 0, 5)} now={now} />);
    expect(screen.getByText('Today')).toBeInTheDocument();
    rerender(<DateSeparator date={new Date(2026, 10, 26, 23, 59)} now={now} />);
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
  });

  it('formats older days as a medium date in the provider locale', () => {
    render(
      <NexubProvider locale="en-GB">
        <DateSeparator date="2026-11-25" now={now} />
      </NexubProvider>,
    );
    const time = screen.getByText('25 Nov 2026');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2026-11-25');
  });

  it('accepts a timestamp, a locale prop and message overrides', () => {
    const { rerender } = render(<DateSeparator date={new Date(2026, 0, 2).getTime()} now={now} locale="en-GB" />);
    expect(screen.getByText('2 Jan 2026')).toBeInTheDocument();
    rerender(<DateSeparator date={now} now={now} messages={{ today: 'Heute' }} />);
    expect(screen.getByText('Heute')).toBeInTheDocument();
  });

  it('takes Today / Yesterday from the provider', () => {
    render(
      <NexubProvider messages={{ yesterday: 'Hier' }}>
        <DateSeparator date={new Date(2026, 10, 26)} now={now} />
      </NexubProvider>,
    );
    expect(screen.getByText('Hier')).toBeInTheDocument();
  });

  it('children override the label', () => {
    render(
      <DateSeparator date={now} now={now}>
        Earlier today
      </DateSeparator>,
    );
    expect(screen.getByText('Earlier today')).toBeInTheDocument();
    expect(screen.queryByText('Today')).toBeNull();
  });

  it('is plain text with hidden hairlines (read in order, not as a bare "separator")', () => {
    const { container } = render(<DateSeparator date={now} now={now} />);
    expect(screen.queryByRole('separator')).toBeNull();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
    expect(container.firstElementChild).toHaveTextContent(/^Today$/);
  });

  it('renders no style attribute (strict CSP)', () => {
    expect(renderToString(<DateSeparator date={now} now={now} />)).not.toContain('style="');
  });
});
