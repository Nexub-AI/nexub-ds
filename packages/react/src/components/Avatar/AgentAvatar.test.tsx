import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AgentAvatar } from './AgentAvatar.js';
import { Avatar } from './Avatar.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

const sizeClasses = (el: Element) => el.className.split(' ').filter((c) => /^(h|w)-\d/.test(c)).sort();

describe('AgentAvatar (12.2)', () => {
  it('uses exactly the Avatar size scale', () => {
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
      const { container, unmount } = render(
        <>
          <Avatar name="Ada" size={size} />
          <AgentAvatar name="Payhub agent" size={size} />
        </>,
      );
      const [person, agent] = Array.from(container.children);
      expect(sizeClasses(agent!)).toEqual(sizeClasses(person!));
      unmount();
    }
  });

  it('defaults to md, like Avatar', () => {
    render(<AgentAvatar name="Payhub agent" />);
    expect(screen.getByRole('img')).toHaveClass('h-10', 'w-10');
  });

  it('names itself as an AI agent', () => {
    render(<AgentAvatar name="Payhub agent" />);
    expect(screen.getByRole('img', { name: 'Payhub agent, AI agent' })).toBeInTheDocument();
  });

  it('is still named without a name', () => {
    render(<AgentAvatar />);
    expect(screen.getByRole('img', { name: 'AI agent' })).toBeInTheDocument();
  });

  it('takes the label from messages', () => {
    render(
      <NexubProvider messages={{ aiAgent: (n: string) => `${n} (IA)` }}>
        <AgentAvatar name="Payhub" />
      </NexubProvider>,
    );
    expect(screen.getByRole('img', { name: 'Payhub (IA)' })).toBeInTheDocument();
  });

  it('an explicit aria-label wins', () => {
    render(<AgentAvatar name="Payhub agent" aria-label="Payhub assistant (AI)" />);
    expect(screen.getByRole('img', { name: 'Payhub assistant (AI)' })).toBeInTheDocument();
  });

  it('is a rounded square, not a circle', () => {
    render(<AgentAvatar name="Payhub agent" />);
    expect(screen.getByRole('img')).toHaveClass('[--avatar-radius:22.5%]');
  });

  it('draws the icon, hidden from screen readers', () => {
    render(<AgentAvatar name="Payhub agent" icon={<svg data-testid="glyph" />} />);
    expect(screen.getByTestId('glyph').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows src and falls back to the icon when it fails', () => {
    const { container } = render(<AgentAvatar name="Payhub agent" src="/payhub.svg" icon={<svg data-testid="glyph" />} />);
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('alt', '');
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByTestId('glyph')).toBeInTheDocument();
  });

  it('puts the AI mark at the bottom inline-end corner (logical, so it flips in RTL)', () => {
    const { container } = render(
      <div dir="rtl">
        <AgentAvatar name="Payhub agent" size="lg" />
      </div>,
    );
    const mark = container.querySelector('[data-agent-mark]')!;
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(mark.className).toMatch(/-end-1/);
    expect(mark.className).toMatch(/-bottom-1/);
    expect(mark.className).not.toMatch(/\b-?(left|right)-/);
  });

  it('scales the mark per size', () => {
    const mark = (size: 'xs' | 'xl') => {
      const { container, unmount } = render(<AgentAvatar name="A" size={size} />);
      const cls = container.querySelector('[data-agent-mark]')!.className;
      unmount();
      return cls;
    };
    expect(mark('xs')).toContain('h-2.5');
    expect(mark('xl')).toContain('h-5');
    // the surface ring keeps both its width and its colour
    expect(mark('xs').split(' ')).toEqual(expect.arrayContaining(['ring-2', 'ring-[var(--color-surface)]']));
  });

  it('takes a category colour', () => {
    render(<AgentAvatar name="Payhub agent" category="emerald" />);
    const el = screen.getByRole('img');
    expect(el).toHaveAttribute('data-category', 'emerald');
    expect(el.className).toContain('bg-[var(--nx-cat-container)]');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<AgentAvatar ref={ref} name="A" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
