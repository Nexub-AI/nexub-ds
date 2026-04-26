import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { InfoList } from './InfoList.js';

describe('InfoList', () => {
  it('renders a dl element for Root', () => {
    const { container } = render(
      <InfoList.Root>
        <InfoList.Item label="Name" value="Alice" />
      </InfoList.Root>,
    );
    expect(container.querySelector('dl')).not.toBeNull();
  });

  it('renders label in a dt element', () => {
    render(
      <InfoList.Root>
        <InfoList.Item label="Email" value="alice@example.com" />
      </InfoList.Root>,
    );
    const dt = screen.getByText('Email').closest('dt');
    expect(dt).not.toBeNull();
  });

  it('renders value in a dd element', () => {
    render(
      <InfoList.Root>
        <InfoList.Item label="Plan" value="Pro" />
      </InfoList.Root>,
    );
    const dd = screen.getByText('Pro').closest('dd');
    expect(dd).not.toBeNull();
  });

  it('renders multiple label/value pairs', () => {
    render(
      <InfoList.Root>
        <InfoList.Item label="First" value="Value 1" />
        <InfoList.Item label="Second" value="Value 2" />
        <InfoList.Item label="Third" value="Value 3" />
      </InfoList.Root>,
    );
    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Value 1')).toBeDefined();
    expect(screen.getByText('Second')).toBeDefined();
    expect(screen.getByText('Value 2')).toBeDefined();
    expect(screen.getByText('Third')).toBeDefined();
    expect(screen.getByText('Value 3')).toBeDefined();
  });

  it('renders ReactNode values (e.g. a badge)', () => {
    render(
      <InfoList.Root>
        <InfoList.Item label="Status" value={<span data-testid="badge">Active</span>} />
      </InfoList.Root>,
    );
    expect(screen.getByTestId('badge')).toBeDefined();
  });

  it('forwards className to Root dl element', () => {
    const { container } = render(
      <InfoList.Root className="custom-list">
        <InfoList.Item label="X" value="Y" />
      </InfoList.Root>,
    );
    expect(container.querySelector('dl')?.classList.contains('custom-list')).toBe(true);
  });

  it('forwards ref to Root dl element', () => {
    const ref = React.createRef<HTMLDListElement>();
    render(
      <InfoList.Root ref={ref}>
        <InfoList.Item label="Ref" value="test" />
      </InfoList.Root>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DL');
  });

  it('forwards className to Item wrapper div', () => {
    const { container } = render(
      <InfoList.Root>
        <InfoList.Item label="Key" value="Val" className="item-class" />
      </InfoList.Root>,
    );
    const itemDiv = container.querySelector('.item-class');
    expect(itemDiv).not.toBeNull();
  });
});
