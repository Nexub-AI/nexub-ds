// 9.2: every story renders under StrictMode, and its server HTML hydrates with no mismatch.
// StrictMode double-invokes render and effects, so impure renders and effects that don't
// clean up show up as console errors; hydrateRoot reports a mismatch through
// onRecoverableError and console.error. Stories are the component inventory (one per state).
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { act, cleanup, render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NexubProvider } from './components/NexubProvider/index.js';

declare global {
  interface ImportMeta {
    glob<T>(pattern: string, options: { eager: true }): Record<string, T>;
  }
}

type StoryModule = Parameters<typeof composeStories>[0];
const modules = import.meta.glob<StoryModule>('./**/*.stories.tsx', { eager: true });
// The Storybook preview wraps every story in NexubProvider; so does this.
const stories = Object.entries(modules).flatMap(([file, mod]) =>
  Object.entries(composeStories(mod) as unknown as Record<string, React.ComponentType>).map(([name, S]) => {
    const Story = () => (
      <NexubProvider>
        <S />
      </NexubProvider>
    );
    return [`${file.slice(2)} ${name}`, Story] as const;
  }),
);

// `file story` → why it is still listed. Shrink-only: a fixed entry fails until removed.
const KNOWN: Record<string, string> = {};

function capture() {
  const errors: string[] = [];
  const spy = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args.map(String).join(' ')));
  return { errors, restore: () => spy.mockRestore() };
}

afterEach(cleanup);

describe.each(stories)('%s', (key, Story) => {
  const known = key in KNOWN;

  it.skipIf(known)('renders under StrictMode with no console error', () => {
    const { errors, restore } = capture();
    try {
      render(
        <React.StrictMode>
          <Story />
        </React.StrictMode>,
      );
    } finally {
      restore();
    }
    expect(errors).toEqual([]);
  });

  it.skipIf(known)('hydrates its server HTML with no mismatch', async () => {
    // Resolve React.lazy chunks first, as a server bundle already has them loaded
    // (renderToString can't wait on Suspense; Next.js streaming does).
    await act(async () => {
      render(<Story />);
    });
    cleanup();
    const html = renderToString(<Story />);
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const { errors, restore } = capture();
    const recoverable: string[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, <Story />, { onRecoverableError: (e) => recoverable.push(String(e)) });
      });
    } finally {
      restore();
      act(() => root?.unmount());
      container.remove();
    }
    expect([...recoverable, ...errors].map((m) => m.slice(0, 600))).toEqual([]);
  });
});

it('KNOWN only lists stories that exist', () => {
  const keys = new Set<string>(stories.map(([k]) => k));
  expect(Object.keys(KNOWN).filter((k) => !keys.has(k))).toEqual([]);
});
