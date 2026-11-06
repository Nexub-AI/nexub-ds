'use client';

// SharedElement (4.4): gives its child a view-transition-name, so the same
// thing (an avatar, a card, a product image) morphs between two states or pages
// when the change runs inside startViewTransition(). The name goes through the
// CSSOM, so it is strict-CSP safe. Use one name per element on screen at a time.
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface SharedElementProps {
  /** Same name on both sides of the transition, e.g. `avatar-${user.id}`. */
  name: string;
  children: React.ReactElement;
}

/** Turns any string into a valid <custom-ident> for view-transition-name. */
export const transitionName = (name: string) => `nx-${name.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

export function SharedElement({ name, children }: SharedElementProps) {
  const ref = React.useRef<HTMLElement>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('view-transition-name', transitionName(name));
    return () => {
      el.style.removeProperty('view-transition-name');
    };
  }, [name]);
  return <Slot ref={ref}>{children}</Slot>;
}
