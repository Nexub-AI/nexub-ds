import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import * as React from 'react';
import { ThemeProvider, ThemeScript, themeScriptSource, useTheme } from './ThemeProvider.js';
import { renderToString } from 'react-dom/server';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Consumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>dark</button>
      <button onClick={() => setTheme('light')}>light</button>
      <button onClick={() => setTheme('system')}>system</button>
    </div>
  );
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Reset <html> attribute and localStorage before each test
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();

  // Default matchMedia mock: light system preference
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? false : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <span>hello</span>
      </ThemeProvider>,
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('defaults to system mode', () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('system');
  });

  it('applies data-theme attribute to <html>', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <Consumer />
      </ThemeProvider>,
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('resolves system preference to light when prefers-color-scheme is light', () => {
    render(
      <ThemeProvider defaultTheme="system">
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('resolved').textContent).toBe('light');
  });

  it('resolves system preference to dark when prefers-color-scheme is dark', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeProvider defaultTheme="system">
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('persists theme to localStorage when changed', () => {
    render(
      <ThemeProvider storageKey="test-key">
        <Consumer />
      </ThemeProvider>,
    );
    act(() => {
      screen.getByText('dark').click();
    });
    expect(localStorage.getItem('test-key')).toBe('dark');
  });

  it('reads initial theme from localStorage', () => {
    localStorage.setItem('nexub-theme', 'dark');
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('removes data-theme in system mode so CSS media queries apply', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    render(
      <ThemeProvider defaultTheme="system">
        <Consumer />
      </ThemeProvider>,
    );
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('updates data-theme when setTheme is called', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Consumer />
      </ThemeProvider>,
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    act(() => {
      screen.getByText('dark').click();
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    // Suppress expected React error output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(
      'useTheme must be used inside a <ThemeProvider>.',
    );
    spy.mockRestore();
  });
});

// ─── ThemeScript ──────────────────────────────────────────────────────────────

describe('glass dial', () => {
  function GlassConsumer() {
    const { glass, setGlass } = useTheme();
    return <button onClick={() => setGlass('off')}>{glass}</button>;
  }

  it('defaults to balanced and sets data-glass on <html>', () => {
    render(<ThemeProvider><GlassConsumer /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('balanced');
    expect(document.documentElement.getAttribute('data-glass')).toBe('balanced');
  });

  it('persists the choice and restores it', () => {
    const { unmount } = render(<ThemeProvider><GlassConsumer /></ThemeProvider>);
    act(() => screen.getByRole('button').click());
    expect(document.documentElement.getAttribute('data-glass')).toBe('off');
    expect(localStorage.getItem('nexub-glass')).toBe('off');
    unmount();
    render(<ThemeProvider><GlassConsumer /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('off');
  });
});

describe('ThemeScript', () => {
  it('applies the stored theme and product before paint', () => {
    localStorage.setItem('k', 'dark');
    localStorage.setItem('p', 'bookub');
    new Function(themeScriptSource('k', 'p'))();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-product')).toBe('bookub');
    document.documentElement.removeAttribute('data-product');
  });

  it('applies the stored glass intensity and ignores unknown values', () => {
    localStorage.setItem('nexub-glass', 'tinted');
    new Function(themeScriptSource('k'))();
    expect(document.documentElement.getAttribute('data-glass')).toBe('tinted');
    localStorage.setItem('nexub-glass', 'bogus');
    document.documentElement.removeAttribute('data-glass');
    new Function(themeScriptSource('k'))();
    expect(document.documentElement.hasAttribute('data-glass')).toBe(false);
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem('nexub-theme', 'system');
    new Function(themeScriptSource('nexub-theme'))();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('cannot be broken out of by a hostile storage key, and passes the nonce', () => {
    const html = renderToString(<ThemeScript storageKey={'</script><script>alert(1)//'} nonce="abc" />);
    expect(html).not.toContain('</script><script>');
    expect(html).toContain('nonce="abc"');
  });
});
