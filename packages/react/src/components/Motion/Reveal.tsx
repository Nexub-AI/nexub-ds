'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

/**
 * Fades its content up as it scrolls into view, in marketing mode
 * (@nexub/themes/marketing). Uses a CSS scroll-driven animation where the
 * browser supports one; elsewhere an IntersectionObserver plays the same
 * animation once. Content that starts on screen, and every visitor without
 * JS or with reduced motion, just sees it.
 */
export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const self = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const el = self.current;
      if (!el || typeof IntersectionObserver === 'undefined') return;
      if (CSS.supports?.('animation-timeline: view()')) return;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.dataset.reveal = 'pending';
      const io = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.reveal = 'done';
        io.disconnect();
      }, { threshold: 0.15 });
      io.observe(el);
      return () => io.disconnect();
    }, []);
    const Comp = asChild ? Slot : 'div';
    return <Comp ref={useMergedRefs(ref, self)} className={cn('nx-mkt-reveal', className)} {...props} />;
  },
);
Reveal.displayName = 'Reveal';
