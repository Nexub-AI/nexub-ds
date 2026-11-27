import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AgentBadge } from './AgentBadge.js';

describe('AgentBadge (12.2)', () => {
  it('is a soft badge with a leading sparkle by default', () => {
    const { container } = render(<AgentBadge>AI on your own key</AgentBadge>);
    const badge = container.firstElementChild!;
    expect(badge).toHaveTextContent('AI on your own key');
    // soft neutral = container / on-container pair
    expect(badge.className).toContain('bg-[var(--color-surface-container-high)]');
    const svg = badge.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '14');
  });

  it('takes a custom icon', () => {
    render(<AgentBadge icon={<svg data-testid="bot" />}>Buttons only</AgentBadge>);
    expect(screen.getByTestId('bot')).toBeInTheDocument();
  });

  it("takes Badge's tone and size", () => {
    const { container } = render(
      <AgentBadge tone="info" size="sm">
        Buttons only
      </AgentBadge>,
    );
    const badge = container.firstElementChild!;
    expect(badge.className).toContain('bg-[var(--color-info-container)]');
    expect(badge.querySelector('svg')).toHaveAttribute('width', '12');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<AgentBadge ref={ref}>AI</AgentBadge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
