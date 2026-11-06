'use client';

// Celebrate (4.3): a short confetti burst for a real win (first payment,
// onboarding done). Place it inside a positioned element; it bursts from the
// centre each time `active` turns true. Colours from the chart palette.
// Decorative (aria-hidden): announce the win in text too. Hidden under reduced
// motion. Particle paths are set through the CSSOM, so it is strict-CSP safe.
import * as React from 'react';
import { cn } from '../../utils/cn.js';

const COLORS = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5', 'bg-chart-6', 'bg-chart-7', 'bg-chart-8'];

export interface CelebrateProps {
  /** Bursts each time this goes from false to true. */
  active: boolean;
  /** Number of pieces. @default 28 */
  count?: number;
  className?: string;
}

export function Celebrate({ active, count = 28, className }: CelebrateProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [burst, setBurst] = React.useState(0);
  const was = React.useRef(false);
  React.useEffect(() => {
    if (active && !was.current) setBurst((b) => b + 1);
    was.current = active;
  }, [active]);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!burst || !el) return;
    for (const piece of Array.from(el.children) as HTMLElement[]) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 90;
      piece.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      piece.style.setProperty('--y', `${Math.sin(angle) * distance + 40}px`);
      piece.style.setProperty('--r', `${Math.random() * 540 - 270}deg`);
      piece.style.setProperty('--d', `${Math.random() * 90}ms`);
    }
  }, [burst]);
  if (!burst) return null;
  return (
    <div key={burst} ref={ref} aria-hidden="true" className={cn('nx-celebrate', className)}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={COLORS[i % COLORS.length]} />
      ))}
    </div>
  );
}
