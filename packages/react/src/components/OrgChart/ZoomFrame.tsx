'use client';

import * as React from 'react';
import { Minus, Plus } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { disabledText, pressable } from '../../utils/control.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 2;
/** The steps the buttons and + / - keys move through, like a browser's zoom. */
const STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
const stepUp = (z: number) => STEPS.find((s) => s > z + 0.001) ?? ZOOM_MAX;
const stepDown = (z: number) => [...STEPS].reverse().find((s) => s < z - 0.001) ?? ZOOM_MIN;

/** `z` inside [min, max], both kept inside 0.25–2. */
export function clampZoom(z: number, min = ZOOM_MIN, max = ZOOM_MAX): number {
  const lo = Math.max(ZOOM_MIN, Math.min(min, ZOOM_MAX));
  const hi = Math.max(lo, Math.min(max, ZOOM_MAX));
  return Math.min(hi, Math.max(lo, Number.isFinite(z) ? z : 1));
}

export interface ZoomProps {
  zoom?: number;
  defaultZoom?: number;
  onZoomChange?: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

type Anchor = { px: number; py: number; cx: number; cy: number };

const editable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

// Plain buttons with IconButton's ghost look: IconButton's tooltip and variants aren't needed here.
const BUTTON = cn(pressable, 'inline-flex size-control-sm shrink-0 items-center justify-center text-label-md text-[var(--color-on-surface-variant)]', disabledText);
const ZoomButton = ({ label, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) => (
  <button type="button" aria-label={label} className={cn(BUTTON, 'nx-hit')} {...props} />
);

const FitIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.25em] fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
  </svg>
);

/**
 * The zoomable box around the chart: a toolbar (out, level, in, fit), a scroller holding a sizer as big as the
 * scaled canvas, and the canvas scaled with a CSS transform. Pinch (two pointers, or ctrl/⌘ + wheel), drag to pan,
 * and + / = / - / 0 while focus is inside. No animation, so reduced motion needs no special case.
 */
export function ZoomFrame({
  zoom: zoomProp,
  defaultZoom = 1,
  onZoomChange,
  minZoom = ZOOM_MIN,
  maxZoom = ZOOM_MAX,
  focusTarget,
  className,
  children,
}: ZoomProps & {
  /** The focused (or tab-stop) card, scrolled into view after a keyboard or button zoom. */
  focusTarget: () => HTMLElement | null | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  const messages = useNexubMessages();
  const clamp = (z: number) => clampZoom(z, minZoom, maxZoom);
  const [raw = 1, setRaw] = useControllableState<number>({ value: zoomProp, defaultValue: defaultZoom, onChange: onZoomChange });
  const zoom = clamp(raw);
  const viewport = React.useRef<HTMLDivElement>(null);
  const sizer = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLDivElement>(null);
  const zoomRef = React.useRef(zoom);
  zoomRef.current = zoom;
  const focusRef = React.useRef(focusTarget);
  focusRef.current = focusTarget;
  // What to keep still after the next zoom: a point under the pointer, or the focused card.
  const pending = React.useRef<Anchor | 'focus' | null>(null);

  const apply = React.useCallback(() => {
    const c = canvas.current;
    const s = sizer.current;
    if (!c || !s) return;
    // CSSOM, not style attributes: strict CSP pages block inline styles.
    c.style.transform = `scale(${zoomRef.current})`;
    s.style.width = `${c.offsetWidth * zoomRef.current}px`;
    s.style.height = `${c.offsetHeight * zoomRef.current}px`;
  }, []);

  const setZoom = (next: number, anchor: Anchor | 'focus' | null = 'focus') => {
    const z = Math.round(clamp(next) * 100) / 100;
    if (z === zoom) return;
    pending.current = anchor;
    setRaw(z);
  };
  /** The content point under client (x, y), for anchoring a pointer zoom. */
  const anchorAt = (px: number, py: number): Anchor | null => {
    const r = sizer.current?.getBoundingClientRect();
    return r ? { px, py, cx: (px - r.left) / zoomRef.current, cy: (py - r.top) / zoomRef.current } : null;
  };

  useIsomorphicLayoutEffect(() => {
    apply();
    const p = pending.current;
    pending.current = null;
    const v = viewport.current;
    if (!p || !v) return;
    if (p === 'focus') {
      focusRef.current()?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      return;
    }
    const r = sizer.current!.getBoundingClientRect();
    v.scrollLeft += r.left + p.cx * zoom - p.px;
    v.scrollTop += r.top + p.cy * zoom - p.py;
  }, [zoom, apply]);

  // The canvas changes size when cards expand or collapse; keep the sizer in step.
  React.useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !canvas.current) return;
    const ro = new ResizeObserver(apply);
    ro.observe(canvas.current);
    return () => ro.disconnect();
  }, [apply]);

  // Native listeners: React's wheel listener is passive, so it can't stop the page zooming.
  const setZoomRef = React.useRef(setZoom);
  setZoomRef.current = setZoom;
  const anchorRef = React.useRef(anchorAt);
  anchorRef.current = anchorAt;
  React.useEffect(() => {
    const v = viewport.current;
    if (!v) return;
    const wheel = (e: WheelEvent) => {
      // Plain wheel scrolls as usual; ctrl/⌘ + wheel (and a trackpad pinch, which sends ctrlKey) zooms.
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      // Lines (Firefox) as pixels; capped, so one mouse-wheel notch is a step, not a jump.
      const dy = Math.max(-25, Math.min(25, e.deltaY * (e.deltaMode === 1 ? 16 : 1)));
      setZoomRef.current(zoomRef.current * Math.exp(-dy * 0.01), anchorRef.current(e.clientX, e.clientY));
    };
    // Safari's trackpad pinch.
    let start = 1;
    const gesture = (e: Event & { scale?: number; clientX?: number; clientY?: number }) => {
      e.preventDefault();
      if (e.type === 'gesturestart') start = zoomRef.current;
      else setZoomRef.current(start * (e.scale ?? 1), anchorRef.current(e.clientX ?? 0, e.clientY ?? 0));
    };
    v.addEventListener('wheel', wheel, { passive: false });
    v.addEventListener('gesturestart', gesture);
    v.addEventListener('gesturechange', gesture);
    return () => {
      v.removeEventListener('wheel', wheel);
      v.removeEventListener('gesturestart', gesture);
      v.removeEventListener('gesturechange', gesture);
    };
  }, []);

  // Pointers: one drags to pan (after 4px, with capture), two pinch.
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const gesture = React.useRef<{ x: number; y: number; left: number; top: number; panning: boolean } | null>(null);
  const pinch = React.useRef<{ dist: number; zoom: number } | null>(null);
  const suppressClick = React.useRef(false);
  const distance = () => {
    const [a, b] = [...pointers.current.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const v = e.currentTarget;
    if (pointers.current.size === 2) {
      gesture.current = null;
      pinch.current = { dist: distance(), zoom: zoomRef.current };
      for (const id of pointers.current.keys()) if (v.hasPointerCapture?.(id) === false) v.setPointerCapture?.(id);
    } else if (pointers.current.size === 1) {
      gesture.current = { x: e.clientX, y: e.clientY, left: v.scrollLeft, top: v.scrollTop, panning: false };
    }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const v = e.currentTarget;
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()] as [{ x: number; y: number }, { x: number; y: number }];
      const d = distance();
      if (pinch.current.dist > 0 && d > 0) setZoom(pinch.current.zoom * (d / pinch.current.dist), anchorAt((a.x + b.x) / 2, (a.y + b.y) / 2));
      return;
    }
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (!g.panning && Math.hypot(dx, dy) < 4) return;
    if (!g.panning) {
      g.panning = true;
      v.setPointerCapture?.(e.pointerId);
      v.dataset.panning = '';
    }
    v.scrollLeft = g.left - dx;
    v.scrollTop = g.top - dy;
  };
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (gesture.current?.panning || pinch.current) suppressClick.current = e.type === 'pointerup';
    if (pointers.current.size < 2) pinch.current = null;
    gesture.current = null;
    delete e.currentTarget.dataset.panning;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || editable(e.target)) return;
    if (e.key === '+' || e.key === '=') setZoom(stepUp(zoom));
    else if (e.key === '-') setZoom(stepDown(zoom));
    else if (e.key === '0') setZoom(1);
    else return;
    e.preventDefault();
  };

  /** Fits a wide (or, in a fixed-height box, tall) chart; a chart that already fits goes back to 100%. */
  const fit = () => {
    const v = viewport.current;
    const c = canvas.current;
    if (!v || !c || !c.offsetWidth) return setZoom(1);
    const tall = v.scrollHeight > v.clientHeight + 1;
    setZoom(Math.min(1, v.clientWidth / c.offsetWidth, tall ? v.clientHeight / c.offsetHeight : 1));
  };

  const lo = clamp(ZOOM_MIN);
  const hi = clamp(ZOOM_MAX);
  return (
    // Keys bubble up from the cards; the tree handles its own keys first and leaves these alone.
    <div className={cn('relative flex flex-col gap-2', className)} onKeyDown={onKeyDown}>
      <div role="group" aria-label={messages.orgChartZoom} className="flex items-center gap-1 self-end">
        <ZoomButton label={messages.orgChartZoomOut} disabled={zoom <= lo} onClick={() => setZoom(stepDown(zoom))}>
          <Minus size="sm" />
        </ZoomButton>
        <output aria-live="polite" className="min-w-12 text-center text-label-md tabular-nums text-[var(--color-on-surface-variant)]">
          {messages.orgChartZoomLevel(Math.round(zoom * 100))}
        </output>
        <ZoomButton label={messages.orgChartZoomIn} disabled={zoom >= hi} onClick={() => setZoom(stepUp(zoom))}>
          <Plus size="sm" />
        </ZoomButton>
        <ZoomButton label={messages.orgChartZoomFit} onClick={fit}>
          <FitIcon />
        </ZoomButton>
      </div>
      {/* relative: keeps absolutely placed descendants (sr-only text in custom cards) inside the scroller. */}
      <div
        ref={viewport}
        data-nx-zoom=""
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={(e) => {
          if (!suppressClick.current) return;
          suppressClick.current = false;
          e.stopPropagation();
          e.preventDefault();
        }}
        className="relative flex min-h-0 flex-1 touch-none items-start overflow-auto data-[panning]:cursor-grabbing data-[panning]:select-none"
      >
        <div ref={sizer} className="mx-auto shrink-0">
          <div ref={canvas} className="w-max origin-top-left rtl:origin-top-right">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
