import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toolbar } from './Toolbar.js';

describe('Toolbar', () => {
  it('renders the root toolbar', () => {
    render(
      <Toolbar.Root aria-label="Formatting options">
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('toolbar', { name: 'Formatting options' })).toBeInTheDocument();
  });

  it('renders toolbar buttons', () => {
    render(
      <Toolbar.Root aria-label="Actions">
        <Toolbar.Button>Save</Toolbar.Button>
        <Toolbar.Button>Cancel</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('forwards className on Root', () => {
    render(
      <Toolbar.Root aria-label="Test" className="custom-toolbar">
        <Toolbar.Button>Action</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(document.querySelector('.custom-toolbar')).toBeInTheDocument();
  });

  it('forwards className on Button', () => {
    render(
      <Toolbar.Root aria-label="Test">
        <Toolbar.Button className="custom-btn">Action</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(document.querySelector('.custom-btn')).toBeInTheDocument();
  });

  it('renders separator', () => {
    render(
      <Toolbar.Root aria-label="Test">
        <Toolbar.Button>A</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button>B</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('forwards ref on Root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Toolbar.Root ref={ref} aria-label="Test">
        <Toolbar.Button>Action</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
