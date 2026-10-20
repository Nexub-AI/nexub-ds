import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Button className="custom-class">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('loading blocks clicks without disabling (focus is kept)', () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders as child element with asChild', () => {
    render(
      <Button asChild>
        <a href="#">Link</a>
      </Button>,
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('recolors with a semantic tone', () => {
    render(<Button tone="success">Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--color-success)]');
  });

  describe('status', () => {
    it('idle buttons render no live region', () => {
      const { container } = render(<Button>Save</Button>);
      expect(container.querySelector('[role="status"]')).toBeNull();
    });

    it('announces each status through a sibling live region', () => {
      const { rerender } = render(<Button status="idle">Save</Button>);
      const region = screen.getByRole('status');
      expect(region).toHaveTextContent('');
      expect(screen.getByRole('button').contains(region)).toBe(false);
      rerender(<Button status="loading">Save</Button>);
      expect(region).toHaveTextContent('Loading');
      rerender(<Button status="success">Save</Button>);
      expect(region).toHaveTextContent('Done');
      rerender(<Button status="error" errorLabel="Could not save">Save</Button>);
      expect(region).toHaveTextContent('Could not save');
    });

    it('keeps the label in flow under the spinner (no layout shift)', () => {
      render(<Button status="loading" leadingIcon={<svg data-testid="lead" />}>Save</Button>);
      const label = screen.getByText('Save');
      expect(label).toHaveClass('contents', 'text-transparent');
      expect(screen.getByRole('button').querySelector('.animate-spin')).not.toBeNull();
    });

    it('success draws a check over the label', () => {
      render(<Button status="success">Save</Button>);
      const btn = screen.getByRole('button', { name: 'Save' });
      expect(btn.querySelector('.nx-check-draw')).not.toBeNull();
      expect(btn).not.toHaveAttribute('aria-disabled');
    });

    it('successLabel replaces the label', () => {
      render(<Button status="success" successLabel="Saved">Save</Button>);
      expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('Saved');
    });

    it('error shakes without changing tone', () => {
      const onClick = vi.fn();
      render(<Button status="error" tone="info" onClick={onClick}>Save</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toHaveClass('nx-shake', 'bg-[var(--color-info)]');
      fireEvent.click(btn);
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('asChild ignores status visuals', () => {
      render(
        <Button asChild status="loading">
          <a href="#x">Link</a>
        </Button>,
      );
      expect(screen.getByRole('link')).not.toHaveAttribute('aria-busy');
      expect(screen.queryByRole('status')).toBeNull();
    });

    it('renders no inline style (strict CSP)', () => {
      const html = renderToString(<Button status="success">Save</Button>);
      expect(html).not.toContain('style="');
    });
  });
});
