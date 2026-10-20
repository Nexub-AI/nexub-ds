import type { Preview } from '@storybook/react';
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
      return Story();
    },
  ],
};

export default preview;
