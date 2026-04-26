import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ButtonGroup } from './ButtonGroup.js';

describe('ButtonGroup', () => {
  it('renders children', () => {
    render(
      <ButtonGroup>
        <button>A</button>
        <button>B</button>
      </ButtonGroup>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(
      <ButtonGroup className="custom-class">
        <button>A</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ButtonGroup ref={ref}>
        <button>A</button>
      </ButtonGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies flex-col for vertical orientation', () => {
    render(
      <ButtonGroup orientation="vertical">
        <button>A</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group')).toHaveClass('flex-col');
  });

  it('applies data-attached when attached', () => {
    render(
      <ButtonGroup attached>
        <button>A</button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group')).toHaveAttribute('data-attached');
  });
});
