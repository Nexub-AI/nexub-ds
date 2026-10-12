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
  },
  // @nexub/themes switches palette via a `data-theme` attribute on <html>.
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = String(context.globals.theme);
      return Story();
    },
  ],
};

export default preview;
