import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageHeader } from './PageHeader.js';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<PageHeader title="Dashboard" description="Overview of your account" />);
    expect(screen.getByText('Overview of your account')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <PageHeader
        title="Dashboard"
        actions={<button type="button">Create</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders breadcrumb slot', () => {
    render(
      <PageHeader
        title="Dashboard"
        breadcrumb={<nav aria-label="breadcrumb">Home / Dashboard</nav>}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
  });

  it('forwards className to root div', () => {
    render(<PageHeader title="Dashboard" className="custom-header" data-testid="header" />);
    expect(screen.getByTestId('header')).toHaveClass('custom-header');
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<PageHeader title="Dashboard" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders an h1 by default', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders the heading level from `level`', () => {
    render(<PageHeader title="Billing" level={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Billing' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });
});

describe('PageHeader wash (10.3)', () => {
  it('carries the styling hook, and a padded panel only with wash', () => {
    const { container, rerender } = render(<PageHeader title="Home" />);
    const el = () => container.firstElementChild!;
    expect(el().getAttribute('data-nx')).toBe('page-header');
    expect(el().hasAttribute('data-wash')).toBe(false);
    expect(el().className).not.toContain('p-6');
    rerender(<PageHeader title="Home" wash />);
    expect(el().hasAttribute('data-wash')).toBe(true);
    expect(el().className).toContain('p-6');
  });
});

describe('PageHeader container query (10.6)', () => {
  it('is a query container, and the title row turns into a row by the header width', () => {
    const { container } = render(<PageHeader title="Home" actions={<button type="button">New</button>} />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('@container');
    expect(root.lastElementChild).toHaveClass('flex-col', '@xl:flex-row');
    expect(root.innerHTML).not.toContain('sm:flex-row');
  });
});
