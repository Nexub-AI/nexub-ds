import type * as React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect.js';

/**
 * One indicator that slides to the active item (SegmentedControl thumb, Tabs
 * underline). Writes --nx-ind-x / -w / -o (opacity) on the (position: relative) root;
 * CSS transitions do the motion. Sets data-nx-indicator="ready" one frame after
 * the first measure so the indicator doesn't animate in on mount.
 */
export function useSlidingIndicator(ref: React.RefObject<HTMLElement | null>, activeSelector: string) {
  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const update = () => {
      const el = root.querySelector<HTMLElement>(activeSelector);
      // Nothing selected: hide the indicator (--nx-ind-o) instead of a 0-width sliver.
      root.style.setProperty('--nx-ind-o', el ? '1' : '0');
      if (!el) return;
      root.style.setProperty('--nx-ind-x', `${el.offsetLeft}px`);
      root.style.setProperty('--nx-ind-w', `${el.offsetWidth}px`);
    };
    update();
    const frame = requestAnimationFrame(() => (root.dataset.nxIndicator = 'ready'));
    // Selection changes (Radix flips data-state), item resizes, and web fonts.
    const mo = new MutationObserver(update);
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['data-state'] });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    ro?.observe(root);
    for (const child of Array.from(root.children)) ro?.observe(child);
    void document.fonts?.ready.then(update);
    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      ro?.disconnect();
    };
  }, [ref, activeSelector]);
}
