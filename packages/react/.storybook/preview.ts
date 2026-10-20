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
  },
  // @nexub/themes switches palette via `data-theme` and brand via `data-product` on <html>.
  decorators: [
    (Story, context) => {
      const root = document.documentElement;
      root.dataset.theme = String(context.globals.theme);
      const brand = String(context.globals.brand ?? 'none');
      if (brand === 'none') delete root.dataset.product;
      else root.dataset.product = brand;
      return Story();
    },
  ],
};

export default preview;
