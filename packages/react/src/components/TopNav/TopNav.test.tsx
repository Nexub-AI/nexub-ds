import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TopNav } from './TopNav.js';

describe('TopNav', () => {
  it('renders header element', () => {
    render(<TopNav.Root data-testid="topnav" />);
    expect(screen.getByTestId('topnav').tagName).toBe('HEADER');
  });

  it('renders logo slot', () => {
    render(
      <TopNav.Root>
        <TopNav.Logo data-testid="logo">MyLogo</TopNav.Logo>
      </TopNav.Root>,
    );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText('MyLogo')).toBeInTheDocument();
  });

  it('renders nav menu', () => {
    render(
      <TopNav.Root>
        <TopNav.Menu data-testid="menu">
          <TopNav.Item href="/">Home</TopNav.Item>
        </TopNav.Menu>
      </TopNav.Root>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <TopNav.Root>
        <TopNav.Actions data-testid="actions">
          <button>Sign in</button>
        </TopNav.Actions>
      </TopNav.Root>,
    );
    expect(screen.getByTestId('actions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('active item has aria-current="page"', () => {
    render(<TopNav.Item href="/" active>Home</TopNav.Item>);
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('forwards className on Root', () => {
    render(<TopNav.Root className="custom-class" data-testid="topnav" />);
    expect(screen.getByTestId('topnav')).toHaveClass('custom-class');
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLElement>();
    render(<TopNav.Root ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
