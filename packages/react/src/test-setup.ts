import '@testing-library/jest-dom';

// jsdom doesn't implement ResizeObserver — mock it for Radix/cmdk components that use it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom doesn't implement scrollIntoView — mock it for cmdk
if (typeof window !== "undefined") window.HTMLElement.prototype.scrollIntoView = function () {};

// jsdom doesn't implement matchMedia — vaul (Drawer/Sheet) reads it when it opens
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }) as MediaQueryList;
}
