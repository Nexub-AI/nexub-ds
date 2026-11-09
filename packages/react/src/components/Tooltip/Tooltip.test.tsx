import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider, Tooltip } from './Tooltip.js';

function WithProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <WithProvider>
        <Tooltip label="Tooltip label">
          <button>Hover me</button>
        </Tooltip>
      </WithProvider>,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('label is not visible before hover', () => {
    render(
      <WithProvider>
        <Tooltip label="My tooltip" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      </WithProvider>,
    );
    expect(screen.queryByText('My tooltip')).not.toBeInTheDocument();
  });

  it('wraps children in a Radix tooltip trigger', () => {
    render(
      <WithProvider>
        <Tooltip label="Disappearing tip" delayDuration={0}>
          <button>Hover me</button>
        </Tooltip>
      </WithProvider>,
    );
    expect(screen.getByRole('button', { name: /hover me/i })).toBeInTheDocument();
  });

  it('accepts side prop', () => {
    render(
      <WithProvider>
        <Tooltip label="Side tooltip" side="right" delayDuration={0}>
          <button>Target</button>
        </Tooltip>
      </WithProvider>,
    );
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('accepts delayDuration prop', () => {
    render(
      <WithProvider>
        <Tooltip label="Delayed tip" delayDuration={1000}>
          <button>Target</button>
        </Tooltip>
      </WithProvider>,
    );
    expect(screen.getByText('Target')).toBeInTheDocument();
  });

  it('works without a Provider and renders rich content, shortcut and arrow', async () => {
    render(
      <Tooltip label="Save" description="Writes the draft" shortcut="⌘S" arrow delayDuration={0}>
        <button>Save</button>
      </Tooltip>,
    );
    act(() => screen.getByRole('button').focus());
    expect((await screen.findAllByText('Writes the draft')).length).toBeGreaterThan(0);
    expect(document.querySelector('kbd')).toHaveTextContent('⌘S');
    expect(document.querySelector('[data-radix-popper-content-wrapper] svg')).toBeInTheDocument();
  });
});
