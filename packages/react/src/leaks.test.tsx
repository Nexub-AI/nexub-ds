// 9.5: mount and unmount every story 1,000 times; nothing may be left behind.
//   listeners on window / document / <html> / <body> (they outlive the component),
//   running intervals, pending timeouts, nodes in <body> (portals), and heap (after a forced GC).
// Runs on its own (`pnpm test:leaks`, CI job "Resilience"): it takes minutes, not seconds.
import * as React from 'react';
import v8 from 'node:v8';
import vm from 'node:vm';
import { act, cleanup, render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, it } from 'vitest';
import { NexubProvider } from './components/NexubProvider/index.js';

declare global {
  interface ImportMeta {
    glob<T>(pattern: string, options: { eager: true }): Record<string, T>;
  }
}

const CYCLES = Number(process.env.LEAK_CYCLES ?? 1000);
// Heap kept per mount in the second half, measured after a forced GC. A real leak keeps a
// fiber tree, a closure or a DOM subtree per mount. Under jsdom 31 an element costs about
// 1.2 KB (jsdom 30: about 5 KB), so the control test below leaks a small component's worth
// of elements. Stories that leak nothing measure under 0.5 KB alone and up to ~1.4 KB in a
// full run (GC timing on the heaviest overlay story), so the limit stays at 2 KB.
const HEAP_PER_CYCLE = 2048;

v8.setFlagsFromString('--expose-gc');
const gc = vm.runInNewContext('gc') as () => void;

type StoryModule = Parameters<typeof composeStories>[0];
const modules = import.meta.glob<StoryModule>('./**/*.stories.tsx', { eager: true });
const stories = Object.entries(modules).flatMap(([file, mod]) =>
  Object.entries(composeStories(mod) as unknown as Record<string, React.ComponentType>).map(
    ([name, S]) => [`${file.slice(2)} ${name}`, S] as const,
  ),
);

// `file story` → `check` → why it is still listed. Shrink-only: a listed check that passes fails.
// Checks: listeners, intervals, timeouts, nodes, heap.
const KNOWN: Record<string, Record<string, string>> = {};

// Net listeners on the long-lived targets, as "target type" keys.
const live = new Map<string, number>();
const registered = new Map<string, Set<unknown>>();
const capture = (o?: boolean | AddEventListenerOptions) => (typeof o === 'boolean' ? o : !!o?.capture);
type Listening = Pick<EventTarget, 'addEventListener' | 'removeEventListener'>;
/** Counts listeners added through `owner`'s methods; `nameOf` says which long-lived target, if any, `this` is. */
function hook(owner: Listening, nameOf: (self: unknown) => string | undefined) {
  const { addEventListener: add, removeEventListener: remove } = owner;
  owner.addEventListener = function (this: unknown, type, fn, options) {
    const name = nameOf(this);
    // `once` and `signal` listeners remove themselves; the same listener added twice is one listener.
    const selfRemoving = typeof options === 'object' && (options.once || options.signal);
    if (name && fn && !selfRemoving) {
      const key = `${name} ${type}:${capture(options)}`;
      const set = registered.get(key) ?? registered.set(key, new Set()).get(key)!;
      if (!set.has(fn)) {
        set.add(fn);
        live.set(`${name} ${type}`, (live.get(`${name} ${type}`) ?? 0) + 1);
      }
    }
    return add.call(this as EventTarget, type, fn, options);
  };
  owner.removeEventListener = function (this: unknown, type, fn, options) {
    const name = nameOf(this);
    if (name && registered.get(`${name} ${type}:${capture(options)}`)?.delete(fn)) {
      live.set(`${name} ${type}`, live.get(`${name} ${type}`)! - 1);
    }
    return remove.call(this as EventTarget, type, fn, options);
  };
}
// jsdom's EventTarget (document, <html> and <body> inherit from it), not Node's global one.
let proto = Object.getPrototypeOf(document) as EventTarget;
while (!Object.prototype.hasOwnProperty.call(proto, 'addEventListener')) proto = Object.getPrototypeOf(proto) as EventTarget;
const named = new Map<unknown, string>([
  [document, 'document'],
  [document.documentElement, 'html'],
  [document.body, 'body'],
]);
hook(proto, (self) => named.get(self));
// Vitest's `window` is Node's global with jsdom's window methods copied on, already bound.
hook(globalThis, () => 'window');

const intervals = new Set<unknown>();
const { setInterval: set, clearInterval: clear } = globalThis;
globalThis.setInterval = ((...args: Parameters<typeof setInterval>) => {
  const id = set(...args);
  intervals.add(id);
  return id;
}) as typeof setInterval;
globalThis.clearInterval = ((id: Parameters<typeof clearInterval>[0]) => {
  intervals.delete(id);
  clear(id);
}) as typeof clearInterval;

// Timeouts set and neither fired nor cleared. A few short ones are always in flight (and a
// Drawer's interval can still be closing down at the snapshot), so only growth across the
// run counts: a leak adds one per mount, hundreds over the run (see TIMER_SLACK).
const timeouts = new Set<unknown>();
const { setTimeout: later, clearTimeout: cancel } = globalThis;
globalThis.setTimeout = ((fn: (...a: unknown[]) => void, ms?: number, ...args: unknown[]) => {
  const id = later(() => {
    timeouts.delete(id);
    fn(...args);
  }, ms);
  timeouts.add(id);
  return id;
}) as unknown as typeof setTimeout;
globalThis.clearTimeout = ((id: Parameters<typeof clearTimeout>[0]) => {
  timeouts.delete(id);
  cancel(id);
}) as typeof clearTimeout;
const TIMER_SLACK = 20;

// 11.7: one forced GC right after the last unmount still counted garbage that pending callbacks
// (React's scheduler, jsdom's queued work) held a moment longer, and a heavy story in a full run
// tripped the limit once on CI with nothing leaking. Let that work run (the real setTimeout, so it
// isn't counted as pending), collect twice, and keep the lowest of three readings.
const heap = async () => {
  const readings: number[] = [];
  for (let i = 0; i < 3; i++) {
    await new Promise((r) => later(r, 0));
    gc();
    gc();
    readings.push(process.memoryUsage().heapUsed);
  }
  return Math.min(...readings);
};
const snapshot = () => ({
  listeners: [...live].filter(([, n]) => n > 0).map(([k, n]) => `${k} ×${n}`).sort().join(', '),
  intervals: intervals.size,
  timeouts: timeouts.size,
  nodes: document.body.childNodes.length,
});

/** Mounts and unmounts `Story` `cycles` times; returns what grew in the second half, by check. */
async function leaks(Story: React.ComponentType, cycles = CYCLES): Promise<Record<string, string>> {
  const warm = Math.floor(cycles / 2);
  const cycle = async () => {
    // Async act: effects, lazy chunks and timers started on mount run before the unmount.
    await act(async () => {
      render(
        <NexubProvider>
          <Story />
        </NexubProvider>,
      );
    });
    cleanup();
  };
  for (let i = 0; i < warm; i++) await cycle();
  const before = { ...snapshot(), heap: await heap() };
  for (let i = warm; i < cycles; i++) await cycle();
  const after = { ...snapshot(), heap: await heap() };

  const failed: Record<string, string> = {};
  if (after.listeners !== before.listeners) failed.listeners = `${before.listeners || 'none'} → ${after.listeners}`;
  if (after.intervals > before.intervals + TIMER_SLACK) failed.intervals = `${before.intervals} → ${after.intervals} running`;
  if (after.timeouts > before.timeouts + TIMER_SLACK) failed.timeouts = `${before.timeouts} → ${after.timeouts} pending`;
  if (after.nodes > before.nodes) failed.nodes = `${before.nodes} → ${after.nodes} nodes in <body>`;
  const perCycle = (after.heap - before.heap) / (cycles - warm);
  if (perCycle > HEAP_PER_CYCLE) {
    // Over the limit: run the same number of mounts again. A leak keeps memory in every batch;
    // GC noise doesn't repeat. Both batches over the limit is a leak.
    for (let i = warm; i < cycles; i++) await cycle();
    const again = ((await heap()) - after.heap) / (cycles - warm);
    if (again > HEAP_PER_CYCLE) failed.heap = `${Math.round(perCycle)} then ${Math.round(again)} bytes kept per mount`;
  }
  return failed;
}

describe.each(stories)('%s', (key, Story) => {
  it(`leaves nothing behind after ${CYCLES} mounts`, async () => {
    const failed = await leaks(Story);
    // Exact match both ways, so KNOWN can only shrink.
    expect(Object.keys(failed).sort(), JSON.stringify(failed, null, 2)).toEqual(Object.keys(KNOWN[key] ?? {}).sort());
  });
});

// The harness must see a leak when there is one.
describe('controls', () => {
  it('reports a listener, an interval and a node that are never removed', async () => {
    const Leaky = () => {
      React.useEffect(() => {
        window.addEventListener('resize', () => {});
        setInterval(() => {}, 60_000);
        document.body.appendChild(document.createElement('i'));
      }, []);
      return null;
    };
    // 100 mounts: 50 measured, past TIMER_SLACK. Heap may or may not trip at so few cycles.
    expect(Object.keys(await leaks(Leaky, 100))).toEqual(expect.arrayContaining(['intervals', 'listeners', 'nodes']));
    intervals.forEach((id) => clearInterval(id as number));
    document.body.querySelectorAll('i').forEach((n) => n.remove());
  });

  it('reports memory that every mount keeps', async () => {
    const kept: unknown[] = [];
    const Leaky = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      React.useEffect(() => void kept.push(ref.current), []); // the unmounted DOM subtree stays reachable
      return (
        <div ref={ref}>
          {Array.from({ length: 12 }, (_, i) => (
            <button key={i}>Kept</button>
          ))}
        </div>
      );
    };
    expect(Object.keys(await leaks(Leaky, 400))).toContain('heap');
  });
});

it('KNOWN only lists stories that exist', () => {
  const keys = new Set<string>(stories.map(([k]) => k));
  expect(Object.keys(KNOWN).filter((k) => !keys.has(k))).toEqual([]);
});
