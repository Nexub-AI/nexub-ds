import * as React from 'react';
import { SPRING_MS } from './useMotion.js';

export interface ListTransitionProps extends React.HTMLAttributes<HTMLElement> {
  /** List element. @default 'div' */
  as?: React.ElementType;
  /** Element wrapping each item, e.g. `'li'` inside a `'ul'`. @default 'div' */
  itemAs?: React.ElementType;
  /** Animate the items present on first render too. @default false */
  appear?: boolean;
  /** Keyed children. Items without a key are rendered but never animated. */
  children?: React.ReactNode;
}

type Entry = { key: React.Key; node: React.ReactNode; state: 'idle' | 'enter' | 'exit' };

// Exit settles on effects default; the timer covers hidden elements and
// reduced motion, where animationend may never fire.
const EXIT_FALLBACK_MS = SPRING_MS.effects.default + 50;

function keyed(children: React.ReactNode) {
  const out: { key: React.Key; node: React.ReactNode }[] = [];
  React.Children.forEach(children, (child, i) => {
    const key = React.isValidElement(child) && child.key != null ? child.key : `__nx-${i}`;
    out.push({ key, node: child });
  });
  return out;
}

/**
 * Merge the next children into the rendered list: next order wins, and each
 * removed item stays right after the item it followed, so it exits in place.
 */
function merge(prev: Entry[], next: { key: React.Key; node: React.ReactNode }[]): Entry[] {
  const before = new Map(prev.map((p) => [p.key, p] as const));
  const nextKeys = new Set(next.map((n) => n.key));
  const result: Entry[] = next.map((n) => {
    const old = before.get(n.key);
    return { ...n, state: !old || old.state === 'exit' ? 'enter' : old.state };
  });
  prev.forEach((p, i) => {
    if (nextKeys.has(p.key)) return;
    // Anchor on the nearest earlier item that is still rendered.
    let at = 0;
    for (let j = i - 1; j >= 0; j--) {
      const idx = result.findIndex((r) => r.key === prev[j]!.key);
      if (idx !== -1) { at = idx + 1; break; }
    }
    result.splice(at, 0, { ...p, state: 'exit' });
  });
  return result;
}

/**
 * ListTransition — animates keyed items in and out of a list.
 * New items grow in from zero height and fade in; removed items stay in place
 * while they collapse and fade out, then unmount. Uses CSS keyframes on the
 * spring tokens (`nx-list-item` in `@nexub/themes/base`); reduced motion keeps
 * only the fade.
 *
 * Space items with padding inside each item, not `gap`, so a collapsing item
 * takes its spacing with it.
 *
 * ```tsx
 * <ListTransition as="ul" itemAs="li">
 *   {items.map((item) => <Row key={item.id} item={item} />)}
 * </ListTransition>
 * ```
 */
export const ListTransition = React.forwardRef<HTMLElement, ListTransitionProps>(function ListTransition(
  { as: Tag = 'div', itemAs: Item = 'div', appear = false, children, ...rest },
  ref,
) {
  const next = keyed(children);
  const [entries, setEntries] = React.useState<Entry[]>(() =>
    next.map((n) => ({ ...n, state: appear ? 'enter' : 'idle' })),
  );
  const [prevChildren, setPrevChildren] = React.useState(children);

  // Derive state from props during render (no effect, no flash of stale items).
  let rendered = entries;
  if (children !== prevChildren) {
    rendered = merge(entries, next);
    setPrevChildren(children);
    setEntries(rendered);
  }

  const remove = React.useCallback((key: React.Key) => {
    setEntries((list) => list.filter((e) => !(e.key === key && e.state === 'exit')));
  }, []);
  const settle = React.useCallback((key: React.Key) => {
    setEntries((list) => list.map((e) => (e.key === key && e.state === 'enter' ? { ...e, state: 'idle' } : e)));
  }, []);

  const exiting = rendered.filter((e) => e.state === 'exit').map((e) => e.key).join('|');
  React.useEffect(() => {
    if (!exiting) return;
    const keys = rendered.filter((e) => e.state === 'exit').map((e) => e.key);
    const t = setTimeout(() => keys.forEach(remove), EXIT_FALLBACK_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting, remove]);

  return (
    <Tag ref={ref} {...rest}>
      {rendered.map((e) => (
        <Item
          key={e.key}
          className="nx-list-item"
          data-state={e.state === 'idle' ? undefined : e.state}
          aria-hidden={e.state === 'exit' ? true : undefined}
          onAnimationEnd={(ev: React.AnimationEvent) => {
            if (ev.target !== ev.currentTarget) return;
            if (e.state === 'exit') remove(e.key);
            else if (e.state === 'enter') settle(e.key);
          }}
        >
          <div className="nx-list-item-inner">{e.node}</div>
        </Item>
      ))}
    </Tag>
  );
});

ListTransition.displayName = 'ListTransition';

export interface SkeletonSwapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** While true the skeleton shows; flipping to false crossfades to the content. */
  loading: boolean;
  /** Placeholder shown while loading, usually `Skeleton`s shaped like the content. */
  skeleton: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * SkeletonSwap — crossfades from a skeleton to the loaded content in place,
 * instead of popping. Sets `aria-busy` while loading.
 *
 * ```tsx
 * <SkeletonSwap loading={isLoading} skeleton={<Skeleton shape="rect" height={120} />}>
 *   <Card>…</Card>
 * </SkeletonSwap>
 * ```
 */
export const SkeletonSwap = React.forwardRef<HTMLDivElement, SkeletonSwapProps>(function SkeletonSwap(
  { loading, skeleton, children, className, ...rest },
  ref,
) {
  // 'out' keeps the skeleton mounted while it fades over the arriving content.
  const [phase, setPhase] = React.useState<'loading' | 'out' | 'done'>(loading ? 'loading' : 'done');
  const [prevLoading, setPrevLoading] = React.useState(loading);
  let current = phase;
  if (loading !== prevLoading) {
    current = loading ? 'loading' : 'out';
    setPrevLoading(loading);
    setPhase(current);
  }

  React.useEffect(() => {
    if (current !== 'out') return;
    const t = setTimeout(() => setPhase('done'), SPRING_MS.effects.default + 50);
    return () => clearTimeout(t);
  }, [current]);

  return (
    <div ref={ref} className={className ? `nx-swap ${className}` : 'nx-swap'} aria-busy={loading || undefined} {...rest}>
      {current !== 'loading' && <div className={current === 'out' ? 'nx-swap-in' : undefined}>{children}</div>}
      {current !== 'done' && (
        <div
          className={current === 'out' ? 'nx-swap-out' : undefined}
          aria-hidden="true"
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setPhase('done');
          }}
        >
          {skeleton}
        </div>
      )}
    </div>
  );
});

SkeletonSwap.displayName = 'SkeletonSwap';
