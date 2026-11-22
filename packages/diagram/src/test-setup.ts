import '@testing-library/jest-dom/vitest';

// React Flow in jsdom (reactflow.dev/learn/advanced-use/testing): it measures nodes with
// ResizeObserver and offsetWidth/Height, and reads the zoom from DOMMatrixReadOnly.
// Nodes with no size render with visibility: hidden, which hides them from getByRole.
class ResizeObserver {
  constructor(private callback: ResizeObserverCallback) {}
  // Async, as in a browser: React Flow's store has its DOM node by then.
  observe(target: Element) {
    setTimeout(() => this.callback([{ target } as ResizeObserverEntry], this as unknown as globalThis.ResizeObserver), 0);
  }
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserver as unknown as typeof globalThis.ResizeObserver;

class DOMMatrixReadOnly {
  m22: number;
  constructor(transform?: string) {
    const scale = transform?.match(/scale\(([1-9.]+)\)/)?.[1];
    this.m22 = scale !== undefined ? +scale : 1;
  }
}
(globalThis as unknown as { DOMMatrixReadOnly: unknown }).DOMMatrixReadOnly = DOMMatrixReadOnly;
(window as unknown as { DOMMatrixReadOnly: unknown }).DOMMatrixReadOnly = DOMMatrixReadOnly;

// A node card measures 240 × 72 (the layouts' default size); other elements their inline size or 1.
Object.defineProperties(window.HTMLElement.prototype, {
  offsetHeight: {
    get(this: HTMLElement) {
      if (this.classList.contains('react-flow__node')) return 72;
      return parseFloat(this.style.height) || 1;
    },
  },
  offsetWidth: {
    get(this: HTMLElement) {
      if (this.classList.contains('react-flow__node')) return 240;
      return parseFloat(this.style.width) || 1;
    },
  },
});

(window.SVGElement.prototype as unknown as { getBBox: () => DOMRect }).getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 }) as DOMRect;

window.HTMLElement.prototype.scrollIntoView = function () {};

// jsdom doesn't implement matchMedia — ThemeProvider and vaul read it
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }) as MediaQueryList;
}
