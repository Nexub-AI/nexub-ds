import '@testing-library/jest-dom';

// jsdom doesn't implement ResizeObserver — mock it for Radix/cmdk components that use it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom doesn't implement scrollIntoView — mock it for cmdk
window.HTMLElement.prototype.scrollIntoView = function () {};
