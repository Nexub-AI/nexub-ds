import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from './Sidebar.js';

describe('Sidebar', () => {
  it('renders aside element', () => {
    render(<Sidebar.Root data-testid="sidebar" />);
    expect(screen.getByTestId('sidebar').tagName).toBe('ASIDE');
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
