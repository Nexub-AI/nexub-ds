'use client';

import * as React from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { fireToastClose, toast, useToastStore, type ToastItem } from './useToast.js';

const toneMap: Record<string, string> = {
  success: 'border-s-4 border-[var(--color-success)]',
  error: 'border-s-4 border-[var(--color-error)]',
  warning: 'border-s-4 border-[var(--color-warning)]',
  info: 'border-s-4 border-[var(--color-info)]',
  neutral: '',
  loading: '',
};

// Toasts sit on the inverse surface, where the plain status colours fall to ~2:1.
// The *-container roles invert with it and clear 7:1+ in both schemes.
const toneIcon: Record<string, React.ReactNode> = {
  success: <CheckCircle2 size="sm" aria-hidden="true" className="shrink-0 text-[var(--color-success-container)]" />,
  error: <XCircle size="sm" aria-hidden="true" className="shrink-0 text-[var(--color-error-container)]" />,
  warning: <AlertTriangle size="sm" aria-hidden="true" className="shrink-0 text-[var(--color-warning-container)]" />,
  info: <Info size="sm" aria-hidden="true" className="shrink-0 text-[var(--color-info-container)]" />,
  loading: <Loader2 size="sm" aria-hidden="true" className="shrink-0 animate-spin motion-reduce:animate-none" />,
};

/** A swipe shorter than Radix's threshold still dismisses when flicked faster than this (px/ms). */
const FLICK_VELOCITY = 0.11;

/** Gap between toasts when the stack fans out into a list. */
const GAP = 8;

export type ToasterPosition = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

// Full class strings so Tailwind sees them. --nx-dir flips the stack for bottom positions.
const vertical = {
  top: { viewport: 'top-0', toast: 'top-4 origin-bottom', enter: '[--nx-y:calc(-100%-1rem)]' },
  bottom: { viewport: 'bottom-0 [--nx-dir:-1]', toast: 'bottom-4 origin-top', enter: '[--nx-y:calc(100%+1rem)]' },
};
const horizontal = {
  start: { viewport: 'start-0', enter: '[--nx-x:calc(-100%-1rem)] rtl:[--nx-x:calc(100%+1rem)]' },
  center: { viewport: 'inset-x-0 mx-auto', enter: '' },
  end: { viewport: 'end-0', enter: '[--nx-x:calc(100%+1rem)] rtl:[--nx-x:calc(-100%-1rem)]' },
};

export interface ToasterProps {
  /** Where the stack sits. Default `top-end`; start/end follow the reading direction. */
  position?: ToasterPosition;
  /** Always show the toasts as a list instead of a collapsed stack. */
  expand?: boolean;
  /** How many toasts are visible at once; older ones are visually hidden. Default 3. */
  visibleToasts?: number;
}

/**
 * Sonner-style stack. Collapsed: the newest toast in front, older ones peek
 * out below it, scaled down. Hovering or focusing the viewport fans them out
 * into a list. Radix pauses every toast's timer while the viewport is hovered
 * or focused — the same condition that expands the stack.
 *
 * Measured heights reach CSS as custom properties set through the CSSOM
 * (--nx-toast-index / --nx-toast-offset per toast, --nx-front-height and
 * --nx-stack-height on the viewport), never a style attribute (strict CSP).
 */
export function Toaster({ expand = false, visibleToasts = 3, position = 'top-end' }: ToasterProps) {
  const [side, align] = position.split('-') as ['top' | 'bottom', 'start' | 'center' | 'end'];
  const v = vertical[side];
  const h = horizontal[align];
  const toasts = useToastStore();
  const messages = useNexubMessages();
  const { dir } = useLocale();
  // Closed by Radix (timer, swipe, close button) but still in the store and
  // mounted for the exit animation; they leave the stack order immediately.
  const [closed, setClosed] = React.useState<ReadonlySet<string>>(() => new Set());
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const order = toasts.filter((t) => !closed.has(t.id)).map((t) => t.id).reverse(); // newest first
  const expanded = expand || (order.length > 0 && (hovered || focused));

  const viewportRef = React.useRef<HTMLOListElement>(null);
  const heights = React.useRef(new Map<string, number>());
  const state = React.useRef({ order, expanded, visibleToasts });
  state.current = { order, expanded, visibleToasts };
  // Pending "drop from the store" timers, cleared on unmount so none fires on a dead tree.
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>());
  // Each toast as first rendered: Radix announces only that, so later updates go to the toast's own live region.
  const firstSeen = React.useRef(new Map<string, ToastItem>());
  const swipeStart = React.useRef(0);
  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const layout = React.useCallback(() => {
    const ol = viewportRef.current;
    if (!ol) return;
    const { order, expanded, visibleToasts } = state.current;
    let offset = 0;
    let front = 0;
    let stack = 0;
    order.forEach((id, i) => {
      const el = ol.querySelector<HTMLElement>(`[data-toast-id="${id}"]`);
      if (!el) return;
      // Collapsed older toasts are clamped to the front's height; keep their
      // natural height from when they were unclamped (every toast enters in front).
      if (i === 0 || expanded || !heights.current.has(id)) heights.current.set(id, el.offsetHeight);
      const h = heights.current.get(id)!;
      el.style.setProperty('--nx-toast-index', String(i));
      el.style.setProperty('--nx-toast-offset', `${offset}px`);
      if (i === 0) front = h;
      if (i < visibleToasts) stack = offset + h;
      offset += h + GAP;
    });
    ol.style.setProperty('--nx-front-height', `${front}px`);
    ol.style.setProperty('--nx-stack-height', `${expanded ? stack : front}px`);
  }, []);

  // Our own changes: order, expanded, visible count.
  useIsomorphicLayoutEffect(layout);

  // Radix mounts toasts into the viewport on its own render (not ours), and
  // toasts change size with content, fonts and viewport width.
  useIsomorphicLayoutEffect(() => {
    const ol = viewportRef.current;
    if (!ol) return;
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(layout);
    const observe = () => {
      for (const li of Array.from(ol.children)) ro?.observe(li);
      layout();
    };
    const mo = new MutationObserver(observe);
    mo.observe(ol, { childList: true });
    observe();
    // Native listeners on Radix's region wrapper, the element Radix pauses
    // timers on, so "expanded" and "paused" are the same condition. (React
    // events would miss toasts: Radix portals them into the viewport.)
    const region = ol.parentElement ?? ol;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const focusIn = () => setFocused(true);
    const focusOut = (e: FocusEvent) => {
      if (!region.contains(e.relatedTarget as Node | null)) setFocused(false);
    };
    region.addEventListener('pointermove', enter);
    region.addEventListener('pointerleave', leave);
    region.addEventListener('focusin', focusIn);
    region.addEventListener('focusout', focusOut);
    return () => {
      mo.disconnect();
      ro?.disconnect();
      region.removeEventListener('pointermove', enter);
      region.removeEventListener('pointerleave', leave);
      region.removeEventListener('focusin', focusIn);
      region.removeEventListener('focusout', focusOut);
    };
  }, [layout]);

  // With no toasts the viewport is pointer-events: none, so pointerleave may never come.
  React.useEffect(() => {
    if (order.length === 0) {
      setHovered(false);
      setFocused(false);
    }
  }, [order.length]);

  const el = (id: string) => viewportRef.current?.querySelector<HTMLElement>(`[data-toast-id="${id}"]`);
  const close = (t: ToastItem) => {
    if (closed.has(t.id)) return;
    fireToastClose(t);
    setClosed((s) => new Set(s).add(t.id));
    // Drop it from the store once the exit animation has played, so a
    // long session doesn't keep every toast it ever showed.
    // ponytail: fixed 1s > the effects-fast exit; read the computed duration if exits get longer.
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      firstSeen.current.delete(t.id);
      toast.dismiss(t.id);
      setClosed((s) => {
        const next = new Set(s);
        next.delete(t.id);
        return next;
      });
    }, 1000);
    timers.current.add(timer);
  };

  return (
    <RadixToast.Provider swipeDirection={(align === 'start') === (dir === 'rtl') ? 'right' : 'left'}>
      {toasts.map((t) => {
        const i = order.indexOf(t.id);
        const action = t.action ?? (t.undo && { label: t.undo.label ?? messages.undo, onClick: t.undo.onUndo });
        if (!firstSeen.current.has(t.id)) firstSeen.current.set(t.id, t);
        // Announce an update once it settles; a loading step is never re-announced.
        const announce = firstSeen.current.get(t.id) !== t && t.tone !== 'loading' ? [t.title, t.description].filter(Boolean).join('. ') : '';
        const icon = t.icon === false ? null : (t.icon ?? toneIcon[t.tone ?? 'neutral']);
        const duration = t.tone === 'loading' ? Infinity : (t.duration ?? 5000);
        return (
          <RadixToast.Root
            key={t.id}
            data-toast-id={t.id}
            data-front={i === -1 ? undefined : i === 0}
            data-hidden={i === -1 ? undefined : i >= visibleToasts}
            open={!closed.has(t.id)}
            onOpenChange={(open) => {
              if (!open) close(t);
            }}
            onPause={() => el(t.id)?.setAttribute('data-paused', '')}
            onResume={() => el(t.id)?.removeAttribute('data-paused')}
            onSwipeStart={() => {
              swipeStart.current = performance.now();
            }}
            onSwipeCancel={(e) => {
              // Radix only measures distance; a fast flick toward the edge dismisses too.
              const { x, y } = e.detail.delta;
              if (Math.hypot(x, y) / Math.max(1, performance.now() - swipeStart.current) < FLICK_VELOCITY) return;
              e.preventDefault(); // skip Radix's snap-back; leave from where it was let go, like a swipe end
              e.currentTarget.setAttribute('data-swipe', 'end');
              e.currentTarget.style.setProperty('--radix-toast-swipe-end-x', `${x}px`);
              close(t);
            }}
            className={cn(
              'group pointer-events-auto absolute inset-x-4 flex items-center justify-between gap-3 overflow-hidden rounded-shape-container bg-[var(--color-inverse-surface)] py-3 ps-4 pe-2 text-[var(--color-inverse-on-surface)] shadow-elevation-2',
              // Stack: older toasts sit behind, scaled from their bottom edge so it peeks out.
              // Transition-only timing: duration-*/ease-* utilities would also retime nx-motion's enter/exit keyframes.
              v.toast,
              'transition-[transform,opacity] [transition-duration:var(--motion-spring-spatial-default-duration)] [transition-timing-function:var(--motion-spring-spatial-default-easing)]',
              'translate-y-[calc(var(--nx-toast-index,0)*var(--nx-toast-step)*var(--nx-dir,1))] scale-[calc(1_-_var(--nx-toast-index,0)*var(--nx-toast-shrink))]',
              'group-data-[expanded=true]/toaster:translate-y-[calc(var(--nx-toast-offset,0px)*var(--nx-dir,1))] group-data-[expanded=true]/toaster:scale-100',
              // Collapsing settles faster than expanding.
              'group-data-[expanded=false]/toaster:[transition-duration:var(--motion-spring-effects-fast-duration)] group-data-[expanded=false]/toaster:[transition-timing-function:var(--motion-spring-effects-fast-easing)]',
              'group-data-[expanded=false]/toaster:data-[front=false]:h-[var(--nx-front-height)]',
              // Collapsed, older toasts show only their edge: hide their content until expanded.
              '[&>*]:transition-opacity [&>*]:duration-effects-fast group-data-[expanded=false]/toaster:[&[data-front=false]>*]:opacity-0',
              // Beyond visibleToasts: visually hidden, still in the DOM and its live region.
              'data-[hidden=true]:pointer-events-none data-[hidden=true]:opacity-0',
              // Reduced motion: no travel or scale (step/shrink are 0); collapsed shows only the front.
              'motion-reduce:[transition-property:opacity] motion-reduce:group-data-[expanded=false]/toaster:data-[front=false]:pointer-events-none motion-reduce:group-data-[expanded=false]/toaster:data-[front=false]:opacity-0',
              'data-[state=closed]:duration-effects-fast',
              'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
              'nx-motion',
              align === 'center' ? v.enter : h.enter,
              toneMap[t.tone ?? 'neutral'],
            )}
            duration={duration}
          >
            {icon}
            <div className="grid flex-1 gap-1">
              <RadixToast.Title className="text-title-sm">{t.title}</RadixToast.Title>
              {t.description && (
                <RadixToast.Description className="text-body-sm text-[color-mix(in_srgb,var(--color-inverse-on-surface)_80%,transparent)]">
                  {t.description}
                </RadixToast.Description>
              )}
            </div>
            {action && (
              <RadixToast.Action
                altText={action.label}
                onClick={action.onClick}
                className="nx-state-layer relative inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-shape-control px-3 text-label-lg text-[var(--color-inverse-primary)]"
              >
                {action.label}
              </RadixToast.Action>
            )}
            {/* Hidden until hover only on hover-capable devices; always visible on touch. */}
            <RadixToast.Close className="nx-state-layer relative grid h-8 w-8 place-items-center rounded-full transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100 focus-visible:opacity-100">
              <X size="sm" aria-hidden="true" />
              <span className="sr-only">{messages.close}</span>
            </RadixToast.Close>
            <span role="status" className="sr-only">{announce}</span>
            {t.showProgress && duration !== Infinity && (
              <span
                key={duration}
                aria-hidden="true"
                // Countdown: the theme's scroll-progress scaleX keyframes, reversed; duration via the CSSOM (strict CSP).
                ref={(bar) => bar?.style.setProperty('animation-duration', `${duration}ms`)}
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-current opacity-40 rtl:origin-right [animation:nx-scroll-progress_1s_linear_reverse_forwards] group-data-[paused]:[animation-play-state:paused] motion-reduce:hidden"
              />
            )}
          </RadixToast.Root>
        );
      })}
      <RadixToast.Viewport
        ref={viewportRef}
        label={messages.notifications}
        data-expanded={expanded}
        data-position={position}
        className={cn(
          v.viewport,
          h.viewport,
          'group/toaster fixed z-[var(--z-toast,2000)] max-h-screen w-full p-4 sm:max-w-sm',
          // Collapsed: the front toast's height (older edges peek below); expanded: the whole list.
          'h-[calc(var(--nx-stack-height,0px)+2rem)]',
          '[--nx-toast-step:10px] [--nx-toast-shrink:0.05] motion-reduce:[--nx-toast-step:0px] motion-reduce:[--nx-toast-shrink:0]',
        )}
      />
    </RadixToast.Provider>
  );
}

Toaster.displayName = 'Toaster';
