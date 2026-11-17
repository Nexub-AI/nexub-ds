import * as React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { Sidebar } from './Sidebar.js';

describe('Sidebar', () => {
  it('Footer stays pinned to the bottom of the scrolling sidebar', () => {
    render(
      <Sidebar.Root>
        <Sidebar.Footer>v1.2.0</Sidebar.Footer>
      </Sidebar.Root>,
    );
    const footer = screen.getByText('v1.2.0');
    expect(screen.getByRole('navigation')).toContainElement(footer);
    expect(footer).toHaveClass('sticky', 'bottom-0', 'bg-[var(--color-surface-container-low)]', 'border-t');
  });

  it('renders a labelled navigation landmark', () => {
    render(<Sidebar.Root />);
    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toBeInTheDocument();
  });

  it('asChild renders the router link element with the item content', () => {
    render(
      <Sidebar.Root>
        <Sidebar.Item asChild active icon={<svg />}>
          <button type="button">Dashboard</button>
        </Sidebar.Item>
      </Sidebar.Root>,
    );
    const el = screen.getByRole('button', { name: 'Dashboard' });
    expect(el).toHaveAttribute('aria-current', 'page');
    expect(el.querySelector('svg')).toBeInTheDocument();
  });

  it('expanded items keep the native title and no tooltip', () => {
    render(
      <Sidebar.Root>
        <Sidebar.Item href="#" icon={<svg />}>Settings</Sidebar.Item>
      </Sidebar.Root>,
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('title', 'Settings');
  });

  it('collapsed items keep their accessible name and show the label in a tooltip, not a title (10.6)', async () => {
    render(
      <Sidebar.Root collapsed>
        <Sidebar.Item href="#" icon={<svg />}>Settings</Sidebar.Item>
        <Sidebar.Item href="#" icon={<svg />}><b>Rich</b></Sidebar.Item>
      </Sidebar.Root>,
    );
    // The tooltip module loads lazily; the native title is the fallback until then.
    await waitFor(() => expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('title'));
    act(() => screen.getByRole('link', { name: 'Settings' }).focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Settings');
    // A label that is not a string gets neither.
    expect(screen.getByRole('link', { name: 'Rich' })).not.toHaveAttribute('title');
  });

  describe('collapseBelow (10.6)', () => {
    const original = window.matchMedia;
    afterEach(() => {
      window.matchMedia = original;
    });
    // jsdom has no layout: answer the media query by hand.
    const mockViewport = (narrow: boolean) => {
      const queries: string[] = [];
      window.matchMedia = ((query: string) => {
        queries.push(query);
        return { matches: narrow, media: query, addEventListener() {}, removeEventListener() {} };
      }) as unknown as typeof window.matchMedia;
      return queries;
    };

    it('collapses below the breakpoint and marks the breakpoint for the CSS width', () => {
      const queries = mockViewport(true);
      render(<Sidebar.Root collapseBelow="lg" />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-collapsed', 'true');
      expect(nav).toHaveAttribute('data-collapse-below', 'lg');
      expect(queries).toContain('(max-width: 63.99rem)');
    });

    it('stays expanded above the breakpoint', () => {
      mockViewport(false);
      render(<Sidebar.Root collapseBelow="md" />);
      expect(screen.getByRole('navigation')).toHaveAttribute('data-collapsed', 'false');
    });

    it('controlled collapsed always wins', () => {
      mockViewport(true);
      render(<Sidebar.Root collapseBelow="md" collapsed={false} />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-collapsed', 'false');
      expect(nav).not.toHaveAttribute('data-collapse-below');
    });

    it('without the prop nothing changes', () => {
      mockViewport(true);
      render(<Sidebar.Root />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-collapsed', 'false');
      expect(nav).not.toHaveAttribute('data-collapse-below');
    });
  });

  it('renders group with label', () => {
    render(
      <Sidebar.Root>
        <Sidebar.Group label="Navigation">
          <Sidebar.Item href="#">Home</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>,
    );
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders item with href', () => {
    render(<Sidebar.Item href="/dashboard">Dashboard</Sidebar.Item>);
    const link = screen.getByRole('link', { name: /dashboard/i });
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('active item has aria-current="page"', () => {
    render(<Sidebar.Item href="/" active>Home</Sidebar.Item>);
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('collapsed prop adds data-collapsed attribute', () => {
    render(<Sidebar.Root collapsed data-testid="sidebar" />);
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-collapsed', 'true');
  });

  it('forwards className on Root', () => {
    render(<Sidebar.Root className="custom-class" data-testid="sidebar" />);
    expect(screen.getByTestId('sidebar')).toHaveClass('custom-class');
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Sidebar.Root ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('Sidebar.Header', () => {
  it('renders the logo and a trailing status that can wrap under it', () => {
    render(
      <Sidebar.Root>
        <Sidebar.Header status={<span>Live</span>}>
          <span>LOGO</span>
        </Sidebar.Header>
      </Sidebar.Root>,
    );
    const header = screen.getByText('LOGO').parentElement!.parentElement!;
    expect(header).toHaveClass('flex-wrap');
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('keeps the status announced when collapsed', () => {
    render(
      <Sidebar.Root collapsed>
        <Sidebar.Header status={<span>Live</span>}>
          <span>LOGO</span>
        </Sidebar.Header>
      </Sidebar.Root>,
    );
    expect(screen.getByText('Live').parentElement).toHaveClass('group-data-[collapsed=true]/sidebar:sr-only');
  });
});

describe('Sidebar 10.3', () => {
  it('accent scopes the sidebar to an app or division; items carry the styling hook', () => {
    const { rerender } = render(
      <Sidebar.Root accent="payub">
        <Sidebar.Item active href="/a">Home</Sidebar.Item>
      </Sidebar.Root>,
    );
    expect(screen.getByRole('navigation')).toHaveAttribute('data-product', 'payub');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-nx', 'nav-item');
    rerender(<Sidebar.Root accent="fintech" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-division', 'fintech');
  });

  it('positions the (decorative) marker on the active item', () => {
    render(
      <Sidebar.Root>
        <Sidebar.Item href="/a">Home</Sidebar.Item>
        <Sidebar.Item active href="/b">Reports</Sidebar.Item>
      </Sidebar.Root>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.style.getPropertyValue('--nx-ind-o')).toBe('1');
    const marker = nav.querySelector('.nx-nav-marker')!;
    expect(marker).toHaveAttribute('aria-hidden', 'true');
  });
});
