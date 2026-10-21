import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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

  it('keeps an accessible name and tooltip when collapsed', () => {
    render(
      <Sidebar.Root collapsed>
        <Sidebar.Item href="#" icon={<svg />}>Settings</Sidebar.Item>
      </Sidebar.Root>,
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('title', 'Settings');
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
