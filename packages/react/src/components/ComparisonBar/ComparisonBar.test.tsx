import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComparisonBar } from './ComparisonBar.js';

const shares = (bar: HTMLElement) => Array.from(bar.children, (s) => Number((s as HTMLElement).style.flexGrow));
const A = (value: number) => ({ label: 'Team A', value });
const B = (value: number) => ({ label: 'Team B', value });

describe('ComparisonBar', () => {
  it('is an image named from the props; the visible text is hidden from assistive tech', () => {
    render(<ComparisonBar label="Goals" left={A(3)} right={B(1)} />);
    const bar = screen.getByRole('img', { name: 'Goals: Team A 3, Team B 1' });
    expect(shares(bar)).toEqual([75, 25]);
    for (const t of ['3', '1', 'Goals', 'Team A', 'Team B']) {
      expect(screen.getByText(t).closest('[aria-hidden="true"]')).not.toBeNull();
    }
    // The higher side takes the accent, the other is muted, in colour and in weight.
    expect(bar.children[0]!.className).toContain('bg-[var(--color-primary)]');
    expect(bar.children[1]!.className).toContain('bg-[var(--color-outline)]');
    expect(screen.getByText('3').className).toContain('font-semibold');
    expect(screen.getByText('1').className).not.toContain('font-semibold');
  });

  it('formats values, takes an aria-label override, and can hide the visible text', () => {
    const { rerender } = render(
      <ComparisonBar label="Possession" left={A(60)} right={B(40)} valueFormat={(n) => `${n}%`} />,
    );
    expect(screen.getByRole('img', { name: 'Possession: Team A 60%, Team B 40%' })).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    rerender(<ComparisonBar label="Possession" left={A(60)} right={B(40)} aria-label="Team A leads" showValues={false} showLabels={false} />);
    expect(screen.getByRole('img', { name: 'Team A leads' })).toBeInTheDocument();
    expect(screen.queryByText('60')).toBeNull();
    expect(screen.queryByText('Team A')).toBeNull();
  });

  it('splits evenly when both are zero or equal, and both sides look the same', () => {
    const { rerender } = render(<ComparisonBar label="Fouls" left={A(0)} right={B(0)} />);
    let bar = screen.getByRole('img');
    expect(shares(bar)).toEqual([50, 50]);
    rerender(<ComparisonBar label="Fouls" left={A(7)} right={B(7)} />);
    bar = screen.getByRole('img');
    expect(shares(bar)).toEqual([50, 50]);
    expect(bar.children[0]!.className).toBe(bar.children[1]!.className);
    expect(screen.getAllByText('7').every((v) => v.className.includes('font-semibold'))).toBe(true);
  });

  it('never draws a zero-width side', () => {
    const { rerender } = render(<ComparisonBar label="Corners" left={A(0)} right={B(9)} />);
    expect(shares(screen.getByRole('img'))).toEqual([4, 96]);
    rerender(<ComparisonBar label="Corners" left={A(500)} right={B(1)} />);
    expect(shares(screen.getByRole('img'))).toEqual([96, 4]);
    // Negative or missing numbers count as zero.
    rerender(<ComparisonBar label="Corners" left={A(-3)} right={B(Number.NaN)} />);
    expect(shares(screen.getByRole('img'))).toEqual([50, 50]);
  });

  it('highlight="none" and per-side colours keep both sides at full strength', () => {
    const { rerender } = render(<ComparisonBar label="Shots" left={A(2)} right={B(8)} highlight="none" />);
    let bar = screen.getByRole('img');
    expect(bar.children[0]!.className).toContain('bg-[var(--color-primary)]');
    rerender(<ComparisonBar label="Shots" left={{ ...A(2), color: 'blue' }} right={{ ...B(8), color: 'amber' }} />);
    bar = screen.getByRole('img');
    expect(bar.children[0]!.getAttribute('data-category')).toBe('blue');
    expect(bar.children[1]!.getAttribute('data-category')).toBe('amber');
    expect(bar.children[0]!.className).toContain('--nx-cat');
  });

  it('is direction-neutral: left is the first segment and no class names a physical side', () => {
    const { container } = render(
      <div dir="rtl">
        <ComparisonBar label="Goals" left={A(3)} right={B(1)} size="sm" />
      </div>,
    );
    const bar = screen.getByRole('img');
    expect(bar.children[0]!.getAttribute('data-side')).toBe('start');
    expect(bar.children[1]!.getAttribute('data-side')).toBe('end');
    const classes = Array.from(container.querySelectorAll('[class]'), (e) => e.getAttribute('class')).join(' ');
    expect(classes).not.toMatch(/(?:^|\s)(?:-?m[lr]-|p[lr]-|left-|right-|text-left|text-right|float-)/);
    for (const s of Array.from(bar.children)) expect((s as HTMLElement).style.width).toBe('');
  });
});
