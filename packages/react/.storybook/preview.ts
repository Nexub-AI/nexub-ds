import type { Preview } from '@storybook/react';
import * as React from 'react';
import { NexubProvider } from '../src/components/NexubProvider/index.js';
import './preview.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
  globalTypes: {
    theme: {
      description: 'Design-system theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Product brand (accent palette)',
      defaultValue: 'none',
      toolbar: {
        title: 'Brand',
        icon: 'circlehollow',
        items: ['none', 'leap', 'bookub', 'payub', 'founderub'],
        dynamicTitle: true,
      },
    },
    contrast: {
      description: 'Contrast level (data-contrast)',
      defaultValue: 'standard',
      toolbar: { title: 'Contrast', icon: 'contrast', items: ['standard', 'high'], dynamicTitle: true },
    },
    density: {
      description: 'Control density (data-density)',
      defaultValue: 'comfortable',
      toolbar: { title: 'Density', icon: 'grow', items: ['comfortable', 'compact'], dynamicTitle: true },
    },
    dir: {
      description: 'Text direction',
      defaultValue: 'ltr',
      toolbar: { title: 'Direction', icon: 'transfer', items: ['ltr', 'rtl'], dynamicTitle: true },
    },
    glass: {
      description: 'Glass intensity dial (data-glass)',
      defaultValue: 'balanced',
      toolbar: { title: 'Glass', icon: 'mirror', items: ['clear', 'balanced', 'tinted', 'off'], dynamicTitle: true },
    },
  },
  // @nexub/themes reads data-theme / data-product / data-contrast / data-density on <html>.
  decorators: [
    (Story, context) => {
      const root = document.documentElement;
      const g = context.globals;
      root.dataset.theme = String(g.theme);
      const set = (key: string, value: unknown, fallback: string) => {
        if (value === undefined || value === fallback) delete root.dataset[key];
        else root.dataset[key] = String(value);
      };
      set('product', g.brand, 'none');
      set('contrast', g.contrast, 'standard');
      set('density', g.density, 'comfortable');
      set('glass', g.glass, 'balanced');
      const dir = g.dir === 'rtl' ? 'rtl' : 'ltr';
      root.dir = dir;
      // Radix primitives (Slider, menus, tabs) read direction from the provider.
      return React.createElement(NexubProvider, { dir }, Story());
    },
  ],
};

export default preview;
