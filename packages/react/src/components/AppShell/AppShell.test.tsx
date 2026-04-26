import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppShell } from './AppShell.js';

describe('AppShell', () => {
  it('renders root element', () => {
    render(<AppShell.Root data-testid="root" />);
    expect(screen.getByTestId('root')).toBeInTheDocument();
  });

  it('renders header slot', () => {
    render(
      <AppShell.Root>
        <AppShell.Header data-testid="header">Header content</AppShell.Header>
      </AppShell.Root>,
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('renders sidebar slot', () => {
    render(
      <AppShell.Root>
        <AppShell.Body>
          <AppShell.Sidebar data-testid="sidebar">Sidebar content</AppShell.Sidebar>
        </AppShell.Body>
      </AppShell.Root>,
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Sidebar content')).toBeInTheDocument();
  });

  it('renders main slot', () => {
    render(
      <AppShell.Root>
        <AppShell.Body>
          <AppShell.Main data-testid="main">Page content</AppShell.Main>
        </AppShell.Body>
      </AppShell.Root>,
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('forwards className on Root', () => {
    render(<AppShell.Root className="custom-class" data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass('custom-class');
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AppShell.Root ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
