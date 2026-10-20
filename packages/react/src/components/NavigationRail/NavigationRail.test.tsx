import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavigationRail } from './NavigationRail.js';

describe('NavigationRail', () => {
  it('is a labelled nav landmark with a list of links', () => {
    render(
      <NavigationRail.Root aria-label="Workspace">
        <NavigationRail.Item href="/home" icon={<svg />} label="Home" active />
        <NavigationRail.Item href="/files" icon={<svg />} label="Files" />
      </NavigationRail.Root>,
    );
    expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Files' })).not.toHaveAttribute('aria-current');
  });

  it('renders a router link via asChild, keeping the icon and label inside it', () => {
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
      (props, ref) => <a ref={ref} data-router="" {...props} />,
    );
    render(
      <NavigationRail.Root>
        <NavigationRail.Item asChild icon={<svg data-testid="icon" />} label="Settings" active>
          <RouterLink href="/settings" />
        </NavigationRail.Item>
      </NavigationRail.Root>,
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toContainElement(screen.getByTestId('icon'));
  });
});
