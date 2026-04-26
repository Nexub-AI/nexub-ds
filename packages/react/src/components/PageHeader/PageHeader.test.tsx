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
});
