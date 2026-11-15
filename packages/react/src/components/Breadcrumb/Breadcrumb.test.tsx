import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './Breadcrumb.js';

describe('Breadcrumb', () => {
  it('renders nav with aria-label="breadcrumb"', () => {
    render(<Breadcrumb.Root />);
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
  });

  it('renders items inside list', () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('Link renders an anchor element', () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/home">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('forwards className to Root', () => {
    render(<Breadcrumb.Root className="custom-root" data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass('custom-root');
  });

  it('forwards ref to Root', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Breadcrumb.Root ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('NAV');
  });

  it('Page has aria-current="page"', () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Settings</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    expect(screen.getByText('Settings')).toHaveAttribute('aria-current', 'page');
  });

  it('Trail collapses long paths into a More menu', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const items = ['Home', 'Org', 'Team', 'Project', 'Settings', 'Billing'].map((l) => ({ label: l, href: `/${l}` }));
    render(<Breadcrumb.Trail items={items} maxItems={3} />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Billing')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Team' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual(['Org', 'Team', 'Project']);
  });

  it('Trail shows everything when it fits', () => {
    render(<Breadcrumb.Trail items={[{ label: 'Home', href: '/' }, { label: 'Docs' }]} />);
    expect(screen.queryByRole('button', { name: 'More' })).toBeNull();
    expect(screen.getByText('Docs')).toHaveAttribute('aria-current', 'page');
  });
});
