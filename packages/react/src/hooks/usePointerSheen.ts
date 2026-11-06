'use client';

import * as React from 'react';

/**
 * Pointer position for the `nx-sheen` effect (themes/base.css). Returns a
 * pointermove handler that writes --nx-mx / --nx-my (px, relative to the
 * element) through the CSSOM — no style attribute, so strict-CSP safe — at
 * most once per frame. Touch is ignored: there is no hover to light.
 */
export function usePointerSheen<T extends HTMLElement>(
  enabled: boolean,
  onPointerMove?: React.PointerEventHandler<T>,
): React.PointerEventHandler<T> | undefined {
  const frame = React.useRef(0);
  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const handler = React.useCallback<React.PointerEventHandler<T>>(
    (event) => {
      onPointerMove?.(event);
      if (event.pointerType === 'touch') return;
      const el = event.currentTarget;
      const { clientX, clientY } = event;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--nx-mx', `${clientX - r.left}px`);
        el.style.setProperty('--nx-my', `${clientY - r.top}px`);
        // 0–1 across the element, for .nx-tilt and .nx-magnetic (4.3).
        el.style.setProperty('--nx-px', String(r.width ? (clientX - r.left) / r.width : 0.5));
        el.style.setProperty('--nx-py', String(r.height ? (clientY - r.top) / r.height : 0.5));
      });
    },
    [onPointerMove],
  );

  return enabled ? handler : onPointerMove;
}
