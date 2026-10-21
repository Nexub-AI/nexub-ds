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
      });
    },
    [onPointerMove],
  );

  return enabled ? handler : onPointerMove;
}
